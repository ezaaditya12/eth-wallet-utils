"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MnemonicErr = exports.default = void 0;

var _bip = _interopRequireDefault(require("bip39"));

var _composeFuncs = _interopRequireDefault(require("compose-funcs"));

var _ethers = require("ethers");

var _web = _interopRequireDefault(require("web3"));

var _helpers = require("core/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MnemonicErr extends Error {
  constructor(message) {
    super(`[MnemonicErr] ${message}`, 1);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

}

exports.MnemonicErr = MnemonicErr;

class HDWallet {
  static generate({
    offset,
    limit
  }) {
    return masterNode => Array(limit).fill(null).map((_, index) => {
      const childPath = `${HDWallet.BIP44}/${offset + index}`;
      const childNode = masterNode.derivePath(childPath);
      const wallet = new _ethers.Wallet(childNode.privateKey);
      return {
        address: wallet.address,
        derivePath: childPath
      };
    });
  }

  static fromMnemonic(mnemonic) {
    if (!HDWallet.isValidMnemonic(mnemonic)) throw new MnemonicErr('Invalid mnemonic. ' + 'Note: mnemonic phrase should be 12 words and implement BIP39.');
    return _ethers.HDNode.fromMnemonic(mnemonic);
  }

  static newMnemonic() {
    return _bip.default.generateMnemonic();
  }

  static newOne() {
    return (0, _composeFuncs.default)(HDWallet.fromMnemonic, HDWallet.newMnemonic)();
  }

  static getHDWalletAddress(hdWallet) {
    return new _ethers.Wallet(hdWallet.privateKey).address;
  }

  static walletFromPrv(prvKey) {
    return new _ethers.Wallet(prvKey);
  }

  static newWallet() {
    return _ethers.Wallet.createRandom();
  }

  static isValidMnemonic(mnemonic) {
    return _bip.default.validateMnemonic(mnemonic);
  }

  static isValidAddress(address) {
    return _web.default.utils.isAddress(address);
  }

}

_defineProperty(HDWallet, "BIP44", 'm/44\'/60\'/0\'/0');

var _default = HDWallet;
exports.default = _default;