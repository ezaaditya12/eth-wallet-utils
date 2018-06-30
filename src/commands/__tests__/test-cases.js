import HDWallet from 'HDWallet';
import { CollectCMDErr } from 'commands/collect';

const mnemonic = HDWallet.newMnemonic();
const receiveAcc = '0x81148ea6b5DC73e6afb13FbCC7DA9B578b0A6B84';

const collectCases = {
  validateArgs: {
    invalidMnemonic: {
      name: 'Invalid mnemonic',
      mnemonic: 'xxx',
      receiveAcc,
      Err: CollectCMDErr,
      errMsg: /mnemonic phrase/
    },
    invalidRA: {
      name: 'Invalid Receive Account',
      mnemonic,
      receiveAcc: 'xxx',
      Err: CollectCMDErr,
      errMsg: /Receive Account/
    }
  },
  validateProdDB: {
    mnemonic,
    receiveAcc,
    Err: CollectCMDErr,
  }
};

export { collectCases };
