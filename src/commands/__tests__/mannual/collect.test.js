import os from 'os';

import { log } from 'core/helpers';
import createTinyStore from 'core/store';
import ETHBlock from 'ETHBlock';
import HDWallet from 'HDWallet';
import { collectCases as test } from './test-cases';

const randomChild = arr => arr[Math.floor(Math.random() * arr.length)];

const setup = async () => {
  log.info('[collect.test] Validating "Test Setup"...');
  const case1 = test.case1;
  const { endUserPrv, mnemonic, endUserSpends, receiveAcc } = case1;
  const { address: endUserAcc } = HDWallet.walletFromPrv(endUserPrv);
  const totalSpends = endUserSpends.reduce((s1, s2) => s1 + s2);

  const shouldHasVal = endUserPrv && mnemonic && endUserSpends;
  if (!shouldHasVal) {
    log.info(
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
    log.info(
      [
        '[collect.test] End User Account should have enough coin',
        `[collect.test] End User Account Balance: ${endUserBalance} ETH`,
        `[collect.test] Required Spends: ${totalSpends} ETH`
      ].join(os.EOL)
    );

    throw new Error('End User Account doesn\'st have enough coin to run test');
  }

  const initState = {
    endUserAccBalance: null,
    receiveAccBalance: null
  };
  const { setState, getKey } = createTinyStore(initState);
  const collectCb = jest.fn();
  const collectMCs = collectCb.mock.calls;

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
  log.info('[collect.test] User sends coin completely');

  // Collect all money from children account
  await ETHBlock.collect({ mnemonic, children, receiveAcc, collectCb });
  log.info('[collect.test] Collect money from children account completely');
};
