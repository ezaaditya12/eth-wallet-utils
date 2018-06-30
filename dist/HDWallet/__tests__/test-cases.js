"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateCases = exports.createCases = void 0;

var _HDWallet = require("HDWallet");

const createCases = {
  case1: {
    mnemonic: 'unknown seed kit come final jacket final protect wedding inquiry spin silver',
    hdWalletAdr: '0xE6EA8442BD58A0241a50f088eDEb5a0C99bfA888'
  },
  invalid: {
    mnemonic: 'forces test results output highlighting',
    Error: _HDWallet.MnemonicErr
  }
};
exports.createCases = createCases;
const generateCases = {
  case1: {
    mnemonic: 'unknown seed kit come final jacket final protect wedding inquiry spin silver',
    firstChildAdr: '0x44fc045c917b572857dF9C73e0A6202C583831c2'
  }
};
exports.generateCases = generateCases;