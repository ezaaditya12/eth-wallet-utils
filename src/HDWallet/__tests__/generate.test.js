import HDWallet from 'HDWallet';
import { generateCases as tests } from './test-cases';
import compose from 'compose-funcs';

const log = console.log;

describe('Generate Child Wallet', () => {
  it('Should generate success with mnemonic phrase', () => {
    const masterNode = HDWallet.fromMnemonic(tests.case1.mnemonic);
    const childAdrArr = HDWallet.generate({ offset: 0, limit: 10 })(masterNode);
    expect(childAdrArr[0]).toBe(tests.case1.firstChildAddress);
  });

  it('Should generate success as chain method', () => {
    const mnemonic = tests.case1.mnemonic;
    const generateFromMnemonic = compose(
      HDWallet.generate({ offset: 0, limit: 10 }),
      HDWallet.fromMnemonic
    );
    const childAdrArr = generateFromMnemonic(mnemonic);
    expect(childAdrArr[0]).toBe(tests.case1.firstChildAddress);
  });
});
