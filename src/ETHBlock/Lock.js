import fs from 'fs';
import path from 'path';

export default class Lock {
  static getPath(_path) {
    const lockPath = _path || path.join(__dirname, 'blockNo');
    if (!fs.existsSync(lockPath)) fs.writeFileSync(lockPath, '');
    return lockPath;
  }

  static read(_path) {
    const lockPath = Lock.getPath(_path);
    return fs.readFileSync(lockPath);
  }

  static write(info, _path) {
    const lockPath = Lock.getPath(_path);
    fs.writeFileSync(lockPath, `${info}`);
    return true;
  }
}
