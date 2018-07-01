import os from 'os';
import fs from 'fs';
import path from 'path';
import style from 'chalk';

import { log } from 'core/helpers';
import ETHBlock from 'ETHBlock';
import HDWallet from 'HDWallet';
import { collectCases as test } from './test-cases';

const randomChild = arr => arr[Math.floor(Math.random() * arr.length)];

const setup = async () => {
  log.info('[sendCoinAsEndUser] Validating "Test Setup"...');
  const case1 = test.case1;
  const { endUserPrv, mnemonic, endUserSpends } = case1;
  const { address: endUserAcc } = HDWallet.walletFromPrv(endUserPrv);
  const totalSpends = endUserSpends.reduce((s1, s2) => s1 + s2);

  const shouldHasVal = endUserPrv && mnemonic && endUserSpends;
  if (!shouldHasVal) {
    log.info(
      [
        '[sendCoinAsEndUser] Test case should have:',
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
        '[sendCoinAsEndUser] End User Account should have enough coin',
        `[sendCoinAsEndUser] End User Account Balance: ${endUserBalance} ETH`,
        `[sendCoinAsEndUser] Required Spends: ${totalSpends} ETH`
      ].join(os.EOL)
    );

    throw new Error('End User Account doesn\'st have enough coin to run test');
  }

  log.info(
    [
      '[sendCoinAsEndUser] Setup scenario',
      '[sendCoinAsEndUser]   + End user send coin to child address of HD Wallet',
      '[sendCoinAsEndUser]   + Hold mnemonic phrase > can collect back all money'
    ].join(os.EOL)
  );

  const hdWallet = HDWallet.fromMnemonic(mnemonic);
  const children = HDWallet._generate({ offset: 0, limit: 10 })(hdWallet);

  // End user send to random child's account
  // @WARN: Spend concurrently on same must transaction IN ORDER\
  const childInfoArr = [];
  await endUserSpends.reduce(async (prevSend, amount) => {
    await prevSend;
    const child = randomChild(children);
    childInfoArr.push({
      address: child.address,
      derivePath: child.derivePath
    });
    return ETHBlock._send({
      amount,
      from: endUserPrv,
      to: child.address
    });
  }, Promise.resolve());

  const childInfoPath = path.join(__dirname, '..', 'uncollect-accounts.mock.json');
  fs.writeFileSync(childInfoPath, JSON.stringify(childInfoArr, null, 2));

  log.info('[sendCoinAsEndUser] User sends coin completely');
  log.info(style.bgGreenBright('[sendCoinAsEndUser] Mock data saved as:'), childInfoPath);
  log.info(childInfoArr);
};

setup().then(() => console.log('Setup complete!'));
