import ETHBlock from 'ETHBlock';
import {watchBlock as test} from './test-cases';

const log = console.log;

describe('Watch Latest Block', () => {

  it('Should get new block successfully', done => {

    const getBlockCb = () => {
      let gotNewBlock = false;
      
      return blockNo => {
        expect(typeof blockNo).toBe('number');
        expect(blockNo).toBeGreaterThan(test.case1.oldBlock);
        if(!gotNewBlock){
          done();
          gotNewBlock = true;
        }
      };
    };

    ETHBlock.watch({blockCb: getBlockCb()});
  });
});
