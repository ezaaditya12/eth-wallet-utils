import log from './Log';

const delay = ms => new Promise(r => setTimeout(r, ms));
const delaySec = sec => delay(sec * 1000);

const create = C => (...arg) => new C(...arg);

const silentErr = cb => (...args) => {
  try {
    return cb && cb(...args);
  } catch (err) {
    log('[silentErr]', err.message);
  }
};

export { log, create, silentErr, delay, delaySec };
