import os from 'os';

class NetworkErr extends Error {
  constructor(message) {
    super(`[NetworkErr] ${message}`);
    // Saving class name in the property
    // Capturing stack trace
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class Network {
  constructor() {}

  static checkRequiredInfo() {
    const { ETH_NETWORK, INFURA_TOKEN } = process.env;
    const hasAll = ETH_NETWORK && INFURA_TOKEN;
    if (!hasAll) {
      const message = [
        'Please provide:',
        '  + INFURA_TOKEN',
        '  + ETH_NETWORK',
        'in .env file'
      ].join(os.EOL);
      throw new NetworkErr(message);
    }

    return true;
  }

  static getNetwork() {
    Network.checkRequiredInfo();
    const { ETH_NETWORK, INFURA_TOKEN } = process.env;
    return `https://${ETH_NETWORK}.infura.io/${INFURA_TOKEN}`;
  }
}

export default Network;
export { NetworkErr };
