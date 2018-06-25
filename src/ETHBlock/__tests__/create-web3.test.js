import ETHBlock from 'ETHBlock';

const log = console.log;

describe('Init Web3 Instance', () => {
  it('Should init successfully', () => {
    const web3 = ETHBlock.init();
    // log(web3.version);
    expect(web3.version).toMatch(/0.20/);
  });
});
