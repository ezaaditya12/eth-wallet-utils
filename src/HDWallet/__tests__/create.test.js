import HDWallet from 'HDWallet';
import { createCases as tests } from './test-cases';
import compose from 'compose-funcs';

const log = console.log;

describe('Create HD Wallet', () => {
  it('Should support create mnemonic', () => {
    const mnemonic = HDWallet.newMnemonic();
    expect(typeof mnemonic).toBe('string');

    const wordArr = mnemonic.split(' ');
    expect(wordArr.length).toBe(12);
  });

  it('Should support creating new one', () =>
    expect(HDWallet.newOne()).toHaveProperty('constructor.name', 'HDNode'));

  it('Should support creating randomly', () => {
    const getNewHDWalletAddress = compose(
      HDWallet.getAddress,
      HDWallet.newOne
    );
    expect(getNewHDWalletAddress()).not.toEqual(getNewHDWalletAddress());
  });

  it('Should success on mnemonic phrase', () => {
    const hdWallet = HDWallet.fromMnemonic(tests.case1.mnemonic);
    const address = HDWallet.getAddress(hdWallet);
    expect(address).toBe(tests.case1.hdWalletAdr);
  });

  it('Should throw MnemonicError', () => {
    const failCreateHDWallet = () =>
      HDWallet.fromMnemonic(tests.invalid.mnemonic);
    expect(failCreateHDWallet).toThrow(tests.invalid.Error);
  });
});
