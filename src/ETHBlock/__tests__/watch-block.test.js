import { createStore } from 'redux';
import compose from 'compose-funcs';

import ETHBlock from 'ETHBlock';
import createTinyStore from 'core/store';
import { watchBlock as test } from './test-cases';

const log = console.log;

describe('Watch Latest Block', () => {
  /**
   * Setup data before test
   */
  const initState = {
    tracker: null
  };

  const { getKey, setState } = createTinyStore(initState);

  /**
   * Start test cases
   */
  it('Should get new block successfully', done => {
    const testExpect = blockNo => {
      expect(typeof blockNo).toBe('number');
      expect(blockNo).toBeGreaterThan(test.case1.oldBlock);
    };

    const blockCb = compose(
      () => done(),
      testExpect
    );

    const runTrack = compose(
      tracker => setState({ tracker }),
      blockCb => ETHBlock.watch({ blockCb })
    );

    runTrack(blockCb);
  });

  afterAll(
    compose(
      ETHBlock.unWatch,
      getKey('tracker')
    )
  );
});
