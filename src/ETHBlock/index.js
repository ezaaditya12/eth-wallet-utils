import Web3 from 'web3';
import compose from 'compose-funcs';

import Network from 'ETHBlock/Network';
import Lock from 'ETHBlock/Lock';

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

  static getGasPrice(adr){

  }

  static getBalance(adr){

  }

  static buildTransaction(){
    
  }
}

export default ETHBlock;
