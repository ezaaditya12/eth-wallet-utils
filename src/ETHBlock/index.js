import Web3 from 'web3';
import compose from 'compose-funcs';
import EthereumTx from 'ethereumjs-tx';
import { Wallet } from 'ethers';

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

class ETHBlock {
  constructor() {}

  static init() {
    return compose(
      create(Web3),
      create(Web3.providers.HttpProvider),
      Network.getNetwork
    )();
  }

  static async watch({ blockCb: _cb1, txCb: cb2 } = {}) {
    const blockCb = silentErr(_cb1);
    const txCb = silentErr(cb2);
    let timerId = null;

    try {
      const { eth } = ETHBlock.init();
      const latestBlockNo = await eth.getBlockNumber();
      const syncedBlockNo = +Lock.read() || latestBlockNo - 1;
      let synced = syncedBlockNo === latestBlockNo;

      while (!synced) {
        const next = syncedBlockNo + 1;
        await ETHBlock.readBlock(next, { blockCb, txCb });
        synced = next === latestBlockNo;
      }

      log('[ETHBlock][watch] Synced');
    } catch (err) {
      log('[ETHBlock][watch]', err.message);
    } finally {
      log('[ETHBlock][watch] Kick Off Next Watch');
      timerId = ETHBlock.kickOffNextWatch({ blockCb, txCb });
    }

    return timerId;
  }

  static kickOffNextWatch({ blockCb, txCb }) {
    const { WATCH_INTERVAL } = process.env;

    const timerId = setTimeout(
      () => ETHBlock.watch({ blockCb, txCb }),
      WATCH_INTERVAL
    );

    return timerId;
  }

  static unWatch(timerId) {
    if (!timerId) return;
    clearTimeout(timerId);
  }

  static async readBlock(blockNo, { blockCb, txCb }) {
    const GET_TRANSACTION = true;
    const { eth } = ETHBlock.init();

    const block = await eth.getBlock(blockNo, GET_TRANSACTION);
    const { number: height, hash, transactions: txs } = block;

    log('[readBlock] height, hash:', height, hash);
    log('[readBlock] txs[0]:', txs[0]);

    blockCb({ height, hash });
    txs.map(tx => txCb(tx));

    Lock.write(height);
  }

  static logTransfer = ({ from, receiveAcc, amount }) => {
    const { utils } = ETHBlock.init();

    const fromAcc = `${from.substr(0, 16)}...`;
    const toAcc = `${receiveAcc.substr(0, 16)}...`;
    const amountEth = utils.fromWei(amount).toFixed(5);

    log(`[collect] ฿ ${fromAcc} ⇨ ${toAcc} : ${amountEth} ETH`);
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
    const { eth, utils } = ETHBlock.init();

    const from = new Wallet(prvKey).address;
    const nonce = await eth.getTransactionCount(from);

    const balance = await eth.getBalance(from);
    const gasPrice = await eth.getGasPrice();
    const amount = balance - gasPrice;

    const txInfo = {
      nonce,
      gasPrice,
      to: receiveAcc,
      value: utils.toHex(amount)
    };

    const tx = new EthereumTx(txInfo).sign(new Buffer(prvKey, 'hex'));
    const rawTx = tx.serialize();
    const txHash = eth.sendRawTransaction('0x' + rawTx.toString('hex'));

    ETHBlock.logTransfer({ from, receiveAcc, amount });
    transferCb({ from, receiveAcc, amount, txHash });

    return txHash;
  }

  static transaction() {}

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
    log('[collect] Receive Account:', receiveAcc);
    log('[collect] Looking children\'s account...');
    log('[collect] This often take ~1m...');

    const collectCb = silentErr(_cb);
    const masterNode = HDWallet.fromMnemonic(mnemonic);

    const prvKeys = children.map(info => {
      const { address, derivePath } = info;

      const childNode = masterNode.derivePath(derivePath);
      const prvKey = childNode.privateKey;
      const wallet = new Wallet(prvKey);

      const sameAdr = address === wallet.address;
      if (!sameAdr) {
        log('[collect][WARN] Find child ERR: Address & Derive Path not match');
      }

      return prvKey;
    });

    const txHashes = await Promise.all(
      prvKeys.map(prvKey =>
        ETHBlock._transferAll({ prvKey, receiveAcc, transferCb: collectCb })
      )
    );

    log('[collect] txHashes:', txHashes);
    log('[collect] Finished');
  }
}

export default ETHBlock;
