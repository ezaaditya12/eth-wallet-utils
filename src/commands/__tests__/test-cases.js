import HDWallet from 'HDWallet';

const mnemonic = HDWallet.newMnemonic();
const receiveAcc = '0x81148ea6b5DC73e6afb13FbCC7DA9B578b0A6B84';

const collectCases = {
  validateDBProvider: {
    missingDB: {
      setup: {
        db: null,
      },
      cases: {
        case1: {
          name: 'Missing DB Provider',
          mnemonic,
          receiveAcc,
          errMsg: /Missing inputs/
        }
      }
    },
    requiredFn: {
      setup: {
        db: {
          getUnCollectedAccounts: () => {},
          // updateUnCollectedAccounts: () => {},
        },
      },
      cases: {
        case1: {
          name: 'Required Fn',
          mnemonic,
          receiveAcc,
          errMsg: /updateUnCollectedAccounts/
        }
      }
    }
  },
  validateArgs: {
    setup: {
      db: {
        getUnCollectedAccounts: () => {},
        updateUnCollectedAccounts: () => {},
      }
    },
    cases: {
      invalidMnemonic: {
        name: 'Invalid mnemonic',
        mnemonic: 'xxx',
        receiveAcc,
        errMsg: /mnemonic phrase/
      },
      invalidRA: {
        name: 'Invalid Receive Account',
        mnemonic,
        receiveAcc: 'xxx',
        errMsg: /Receive Account/
      }
    }
  },
};

export { collectCases };
