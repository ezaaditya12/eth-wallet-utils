import ETHBlock from 'ETHBlock';
import { watchBlock as test } from './test-cases';
import compose from 'compose-funcs';
import { createStore } from 'redux';
import { setImmediate } from 'core-js';

const log = console.log;

describe('Watch Latest Block', () => {
  const initState = {
    tracker: null,
    blockNo: null
  };

  const store = createStore((state = initState, action) => ({
    ...state,
    ...action.payload
  }));

  const setState = compose(
    store.dispatch,
    payload => ({ type: 'UPDATE_STATE', payload })
  );

  const getKey = key => () => {
    const curr = store.getState();
    return curr[key];
  };

  it('Should get new block successfully', done => {
    const testExpect = blockNo => {
      expect(typeof blockNo).toBe('number');
      expect(blockNo).toBeGreaterThan(test.case1.oldBlock);
    };

    const blockCb = compose(
      () => done(),
      testExpect,
      getKey('blockNo'),
      ETHBlock.unWatch,
      getKey('tracker'),
      setState,
      blockNo => ({ blockNo })
    );

    const runTrack = compose(
      setState,
      tracker => ({ tracker }),
      ETHBlock.watch,
      blockCb => ({ blockCb })
    );

    runTrack(blockCb);
  });
});
