import ETHBlock from 'ETHBlock';

const log = console.log;

describe('Watch Latest Block', () => {
  it('Should watch successfully', () => {
    ETHBlock.watch();
  });
});
