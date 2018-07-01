// import compose from 'compose-funcs';

// import { log } from 'core/helpers';
import HDWallet from 'HDWallet';
import { generateCases as tests } from './test-cases';

describe('Generate Child Wallet From Mnemonic', () => {
  it('Should generate children\'s account successfully', () => {
    const masterNode = HDWallet.fromMnemonic(tests.case1.mnemonic);
    const childAccArr = HDWallet._generate({ offset: 0, limit: 10 })(masterNode);
    const { address: firstChildAdr } = childAccArr[0];

    expect(firstChildAdr).toBe(tests.case1.firstChildAdr);
  });
});
