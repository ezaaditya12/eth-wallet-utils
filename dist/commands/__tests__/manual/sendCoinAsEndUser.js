"use strict";

var _os = _interopRequireDefault(require("os"));

var _chalk = _interopRequireDefault(require("chalk"));

var _helpers = require("core/helpers");

var _ETHBlock = _interopRequireDefault(require("ETHBlock"));

var _HDWallet = _interopRequireDefault(require("HDWallet"));

var _testCases = require("./test-cases");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const randomChild = arr => arr[Math.floor(Math.random() * arr.length)];

const setup = async () => {
  _helpers.log.info('[sendCoinAsEndUser] Validating "Test Setup"...');

  const case1 = _testCases.collectCases.case1;
  const {
    endUserPrv,
    mnemonic,
    endUserSpends
  } = case1;

  const {
    address: endUserAcc
  } = _HDWallet.default.walletFromPrv(endUserPrv);

  const totalSpends = endUserSpends.reduce((s1, s2) => s1 + s2);
  const shouldHasVal = endUserPrv && mnemonic && endUserSpends;

  if (!shouldHasVal) {
    _helpers.log.info(['[sendCoinAsEndUser] Test case should have:', '  + End user private key', '  + HD Wallet mnemonic', '  + How end user spends'].join(_os.default.EOL));

    throw new Error('Test case missing required fields.');
  }

  const endUserBalance = await _ETHBlock.default.getBalanceInETH(endUserAcc);
  const notEnough = endUserBalance < totalSpends;

  if (notEnough) {
    _helpers.log.info(['[sendCoinAsEndUser] End User Account should have enough coin', `[sendCoinAsEndUser] End User Account Balance: ${endUserBalance} ETH`, `[sendCoinAsEndUser] Required Spends: ${totalSpends} ETH`].join(_os.default.EOL));

    throw new Error('End User Account doesn\'st have enough coin to run test');
  }

  _helpers.log.info(['[sendCoinAsEndUser] Setup scenario', '[sendCoinAsEndUser]   + End user send coin to child address of HD Wallet', '[sendCoinAsEndUser]   + Hold mnemonic phrase > can collect back all money'].join(_os.default.EOL));

  const hdWallet = _HDWallet.default.fromMnemonic(mnemonic);

  const children = _HDWallet.default.generate({
    offset: 0,
    limit: 10
  })(hdWallet); // End user send to random child's account
  // @WARN: Spend concurrently on same must transaction IN ORDER\


  const childInfoArr = [];
  await endUserSpends.reduce(async (prevSend, amount) => {
    await prevSend;
    const child = randomChild(children);
    childInfoArr.push({
      address: child.address,
      derivePath: child.derivePath
    });
    return _ETHBlock.default.send({
      amount,
      from: endUserPrv,
      to: child.address
    });
  }, Promise.resolve());

  _helpers.log.info('[sendCoinAsEndUser] User sends coin completely');

  _helpers.log.info(_chalk.default.bgGreenBright('[sendCoinAsEndUser] childInfoArr'));

  _helpers.log.info(childInfoArr);
};

setup().then(() => console.log('Setup complete!'));