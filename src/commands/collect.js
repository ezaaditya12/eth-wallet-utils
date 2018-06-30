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

class Collect {
  /**
   * Handle collect money
   * @param {string} mnemonic
   * @param {string} receiveAcc
   */
  static async cmd(mnemonic, receiveAcc) {
    mnemonic = Collect.useEnvVariableIfMissing('MNEMONIC', mnemonic);
    receiveAcc = Collect.useEnvVariableIfMissing('RECEIVE_ACCOUNT', receiveAcc);
    Collect.checkInputs({ mnemonic, receiveAcc });

    const children = await db.getUnCollectedAccounts();
    await ETHBlock.collect({mnemonic, children, receiveAcc, collectCb});
  }

  static useEnvVariableIfMissing(key, val) {
    return val ? val : process.env[key];
  }

  static checkInputs(inputs = {}) {
    const { mnemonic, receiveAcc } = inputs;
    const shouldHaveVal = mnemonic && receiveAcc;
    if (!shouldHaveVal)
      throw new Error(
        [
          'Missing inputs. Required fields:',
          '  + mnemonic',
          '  + receiveAcc'
        ].join(os.EOL)
      );

    if(!HDWallet.isValidMnemonic(mnemonic))
      throw new Error([
        'mnemonic phrase is invalid. Please check it.',
        `  + Input mnemonic: ${style.blue(mnemonic)}`,
        `  + Using ${style.blue('quote')} if passing string with space in terminal`,
      ].join(os.EOL));

    if(!HDWallet.isValidAddress(receiveAcc))
      throw new Error([
        'Receive Account Address is invalid. Please check it.',
        `  + Input address: ${style.blue(receiveAcc)}`,
      ].join(os.EOL));
    
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
    .action(Collect.cmd);
};

export default collectCmd;
export { Collect, collectCmd };
