import HDWallet from 'HDWallet';
import { Wallet } from 'ethers';
import { createCases as tests } from './test-cases';

const log = console.log;

describe('Create HD Wallet', () => {
  it('Should create success with mnemonic phrase', () => {
    const hdWallet = HDWallet.fromMnemonic(tests.case1.mnemonic);
    const address = new Wallet(hdWallet.privateKey).getAddress();
    expect(address).toBe(tests.case1.hdWalletAddress);
  });
});
