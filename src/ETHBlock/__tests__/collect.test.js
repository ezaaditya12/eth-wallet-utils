import os from 'os';

import { log } from 'core/helpers';
import ETHBlock from 'ETHBlock';
import HDWallet from 'HDWallet';
import { collectCases as test } from './test-cases';

const randomChild = arr => arr[Math.floor(Math.random() * arr.length)];

describe('Create HD Wallet', () => {
  const case1 = test.case1;
  const { endUserPrv, hdWalletMnemonic, endUserSpends } = case1;
  const shouldHasVal = endUserPrv && hdWalletMnemonic && endUserSpends;

  if (!shouldHasVal) {
    log(
      [
        '[collect.test] Test case should have:',
        '  + End user private key',
        '  + HD Wallet mnemonic',
        '  + How end user spends'
      ].join(os.EOL)
    );

    return;
  }

  /**
   * Scenario: End user sends coin to his address
   * Logic:
   *   + End user's account is child account of HD Wallet
   *   + Hold mnemonic phrase > can collect back all money
   */
  beforeAll(async () => {
    const hdWallet = HDWallet.fromMnemonic(hdWalletMnemonic);
    const childAccArr = HDWallet.generate({ offset: 0, limit: 10 })(hdWallet);

    // End user send to random child's account
    const txHashes = await Promise.all(
      endUserSpends.map(amount =>
        ETHBlock.send({
          amount,
          from: endUserPrv,
          to: randomChild(childAccArr).address
        })
      )
    );

    log('[collect.test] txHashes', txHashes);
  });

  it.skip('Should collect money from children\'s account', () => {});
});
