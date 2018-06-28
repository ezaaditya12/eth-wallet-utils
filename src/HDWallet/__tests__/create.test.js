import compose from 'compose-funcs';

// import { log } from 'core/helpers';
import HDWallet from 'HDWallet';
import { createCases as test } from './test-cases';

describe('Create HD Wallet', () => {
  it('Should support creating mnemonic', () => {
    const mnemonic = HDWallet.newMnemonic();
    expect(typeof mnemonic).toBe('string');

    const wordArr = mnemonic.split(' ');
    expect(wordArr.length).toBe(12);
  });

  it('Should support creating new HD Wallet', () =>
    expect(HDWallet.newOne()).toHaveProperty('constructor.name', 'HDNode'));

  it('Should support creating from mnemonic phrase', () => {
    const hdWallet = HDWallet.fromMnemonic(test.case1.mnemonic);
    const address = HDWallet.getAddress(hdWallet);
    expect(address).toBe(test.case1.hdWalletAdr);
  });

  it('Should create new HD Wallet randomly', () => {
    const getNewHDWalletAddress = compose(
      HDWallet.getAddress,
      HDWallet.newOne
    );
    expect(getNewHDWalletAddress()).not.toEqual(getNewHDWalletAddress());
  });

  it('Should throw MnemonicErr when mnemonic phrase invalid', () => {
    const failCreateHDWallet = () =>
      HDWallet.fromMnemonic(test.invalid.mnemonic);
    expect(failCreateHDWallet).toThrow(test.invalid.Error);
  });
});
