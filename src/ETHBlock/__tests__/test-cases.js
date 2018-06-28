import HDWallet from 'HDWallet';

const { END_USER_PRV } = process.env;

const createWeb3 = {
  case1: {
    apiKey: 'version',
    versionAPI: /1.0/
  }
};

const watchBlock = {
  case1: {
    oldBlock: 3510386,
    WATCH_TIME: 8 * 1000,
    WATCH_MAX_TIME: 10 * 1000,
    HASH_LENGTH: 66,
    ADR_LENGTH: 42,
    blockCbCalledTimes: 1,
    txCbCalledTimes: 2
  }
};

const collectCases = {
  case1: {
    endUserPrv: END_USER_PRV,
    hdWalletMnemonic: HDWallet.newMnemonic(),
    endUserSpends: [0.005, 0.008],
    collectTotal: 0.012
  }
};

export { createWeb3, watchBlock, collectCases };
