import HDWallet from 'HDWallet';

const collectCases = {
  validateArgs: [
    {
      name: 'Missing mnemonic',
      mnemonic: null,
      receiveAcc: '0x81148ea6b5DC73e6afb13FbCC7DA9B578b0A6B84'
    },
    {
      name: 'Missing Receive Account',
      mnemonic: HDWallet.newMnemonic(),
      receiveAcc: null
    }
  ],
  setupScenario: {
    endUserPrv:
      '0xa61c5626b69112a408e807ab75a6afea4713eba954ce4a5b38d08700f4888a7d'
  }
};

export { collectCases };
