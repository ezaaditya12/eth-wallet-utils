import HDWallet from 'HDWallet';

const createWeb3 = {
  case1: {
    apiKey: 'version',
    versionAPI: /1.0/
  }
};

const watchBlock = {
  case1: {
    oldBlock: 3510386,
    WATCH_TIMEOUT: 5 * 1000,
    HASH_LENGTH: 66,
    ADR_LENGTH: 42,
    blockCbCalledTimes: 1,
    txCbCalledTimes: 2
  }
};

const collectCases = {
  case1: {
    endUserPrv:
      '0xa61c5626b69112a408e807ab75a6afea4713eba954ce4a5b38d08700f4888a7d',
    mnemonic: HDWallet.newMnemonic(),
    endUserSpends: [0.005, 0.008],
    WAIT_COLLECT_TIMEOUT: 120 * 1000, //Wait for 2 spends
    receiveAcc: '0x81148ea6b5DC73e6afb13FbCC7DA9B578b0A6B84',
    collectBase: 0.012,
  }
};

export { createWeb3, watchBlock, collectCases };
