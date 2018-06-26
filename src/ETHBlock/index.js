import Web3 from 'web3';
import compose from 'compose-funcs';
import HttpProvider from 'ethjs-provider-http';
import BlockTracker from 'eth-block-tracker';

import Network from 'ETHBlock/network';
import { composeAsync } from 'core/compose';

const log = console.log;
const create = C => (...arg) => new C(...arg);
const silentErr = cb => (...args) => {
  try {
    return cb && cb(...args);
  } catch (err) {
    log('[silentErr]', err.message);
  }
};

class BlockErr extends Error {
  constructor(message) {
    super(`[BlockErr] ${message}`);
    // Saving class name in the property
    // Capturing stack trace
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

  static watch({ blockCb: _cb1, txCb: cb2 } = {}) {
    const getBlockTracker = compose(
      provider => create(BlockTracker)({ provider }),
      create(HttpProvider),
      Network.getNetwork
    );

    const blockTracker = getBlockTracker();
    const blockCb = silentErr(_cb1);
    const txCb = silentErr(cb2);

    blockTracker.on('latest', ETHBlock.handleNewBlock({ blockCb, txCb }));
    blockTracker.on('error', ETHBlock.handleTrackErr);

    return blockTracker;
  }

  static handleTrackErr() {
    log('[blockTracker][ERR]');
  }

  static handleNewBlock({ blockCb, txCb }) {
    const { eth, utils } = ETHBlock.init();

    return async blockHex => {
      const newBlock = utils.hexToNumber(blockHex);
      const block = await eth.getBlock(newBlock);
      const { transactions: txIds, hash } = block;
      log('[handleNewBlock] txIds, hash', txIds, hash);

      blockCb(newBlock, hash);
      await Promise.all(txIds.map(composeAsync(eth.getTransaction, txCb)));
    };
  }

  static unWatch(tracker) {
    if (!tracker) return;
    tracker._maybeEnd();
  }
}

export default ETHBlock;

ETHBlock.watch();
