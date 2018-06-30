"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "log", {
  enumerable: true,
  get: function () {
    return _Log.default;
  }
});
exports.delaySec = exports.delay = exports.silentErr = exports.create = void 0;

var _Log = _interopRequireDefault(require("./Log"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const delay = ms => new Promise(r => setTimeout(r, ms));

exports.delay = delay;

const delaySec = sec => delay(sec * 1000);

exports.delaySec = delaySec;

const create = C => (...arg) => new C(...arg);

exports.create = create;

const silentErr = cb => (...args) => {
  try {
    return cb && cb(...args);
  } catch (err) {
    _Log.default.info('[silentErr]', err.message);
  }
};

exports.silentErr = silentErr;