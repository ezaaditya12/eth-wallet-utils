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
    const { ETH_NODE_SERVER } = process.env;
    const hasAll = ETH_NODE_SERVER;
    if (!hasAll) {
      const message = [
        'Please provide:',
        'ETH_NODE_SERVER',
        'in .env file'
      ].join(os.EOL);
      throw new NetworkErr(message);
    }

    return true;
  }

  static getNetwork() {
    Network.checkRequiredInfo();
    const { ETH_NODE_SERVER } = process.env;
    return ETH_NODE_SERVER;
  }
}

export default Network;
export { NetworkErr };