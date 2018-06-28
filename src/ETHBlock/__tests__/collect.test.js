import os from 'os';

import { log, miniStore } from 'core/helpers';
import createTinyStore from 'core/store';
import ETHBlock from 'ETHBlock';
import HDWallet from 'HDWallet';
import { collectCases as test } from './test-cases';

const randomChild = arr => arr[Math.floor(Math.random() * arr.length)];

describe('Collect money from all children account', () => {
  const case1 = test.case1;
  const { endUserPrv, mnemonic, endUserSpends, receiveAcc } = case1;
  const { address: endUserAcc } = HDWallet.walletFromPrv(endUserPrv);
  const totalSpends = endUserSpends.reduce((s1, s2) => s1 + s2);

  /**
   * Validate Test Environment Condition
   */
  beforeAll(async () => {
    log('[collect.test] Validate...');

    const shouldHasVal = endUserPrv && mnemonic && endUserSpends;
    if (!shouldHasVal) {
      log(
        [
          '[collect.test] Test case should have:',
          '  + End user private key',
          '  + HD Wallet mnemonic',
          '  + How end user spends'
        ].join(os.EOL)
      );

      throw new Error('Test case missing required fields.');
    }

    const endUserBalance = await ETHBlock.getBalanceInETH(endUserAcc);
    const notEnough = endUserBalance < totalSpends;
    if (notEnough) {
      log(
        [
          '[collect.test] End User Account should have enough coin',
          `[collect.test] End User Account Balance: ${endUserBalance} ETH`,
          `[collect.test] Required Spends: ${totalSpends} ETH`
        ].join(os.EOL)
      );

      throw new Error('End User Account doesn\'st have enough coin to run test');
    }
  });

  /**
   * Setup Scenario: End user sends coin to child address of HD Wallet
   * Logic:
   *   + End user's account using child address of HD Wallet
   *   + Hold mnemonic phrase > can collect back all money
   */
  describe('Setup scenario', () => {
    const initState = {
      endUserAccBalance: null,
      receiveAccBalance: null
    };
    const { setState, getKey } = createTinyStore(initState);
    const collectCb = jest.fn();
    const collectMCs = collectCb.mock.calls;

    beforeAll(async () => {
      log(
        [
          '[collect.test] Setup scenario',
          '[collect.test]   + End user send coin to child address of HD Wallet',
          '[collect.test]   + Hold mnemonic phrase > can collect back all money'
        ].join(os.EOL)
      );

      const hdWallet = HDWallet.fromMnemonic(mnemonic);
      const children = HDWallet.generate({ offset: 0, limit: 10 })(hdWallet);

      // Store balance to compare in test
      const [uETH, rETH] = await Promise.all([
        ETHBlock.getBalanceInETH(endUserAcc),
        ETHBlock.getBalanceInETH(receiveAcc)
      ]);
      setState({
        endUserAccBalance: uETH,
        receiveAccBalance: rETH
      });

      // End user send to random child's account
      // @WARN: Spend concurrently on same must transaction IN ORDER
      await endUserSpends.reduce(async (prevSend, amount) => {
        await prevSend;
        return ETHBlock.send({
          amount,
          from: endUserPrv,
          to: randomChild(children).address
        });
      }, Promise.resolve());
      log('[collect.test] User sends coin completely');

      // Collect all money from children account
      await ETHBlock.collect({ mnemonic, children, receiveAcc, collectCb });
      log('[collect.test] Collect money from children account completely');
    }, case1.WAIT_COLLECT_TIMEOUT);

    it('End User should send coin to child account', async () => {
      const currBalanceETH = await ETHBlock.getBalanceInETH(endUserAcc);
      const prvBalanceETH = getKey('endUserAccBalance');
      const diff = currBalanceETH - prvBalanceETH;

      expect(diff).toBeLessThan(0);
      expect(Math.abs(diff)).toBeCloseTo(totalSpends);
    });

    it('Should collect money from children\'s account', async () => {
      const currBalanceETH = await ETHBlock.getBalanceInETH(receiveAcc);
      const prvBalanceETH = getKey('receiveAccBalance');
      const diff = currBalanceETH - prvBalanceETH;

      expect(diff).toBeGreaterThan(0);
      expect(Math.abs(diff)).toBeCloseTo(totalSpends);
    });

    it('Should execute collectCb', () => {
      expect(collectMCs.length).toBeGreaterThan(1);
    });

    it('Should call collectCb with right params\'s shape', () => {
      const expectCollectCbParams = ({
        from,
        receiveAcc: to,
        amount,
        txHash
      }) => {
        expect(from).toBeTruthy();
        expect(to).toBeTruthy();
        expect(amount).toBeTruthy();
        expect(txHash.length).toBe(case1.HASH_LENGTH);
      };

      expectCollectCbParams(collectMCs[0][0]);
    });
  });
});
