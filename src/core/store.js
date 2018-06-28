import { createStore } from 'redux';
import compose from 'compose-funcs';

const createTinyStore = initState => {
  const store = createStore((state = initState, action) => ({
    ...state,
    ...action.payload
  }));

  const setState = compose(
    store.dispatch,
    payload => ({ type: 'UPDATE_STATE', payload })
  );

  const getKey = key => {
    const curr = store.getState();
    return curr[key];
  };

  return { setState, getKey, store };
};

export default createTinyStore;
export { createTinyStore };
