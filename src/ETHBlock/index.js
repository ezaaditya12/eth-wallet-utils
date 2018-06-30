import Web3 from 'web3';
import compose from 'compose-funcs';
import EthereumTx from 'ethereumjs-tx';
import { Wallet } from 'ethers';
import style from 'chalk';

import Network from 'ETHBlock/Network';
import Lock from 'ETHBlock/Lock';
import HDWallet from 'HDWallet';

import { log, create, silentErr } from 'core/helpers';

class BlockErr extends Error {
  constructor(message) {
    super(`[BlockErr] ${message}`);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class Tracker {
  static RUNNING = 'RUNNING';
  static STOP = 'STOP';

  constructor() {
    this.status = Tracker.RUNNING;
    this.timerId = null;
  }

  shouldRun() {
    return this.status === Tracker.RUNNING;
  }

  set(newState) {
    Object.assign(this, newState);
  }

  _reset() {
    this.set({
      status: Tracker.STOP,
      timerId: null
    });
  }

  stop() {
    this.timerId && clearTimeout(this.timerId);
    this._reset();
  }
}

class ETHBlock {
  constructor() {}

  static initWeb3() {
    return compose(
      create(Web3),
      create(Web3.providers.HttpProvider),
      Network.getNetwork
    )();
  }

  static newTracker() {
    return new Tracker();
  }

  static watch({ blockCb: _cb1, txCb: cb2 } = {}) {
    const tracker = ETHBlock.newTracker();

    const blockCb = silentErr(_cb1);
    const txCb = silentErr(cb2);
    ETHBlock._watch(tracker)({ blockCb, txCb });

    return tracker;
  }

  static _watch(tracker) {
    return ({ blockCb, txCb }) => {
      const _watchPromise = (async () => {
        try {
          const { eth } = ETHBlock.initWeb3();
          const latestBlockNo = +(await eth.getBlockNumber());
          const syncedBlockNo = +Lock.read() || latestBlockNo - 1;

          let next = syncedBlockNo + 1;
          let synced = syncedBlockNo === latestBlockNo;

          while (!synced && tracker.shouldRun()) {
            await ETHBlock._readBlock(next, { blockCb, txCb });
            synced = next === latestBlockNo;
            next = next + 1;
          }
        } catch (err) {
          log.info('[ETHBlock][watch]', err.message);
        } finally {
          if (tracker.shouldRun()) {
            log.info('[ETHBlock][watch] Kick Off Next Watch');
            ETHBlock.kickOffNextWatch(tracker, { blockCb, txCb });
          }
        }
      })();
      tracker.set({ _watchPromise });
    };
  }

  static kickOffNextWatch(tracker, { blockCb, txCb }) {
    const { WATCH_INTERVAL } = process.env;
    const timerId = setTimeout(() => ETHBlock._watch(tracker)({ blockCb, txCb }), WATCH_INTERVAL);
    tracker.set({ timerId });
  }

  static unWatch(tracker) {
    tracker.stop();
  }

  static async _readBlock(blockNo, { blockCb, txCb }) {
    const GET_TRANSACTION = true;
    const { eth } = ETHBlock.initWeb3();

    const block = await eth.getBlock(blockNo, GET_TRANSACTION);
    const { number: height, hash, transactions: txs } = block;

    log.info('[readBlock] height, hash:', height, hash);
    log.info('[readBlock] txs:', `${JSON.stringify(txs).substr(0, 50)}...`);

    blockCb({ height, hash });
    txs.map(tx => txCb(tx));

    Lock.write(height);
  }

  static _logTransfer = ({ from, receiveAcc, amount, txHash, tag }) => {
    const { utils } = ETHBlock.initWeb3();
    const shorten = str => str.substr(0, 16);

    const fromAcc = `${shorten(from)}...`;
    const toAcc = `${shorten(receiveAcc)}...`;
    const _amountEth = utils.fromWei(`${amount}`, 'ether');
    const amountETH = Number(_amountEth).toFixed(5);

    tag = tag || 'collect';
    log(`[${tag}] 📜  Transaction Hash: ${style.blue(txHash)}`);
    log(`[${tag}] 💰  ${fromAcc}  ➡️   ${toAcc} : ${style.blue(amountETH)} ETH`);
  };

  /**
   * Transfer current balance of child's account
   *
   * @static
   * @param {*} { childNode, receiveAcc, transferCb }
   * @returns
   * @memberof ETHBlock
   */
  static async _transferAll({ prvKey, receiveAcc, transferCb }) {
    const { eth, utils } = ETHBlock.initWeb3();

    const from = HDWallet.walletFromPrv(prvKey).address;
    const nonce = await eth.getTransactionCount(from);

    const balance = await eth.getBalance(from);
    const gasPrice = await eth.getGasPrice();
    const gas = 21000;
    const amount = balance - gasPrice * gas;

    if (amount < 0) {
      const balanceETH = utils.fromWei(balance);
      log.info(`[_transferAll] Child Account doesn't have enough coin to send. Balance: ${style.blue(balanceETH)} ETH`);
      return;
    }

    const txInfo = {
      nonce,
      to: receiveAcc,
      gas: utils.toHex(gas),
      value: utils.toHex(amount),
      gasPrice: utils.toHex(gasPrice)
    };

    const txHash = await ETHBlock._createTransaction({ prvKey, txInfo });
    ETHBlock._logTransfer({ from, receiveAcc, amount, txHash });
    transferCb({ from, receiveAcc, amount, txHash });
    return txHash;
  }

  /**
   * Send ETH from A -> B
   * Input shape:
   *   + from: Private Key
   *   + to: Receive Address
   *   + amount: in ETHER
   *
   * Input ex:
   *    {
   *      from: '0x0000000000000000000000000000000000000000000000000000000000000000',
   *      to: '0x3226e780E5d76034a0c93205957d5cFE9e782Eb8',
   *      amount: 0.1 //ETH
   *    }
   *
   * @param {*} param0
   */
  static async send({ from: prvKey, to, amount }) {
    const { eth, utils } = ETHBlock.initWeb3();

    const from = HDWallet.walletFromPrv(prvKey).address;
    const nonce = await eth.getTransactionCount(from);
    const gasPrice = await eth.getGasPrice();
    const amountInWei = utils.toWei(`${amount}`, 'ether');

    const txInfo = {
      to,
      nonce: utils.toHex(nonce),
      gasPrice: utils.toHex(gasPrice),
      gas: utils.toHex(21000),
      value: utils.toHex(amountInWei)
    };

    const txHash = await ETHBlock._createTransaction({ prvKey, txInfo });
    ETHBlock._logTransfer({
      from,
      txHash,
      receiveAcc: to,
      amount: amountInWei,
      tag: 'send'
    });
    return txHash;
  }

  static async _createTransaction({ prvKey, txInfo }) {
    // @TODO: Check required key of txInfo
    // @WARN: Spend concurrently on same must transaction IN ORDER
    // txInfo.gas = '0x2710';

    log.info('[txInfo]', txInfo);

    const tx = new EthereumTx(txInfo);
    const prvKeyWeb3Format = prvKey.substr(2); //Remove "0x" prefix

    tx.sign(new Buffer(prvKeyWeb3Format, 'hex'));
    const serializedTx = tx.serialize();

    const { eth } = ETHBlock.initWeb3();
    const promiEvent = eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`);

    return await promiEvent.then(receipt => receipt.transactionHash);
  }

  static async getBalanceInETH(address) {
    const { eth, utils } = ETHBlock.initWeb3();
    const balance = await eth.getBalance(address);
    return utils.fromWei(balance);
  }

  /**
   * Collect all money from children
   * Child info should have:
   *   + Address
   *   + Derive path, ex: m/44'/60'/0'/0
   *
   * @static
   * @param {*} {mnemonic, children, receiveAcc}
   * @memberof ETHBlock
   */
  static async collect({ mnemonic, children, receiveAcc, collectCb: _cb }) {
    log('[collect] mnemonic:', style.blue(receiveAcc));
    log('[collect] Receive Account:', style.blue(receiveAcc));
    log('[collect] Looking children\'s account...');
    log('[collect] This often take ~ 1 minute');

    const collectCb = silentErr(_cb);
    const masterNode = HDWallet.fromMnemonic(mnemonic);

    // Get child's private key
    const prvKeys = children.map(info => {
      const { address, derivePath } = info;

      const childNode = masterNode.derivePath(derivePath);
      const prvKey = childNode.privateKey;
      const wallet = new Wallet(prvKey);

      const sameAdr = address === wallet.address;
      if (!sameAdr) {
        log.info('[collect][WARN] Find child ERR: Address & Derive Path not match');
      }

      return prvKey;
    });

    // Use private key to send coin
    log('[collect] Starting transfer...');
    const txHashes = await Promise.all(
      prvKeys.map(prvKey => ETHBlock._transferAll({ prvKey, receiveAcc, transferCb: collectCb }))
    );

    const validTxHashed = txHashes.filter(Boolean);
    log.info('[collect] Transaction Hashes:');
    log.info(validTxHashed);
    
    const receiveAccBalance = await ETHBlock.getBalanceInETH(receiveAcc);
    log(`[collect] 💼  Receive Account Address: ${style.blue(receiveAcc)}`);
    log(`[collect] 💰  Receive Account Balance: ${style.blue(receiveAccBalance)} ETH`);
    log('[collect] Finished.');
  }
}

export default ETHBlock;
