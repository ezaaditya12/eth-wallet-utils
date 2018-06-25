import HDWallet from 'HDWallet';
import { Wallet } from 'ethers';
import { createCases as cases } from './test-cases';

const log = console.log;

describe('Generate Child Wallet', () => {
  it('Should generate success with mnemonic phrase', () => {
    const hdWallet = HDWallet.fromMnemonic(cases.success.mnemonic);
    const address = new Wallet(hdWallet.privateKey).getAddress();

    const childAddressArr = HDWallet.generate({from: 0, total: 10})(hdWallet);
    log('[childAddressArr]', childAddressArr);

    expect(address).toBe('0xE6EA8442BD58A0241a50f088eDEb5a0C99bfA888');
  });
});
