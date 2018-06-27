import HDWallet from 'HDWallet';
import { generateCases as tests } from './test-cases';
import compose from 'compose-funcs';

import { log } from 'core/helpers';

describe('Generate Child Wallet From Mnemonic', () => {
  it('Should generate success', () => {
    const masterNode = HDWallet.fromMnemonic(tests.case1.mnemonic);
    const childAdrArr = HDWallet.generate({ offset: 0, limit: 10 })(masterNode);
    expect(childAdrArr[0]).toBe(tests.case1.firstChildAdr);
  });

  it('Should generate success as compose', () => {
    const mnemonic = tests.case1.mnemonic;
    const generateFromMnemonic = compose(
      HDWallet.generate({ offset: 0, limit: 10 }),
      HDWallet.fromMnemonic
    );
    const childAdrArr = generateFromMnemonic(mnemonic);
    expect(childAdrArr[0]).toBe(tests.case1.firstChildAdr);
  });
});
