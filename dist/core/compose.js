"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeAsync = void 0;

// const apply = (acc, val) => acc(val);
// const compose = (...funcs) => x => funcs.reduce(apply, x);
const applyAsync = (acc, val) => acc.then(val);

const composeAsync = (...funcs) => x => funcs.reduce(applyAsync, Promise.resolve(x));

exports.composeAsync = composeAsync;