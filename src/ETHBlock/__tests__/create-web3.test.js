import ETHBlock from 'ETHBlock';
import { createWeb3 as test } from './test-cases';

import { log } from 'core/helpers';

describe('Init Web3 Instance', () => {
  it('Should init successfully', () => {
    const web3 = ETHBlock.initWeb3();
    expect(web3[test.case1.apiKey]).toMatch(test.case1.versionAPI);
  });
});
