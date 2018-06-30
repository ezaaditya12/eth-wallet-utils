import os from 'os';
import style from 'chalk';

import { log } from 'core/helpers';
import ETHBlock from 'ETHBlock';
import HDWallet from 'HDWallet';

// import db from 'db';

/** ============ DB integration ============ */
// Fake to test first
const db = {};

db.getUnCollectedAccounts = () => {
  return [
    {
      address: '',
      derivePath: ''
    }
  ];
};

db.updateUnCollectedAccounts = () =>
  log.info('[collect] Mark child\'s account as collected');

const collectCb = db.updateUnCollectedAccounts;

/** =============== Collect ============= */
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
  static async cmd(mnemonic, receiveAcc) {
    mnemonic = CollectCMD.useEnvVariableIfMissing('MNEMONIC', mnemonic);
    receiveAcc = CollectCMD.useEnvVariableIfMissing(
      'RECEIVE_ACCOUNT',
      receiveAcc
    );
    CollectCMD.checkInputs({ mnemonic, receiveAcc });

    const children = await db.getUnCollectedAccounts();
    await ETHBlock.collect({ mnemonic, children, receiveAcc, collectCb });
  }

  static useEnvVariableIfMissing(key, val) {
    if (process.env.NODE_ENV !== 'production') return val;
    return val ? val : process.env[key];
  }

  static checkInputs(inputs = {}) {
    const { mnemonic, receiveAcc } = inputs;
    const shouldHaveVal = mnemonic && receiveAcc;
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
