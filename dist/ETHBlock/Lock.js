"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path2 = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Lock {
  static getPath(_path) {
    const lockPath = _path || _path2.default.join(__dirname, 'blockNo');

    if (!_fs.default.existsSync(lockPath)) _fs.default.writeFileSync(lockPath, '');
    return lockPath;
  }

  static read(_path) {
    const lockPath = Lock.getPath(_path);
    return _fs.default.readFileSync(lockPath);
  }

  static write(info, _path) {
    const lockPath = Lock.getPath(_path);

    _fs.default.writeFileSync(lockPath, `${info}`);

    return true;
  }

}

exports.default = Lock;