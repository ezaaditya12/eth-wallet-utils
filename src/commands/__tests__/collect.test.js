import { log } from 'core/helpers';
import { CollectCMD, CollectCMDErr } from 'commands/collect';
import { collectCases as test } from './test-cases';

describe('Collect Command', () => {
  const { validateArgs, validateDBProvider, validateProdDB } = test;
  const { setup, cases } = validateArgs;

  beforeAll(() => {
    global.db = setup.db;
  });

  Object.values(cases).map(caseX => {
    it(`Should validate input args: ${caseX.name}`, async () => {
      try {
        const { mnemonic, receiveAcc } = caseX;
        await CollectCMD.cmd(mnemonic, receiveAcc);
      } catch (err) {
        expect(err).toBeInstanceOf(CollectCMDErr);
        expect(err.message).toMatch(caseX.errMsg);
      }
    });
  });

  Object.values(validateDBProvider).map(caseX => {
    describe('Should validate DB Provider', () => {
      const { setup, cases } = caseX;

      beforeAll(() => {
        global.db = setup.db;
      });

      Object.values(cases).map(caseX => {
        it(caseX.name, async () => {
          try {
            const { mnemonic, receiveAcc } = caseX;
            await CollectCMD.cmd(mnemonic, receiveAcc);
          } catch (err) {
            expect(err).toBeInstanceOf(CollectCMDErr);
            expect(err.message).toMatch(caseX.errMsg);
          }
        });
      });
    });
  });

  describe('Should have valid production DB', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'production';
    });

    it('Not throw CollectCMDErr', async () => {
      try {
        const { mnemonic, receiveAcc } = validateProdDB;
        await CollectCMD.cmd(mnemonic, receiveAcc);
      } catch (err) {
        log('xxx', err);
        expect(err).not.toBeInstanceOf(CollectCMDErr);
      }
    });
  });
});
