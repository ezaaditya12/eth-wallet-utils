"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _os = _interopRequireDefault(require("os"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _util = _interopRequireDefault(require("util"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Log {} // Utils


_defineProperty(Log, "appendFile", _util.default.promisify(_fs.default.appendFile));

_defineProperty(Log, "waitWrite", Promise.resolve());

_defineProperty(Log, "createIfNotExist", path => {
  if (!_fs.default.existsSync(path)) _fs.default.writeFileSync(path, '');
  return path;
});

_defineProperty(Log, "formatWithTime", args => {
  const argStrings = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2));
  const dateTime = (0, _moment.default)().format(_moment.default.HTML5_FMT.DATETIME_LOCAL_MS);
  return `[${dateTime}] ${argStrings.join(' ')}${_os.default.EOL}`;
});

_defineProperty(Log, "getLogPath", () => {
  const toDay = (0, _moment.default)().format('YYYY-MM-DD');
  return _path.default.join('logs', `${toDay}.log`);
});

_defineProperty(Log, "log", (...args) => {
  console.log(...args);
  Log.waitWrite = Log.waitWrite.then(() => Log.appendFile(Log.createIfNotExist(Log.getLogPath()), Log.formatWithTime(args)));
});

_defineProperty(Log, "info", (...args) => {
  const {
    NODE_ENV
  } = process.env;
  if (NODE_ENV === 'production') return;
  Log.log(...args);
});

Log.log.info = Log.info;
var _default = Log.log;
exports.default = _default;