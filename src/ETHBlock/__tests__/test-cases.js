import HDWallet from 'HDWallet';

const ADR_LENGTH = 42;
const HASH_LENGTH = 66;

const createWeb3 = {
  case1: {
    apiKey: 'version',
    versionAPI: /1.0/
  }
};

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
    blockCbCalledTimes: 18, // Block Time: ~10s
    txCbCalledTimes: 18 * 2, // Txs in Block: ~2
  }
};

const collectCases = {
  case1: {
    endUserPrv:
      '0xa61c5626b69112a408e807ab75a6afea4713eba954ce4a5b38d08700f4888a7d',
    mnemonic: HDWallet.newMnemonic(),
    endUserSpends: [0.005, 0.008],
    receiveAcc: '0x81148ea6b5DC73e6afb13FbCC7DA9B578b0A6B84',
    HASH_LENGTH,
    WAIT_COLLECT_TIMEOUT: 200 * 1000, //Wait for collect 2 spends
    WAIT_INFO_TIMEOUT: 7 * 1000
  }
};

export { createWeb3, watchBlock, collectCases };
