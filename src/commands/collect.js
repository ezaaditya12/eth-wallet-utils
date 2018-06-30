import os from 'os';
import style from 'chalk';

import { log } from 'core/helpers';
import ETHBlock from 'ETHBlock';
import HDWallet from 'HDWallet';

class CollectCMDErr extends Error {
  constructor(message) {
    super(`[CollectCMD] ${message}`);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class CollectCMD {
  /**
   * Handle collect money
   * @param {string} mnemonic
   * @param {string} receiveAcc
   */
  static async cmd(_mnemonic, _receiveAcc) {
    const mnemonic = CollectCMD.useEnvVarIfMissing('MNEMONIC', _mnemonic);
    const receiveAcc = CollectCMD.useEnvVarIfMissing('RECEIVE_ACCOUNT', _receiveAcc);
    const db = CollectCMD.getDBProvider();
    
    CollectCMD.checkInputs({ mnemonic, receiveAcc, db });

    const children = await db.getUnCollectedAccounts();
    const collectCb = db.updateUnCollectedAccounts;
    await ETHBlock.collect({ mnemonic, children, receiveAcc, collectCb });
  }

  static getDBProvider() {
    if (process.env.NODE_ENV !== 'production') return global.db;
    // return require('db');
    return {
      getUnCollectedAccounts: () => {},
      updateUnCollectedAccounts: () => {},
    };
  }

  static useEnvVarIfMissing(key, val) {
    if (process.env.NODE_ENV !== 'production') return val;
    return val ? val : process.env[key];
  }

  static checkInputs(inputs = {}) {
    const { mnemonic, receiveAcc, db } = inputs;
    const shouldHaveVal = mnemonic && receiveAcc && db;
    if (!shouldHaveVal)
      throw new CollectCMDErr(
        [
          'Missing inputs. Required fields:',
          '  + mnemonic',
          '  + receiveAcc'
        ].join(os.EOL)
      );

    if (!HDWallet.isValidMnemonic(mnemonic))
      throw new CollectCMDErr(
        [
          'mnemonic phrase is invalid. Please check it.',
          `  + Input mnemonic: ${style.blue(mnemonic)}`,
          `  + Using ${style.blue(
            'quote'
          )} if passing string with space in terminal`
        ].join(os.EOL)
      );

    if (!HDWallet.isValidAddress(receiveAcc))
      throw new CollectCMDErr(
        [
          'Receive Account Address is invalid. Please check it.',
          `  + Input address: ${style.blue(receiveAcc)}`
        ].join(os.EOL)
      );

    ['getUnCollectedAccounts', 'updateUnCollectedAccounts'].map(fn => {
      if(typeof db[fn] !== 'function')
        throw new CollectCMDErr(`DB Provider required function: ${style.blue(fn)}`); 
    });  

    return true;
  }
}

const collectCmd = program => {
  program
    .command('collect <mnemonic> <receiveAcc>')
    .description(
      [
        'Collect all money from children\'s account',
        '  + mnemonic: mnemonic 12 words phrase',
        '  + receiveAcc: Receive Account address'
      ].join(os.EOL)
    )
    .action(CollectCMD.cmd);
};

export default collectCmd;
export { CollectCMD, CollectCMDErr, collectCmd };
