import { createTinyStore } from 'core/store';

const initState = {
  logWritePromise: null
};

const store = createTinyStore(initState);

export default store;
export { 
  store
};