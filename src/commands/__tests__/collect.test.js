import { log } from 'core/helpers';
import { CollectCMD, CollectCMDErr } from 'commands/collect';
import { collectCases as test } from './test-cases';

const wrapAsync = fn => async (...args) => {
  try {
    await fn(...args);
  } catch (err) {
    throw err;
  }
};

describe('Collect Command', () => {
  test.validateArgs.map(caseX => {
    it(`Should validate input args: ${caseX.name}`, async () => {
      try {
        const { mnemonic, receiveAcc } = caseX;
        await CollectCMD.cmd(mnemonic, receiveAcc);
      } catch (err) {
        expect(err).toBeInstanceOf(CollectCMDErr);
      }
    });
  });
});
