import os from 'os';
import fs from 'fs';
import path from 'path';
import util from 'util';
import moment from 'moment';

class Log {
  static appendFile = util.promisify(fs.appendFile);
  static waitWrite = Promise.resolve();

  static createIfNotExist = path => {
    if (!fs.existsSync(path)) fs.writeFileSync(path, '');
    return path;
  };

  static formatWithTime = args => {
    const argStrings = args.map(
      arg => (typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2))
    );
    const dateTime = moment().format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
    return `[${dateTime}] ${argStrings.join(' ')}${os.EOL}`;
  };

  static getLogPath = () => {
    const toDay = moment().format('YYYY-MM-DD');
    return path.join('logs', `${toDay}.log`);
  };

  static log = (...args) => {
    console.log(...args);
    Log.waitWrite = Log.waitWrite.then(() =>
      Log.appendFile(
        Log.createIfNotExist(Log.getLogPath()),
        Log.formatWithTime(args)
      )
    );
  };

  static info = (...args) => {
    const { NODE_ENV} = process.env;
    if(NODE_ENV === 'production') return;

    Log.log(...args);
  }
}

// Utils
Log.log.info = Log.info;

export default Log.log;
