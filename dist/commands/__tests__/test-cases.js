"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectCases = void 0;

var _HDWallet = _interopRequireDefault(require("HDWallet"));

var _collect = require("commands/collect");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mnemonic = _HDWallet.default.newMnemonic();

const receiveAcc = '0x81148ea6b5DC73e6afb13FbCC7DA9B578b0A6B84';
const collectCases = {
  validateArgs: {
    invalidMnemonic: {
      name: 'Invalid mnemonic',
      mnemonic: 'xxx',
      receiveAcc,
      Err: _collect.CollectCMDErr,
      errMsg: /mnemonic phrase/
    },
    invalidRA: {
      name: 'Invalid Receive Account',
      mnemonic,
      receiveAcc: 'xxx',
      Err: _collect.CollectCMDErr,
      errMsg: /Receive Account/
    }
  },
  validateProdDB: {
    mnemonic,
    receiveAcc,
    Err: _collect.CollectCMDErr
  }
};
exports.collectCases = collectCases;