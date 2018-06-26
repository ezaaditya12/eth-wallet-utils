import Web3 from 'web3';
import compose from 'compose-funcs';
import Network from 'ETHBlock/network';
import HttpProvider from 'ethjs-provider-http';
import PollingBlockTracker from 'eth-block-tracker';

const log = console.log;
const create = c => arg => new c(arg);

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

  static watch({ blockCb, txCb } = {}) {
    const web3 = ETHBlock.init();

    const getBlockTracker = compose(
      create(PollingBlockTracker),
      //@see: https://github.com/MetaMask/eth-block-tracker#methods
      provider => ({ provider, keepEventLoopActive: false }),
      create(HttpProvider),
      Network.getNetwork
    );

    const blockTracker = getBlockTracker();

    blockTracker.on('latest', blockHex => {
      const newBlock = web3.utils.hexToNumber(blockHex);
      log('[newBlock]', newBlock);

      blockCb && blockCb(newBlock);

      web3.eth.getBlock(newBlock).then(async block => {
        const { transactions: txIds } = block;
        const txs = await Promise.all(
          txIds.map(txId => web3.eth.getTransaction(txId))
        );
        // log('[txs]', txs);
        txCb && txCb(txs);
      });
    });

    blockTracker.on('error', () => log('[blockTracker][ERR]'));

    return blockTracker;
  }

  static unWatch(tracker) {
    if (!tracker) return;
    tracker._maybeEnd();
  }
}

export default ETHBlock;

ETHBlock.watch();
