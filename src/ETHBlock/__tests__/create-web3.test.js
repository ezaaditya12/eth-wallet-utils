import ETHBlock from 'ETHBlock';
import {createWeb3 as test} from './test-cases';

const log = console.log;

describe('Init Web3 Instance', () => {
  it('Should init successfully', () => {
    const web3 = ETHBlock.init();
    expect(web3[test.case1.apiKey]).toMatch(test.case1.versionAPI);
  });
});
