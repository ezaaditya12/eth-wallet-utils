"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectCmd = exports.CollectCMDErr = exports.CollectCMD = exports.default = void 0;

var _os = _interopRequireDefault(require("os"));

var _chalk = _interopRequireDefault(require("chalk"));

var _helpers = require("core/helpers");

var _ETHBlock = _interopRequireDefault(require("ETHBlock"));

var _HDWallet = _interopRequireDefault(require("HDWallet"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CollectCMDErr extends Error {
  constructor(message) {
    super(`[CollectCMD] ${message}`);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

}

exports.CollectCMDErr = CollectCMDErr;

class CollectCMD {
  /**
   * Handle collect money
   * @param {string} mnemonic
   * @param {string} receiveAcc
   */
  static async cmd(mnemonic, receiveAcc) {
    mnemonic = CollectCMD.useEnvVarIfMissing('MNEMONIC', mnemonic);
    receiveAcc = CollectCMD.useEnvVarIfMissing('RECEIVE_ACCOUNT', receiveAcc);
    const db = CollectCMD.getDBProvider();
    CollectCMD.checkInputs({
      mnemonic,
      receiveAcc,
      db
    });
    const children = await db.getUnCollectedAccounts();
    const collectCb = db.updateUnCollectedAccounts;
    await _ETHBlock.default.collect({
      mnemonic,
      children,
      receiveAcc,
      collectCb
    });
  }

  static getDBProvider() {
    const {
      DB_FILE_PATH
    } = process.env;
    return require(DB_FILE_PATH);
  }

  static useEnvVarIfMissing(key, val) {
    if (process.env.NODE_ENV !== 'production') return val;
    return val ? val : process.env[key];
  }

  static checkInputs(inputs = {}) {
    const {
      mnemonic,
      receiveAcc,
      db
    } = inputs;
    const shouldHaveVal = mnemonic && receiveAcc && db;
    if (!shouldHaveVal) throw new CollectCMDErr(['Missing inputs. Required fields:', '  + mnemonic', '  + receiveAcc', '  + db: DB Provider'].join(_os.default.EOL));
    if (!_HDWallet.default.isValidMnemonic(mnemonic)) throw new CollectCMDErr(['mnemonic phrase is invalid. Please check it.', `  + Input mnemonic: ${_chalk.default.blue(mnemonic)}`, `  + Using ${_chalk.default.blue('quote')}` + 'when passing mnemonic in terminal'].join(_os.default.EOL));
    if (!_HDWallet.default.isValidAddress(receiveAcc)) throw new CollectCMDErr(['Receive Account Address is invalid. Please check it.', `  + Input address: ${_chalk.default.blue(receiveAcc)}`].join(_os.default.EOL));
    ['getUnCollectedAccounts', 'updateUnCollectedAccounts'].map(fn => {
      if (typeof db[fn] !== 'function') throw new CollectCMDErr(`DB Provider required function: ${_chalk.default.blue(fn)}`);
    });
    return true;
  }

}

exports.CollectCMD = CollectCMD;

const collectCmd = program => {
  program.command('collect <mnemonic> <receiveAcc>').description(['Collect all money from children\'s account', '  + mnemonic: mnemonic 12 words phrase', '  + receiveAcc: Receive Account address'].join(_os.default.EOL)).action(CollectCMD.cmd);
};

exports.collectCmd = collectCmd;
var _default = collectCmd;
exports.default = _default;