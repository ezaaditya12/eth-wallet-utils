import { log } from 'core/helpers';
import ETHBlock from 'ETHBlock';
// import db from 'db';

// Fake to test first
const db = {};
db.getUnCollectAccount = () => [
  {
    address: '',
    derivePath: ''
  }
];

db.updateUnCollectAccount = () => console.log('Mark child address as collected');
const collectCb = db.updateUnCollectAccount;

/**
 * Handle collect money
 * @param {string} mnemonic
 */
export const collect = async mnemonic => {
  log('[collect] xpr', mnemonic);
  const dashRpc = new ETHBlock(process.env.DASH_CLI);
  const children = await db.getUnCollectAccount();
  await dashRpc.collect(mnemonic, children, { collectCb });
  log('[collect] Finished.');
};

/**
 * Regis project:init
 * @param program
 */
export const collectCmd = program => {
  program
    .command('collect <mnemonic> <receiveAcc>')
    .description([
      'Collect money from children\'s account',
      '  + mnemonic: mnemonic 12 words phrase',
      '  + receiveAcc: Receive Account address',
    ])
    .action(collect);
};
