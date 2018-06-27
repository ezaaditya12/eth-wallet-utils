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

export { createWeb3, watchBlock };
