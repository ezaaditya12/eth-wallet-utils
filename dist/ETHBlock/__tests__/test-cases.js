"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectCases = exports.watchBlock = exports.createWeb3 = void 0;

var _HDWallet = _interopRequireDefault(require("HDWallet"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ADR_LENGTH = 42;
const HASH_LENGTH = 66;
const createWeb3 = {
  case1: {
    apiKey: 'version',
    versionAPI: /1.0/
  }
};
exports.createWeb3 = createWeb3;
const watchBlock = {
  case1: {
    ADR_LENGTH,
    HASH_LENGTH,
    oldBlock: 3510386,
    WATCH_TIMEOUT: 5 * 1000,
    blockCbCalledTimes: 1,
    txCbCalledTimes: 2
  },
  case2: {
    WATCH_TIMEOUT: 5 * 60 * 1000,
    blockCbCalledTimes: 30,
    // Block Time: ~10s
    txCbCalledTimes: 30 * 2 // Txs in Block: ~2

  }
};
exports.watchBlock = watchBlock;
const collectCases = {
  case1: {
    endUserPrv: '0xa61c5626b69112a408e807ab75a6afea4713eba954ce4a5b38d08700f4888a7d',
    mnemonic: _HDWallet.default.newMnemonic(),
    endUserSpends: [0.005, 0.008],
    receiveAcc: '0x81148ea6b5DC73e6afb13FbCC7DA9B578b0A6B84',
    HASH_LENGTH,
    WAIT_COLLECT_TIMEOUT: 150 * 1000,
    //Wait for 2 spends
    WAIT_INFO_TIMEOUT: 7 * 1000
  }
};
exports.collectCases = collectCases;