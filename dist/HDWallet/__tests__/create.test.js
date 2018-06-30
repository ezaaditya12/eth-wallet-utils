"use strict";

var _composeFuncs = _interopRequireDefault(require("compose-funcs"));

var _HDWallet = _interopRequireDefault(require("HDWallet"));

var _testCases = require("./test-cases");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { log } from 'core/helpers';
describe('Create HD Wallet', () => {
  it('Should support creating mnemonic', () => {
    const mnemonic = _HDWallet.default.newMnemonic();

    expect(typeof mnemonic).toBe('string');
    const wordArr = mnemonic.split(' ');
    expect(wordArr.length).toBe(12);
  });
  it('Should support creating new HD Wallet', () => expect(_HDWallet.default.newOne()).toHaveProperty('constructor.name', 'HDNode'));
  it('Should support creating from mnemonic phrase', () => {
    const hdWallet = _HDWallet.default.fromMnemonic(_testCases.createCases.case1.mnemonic);

    const address = _HDWallet.default.getHDWalletAddress(hdWallet);

    expect(address).toBe(_testCases.createCases.case1.hdWalletAdr);
  });
  it('Should create new HD Wallet randomly', () => {
    const getNewHDWalletAddress = (0, _composeFuncs.default)(_HDWallet.default.getHDWalletAddress, _HDWallet.default.newOne);
    expect(getNewHDWalletAddress()).not.toEqual(getNewHDWalletAddress());
  });
  it('Should throw MnemonicErr when mnemonic phrase invalid', () => {
    const failCreateHDWallet = () => _HDWallet.default.fromMnemonic(_testCases.createCases.invalid.mnemonic);

    expect(failCreateHDWallet).toThrow(_testCases.createCases.invalid.Error);
  });
});