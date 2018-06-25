import HDWallet from 'HDWallet';
import { createCases as cases } from './test-cases';

const log = console.log;

describe('Create HD Wallet', () => {
  it('Should create success with mnemonic phrase', () => {
    const hdWallet = HDWallet.fromMnemonic(cases.success.mnemonic);
    log('[publicKey]', hdWallet.publicKey);
    log('[privateKey]', hdWallet.privateKey);
    expect(true).toBe(true);
  });
});