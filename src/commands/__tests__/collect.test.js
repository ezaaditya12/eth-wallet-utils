import { log } from 'core/helpers';
import { CollectCMD } from 'commands/collect';
import { collectCases as test } from './test-cases';

describe('Collect Command', () => {
  const { validateArgs, validateProdDB } = test;

  Object.values(validateArgs).map(caseX => {
    it(`Should validate input args: ${caseX.name}`, async () => {
      try {
        const { mnemonic, receiveAcc } = caseX;
        await CollectCMD.cmd(mnemonic, receiveAcc);
      } catch (err) {
        expect(err).toBeInstanceOf(caseX.Err);
        expect(err.message).toMatch(caseX.errMsg);
      }
    });
  });

  it('Should have valid DB', async () => {
    try {
      const { mnemonic, receiveAcc } = validateProdDB;
      await CollectCMD.cmd(mnemonic, receiveAcc);
    } catch (err) {
      expect(err).not.toBeInstanceOf(validateProdDB.Err);
    }
  });
});
