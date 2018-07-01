import os from 'os';
import fs from 'fs';
import path from 'path';
import moment from 'moment';

class Log {
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

  static getLogPath = logName => {
    logName = logName || moment().format('YYYY-MM-DD');
    return path.join('logs', `${logName}.log`);
  };

  static log = (...args) => {
    const { NODE_ENV} = process.env;
    (NODE_ENV !== 'production') && console.log(...args);
  };

  static info = (...args) => {
    Log.log(...args);
  }

  static report = logName => (...args) => {
    console.log(...args);
    fs.appendFileSync(Log.createIfNotExist(Log.getLogPath(logName)), Log.formatWithTime(args));
  }
}

// Utils
Log.log.info = Log.info;
Log.log.report = Log.report;

export default Log.log;
