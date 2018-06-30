"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTinyStore = exports.default = void 0;

var _redux = require("redux");

var _composeFuncs = _interopRequireDefault(require("compose-funcs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createTinyStore = initState => {
  const store = (0, _redux.createStore)((state = initState, action) => ({ ...state,
    ...action.payload
  }));
  const setState = (0, _composeFuncs.default)(store.dispatch, payload => ({
    type: 'UPDATE_STATE',
    payload
  }));

  const getKey = key => {
    const curr = store.getState();
    return curr[key];
  };

  return {
    setState,
    getKey,
    store
  };
};

exports.createTinyStore = createTinyStore;
var _default = createTinyStore;
exports.default = _default;