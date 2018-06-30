"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NetworkErr = exports.default = void 0;

var _os = _interopRequireDefault(require("os"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NetworkErr extends Error {
  constructor(message) {
    super(`[NetworkErr] ${message}`); // Saving class name in the property
    // Capturing stack trace

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

}

exports.NetworkErr = NetworkErr;

class Network {
  constructor() {}

  static checkRequiredInfo() {
    const {
      ETH_NODE_SERVER
    } = process.env;
    const hasAll = ETH_NODE_SERVER;

    if (!hasAll) {
      const message = ['Please provide:', 'ETH_NODE_SERVER', 'in .env file'].join(_os.default.EOL);
      throw new NetworkErr(message);
    }

    return true;
  }

  static getNetwork() {
    Network.checkRequiredInfo();
    const {
      ETH_NODE_SERVER
    } = process.env;
    return ETH_NODE_SERVER;
  }

}

var _default = Network;
exports.default = _default;