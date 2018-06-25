import Network from 'ETHBlock/network';
import Web3 from 'web3';
import compose from 'compose-funcs';

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
    const listener = web3.eth.subscribe('latest', (err, result) => {
      if (err) throw BlockErr('Fail to subscribe \'latest\' event');
      log(result);
    });

    listener.on('data', result => {
      log(result);
    });
  }
}

export default ETHBlock;
