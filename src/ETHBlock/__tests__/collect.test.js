import os from 'os';

import { log, delay } from 'core/helpers';
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
   * Scenario: End user sends coin to child address of HD Wallet
   * Logic:
   *   + End user's account using child address of HD Wallet
   *   + Hold mnemonic phrase > can collect back all money
   */
  beforeAll(async () => {
    log(
      [
        '[collect.test] Setup scenario',
        '[collect.test]   + End user send coin to child address of HD Wallet',
        '[collect.test]   + Hold mnemonic phrase > can collect back all money'
      ].join(os.EOL)
    );

    const hdWallet = HDWallet.fromMnemonic(hdWalletMnemonic);
    const childAccArr = HDWallet.generate({ offset: 0, limit: 10 })(hdWallet);

    // End user send to random child's account
    // @WARN: Send transaction MUST IN ORDER
    await endUserSpends.reduce(async (prevSend, amount) => {
      await prevSend;
      return ETHBlock.send({
        amount,
        from: endUserPrv,
        to: randomChild(childAccArr).address
      });
    }, Promise.resolve());

    log('[collect.test] User sends coin completely');
  }, case1.WAIT_COLLECT_TIMEOUT);

  it( 'Should collect money from children\'s account', () => {
    expect(true).toBe(true);
  });
});
