import { log } from 'core/helpers';
import { CollectCMD, CollectCMDErr } from 'commands/collect';
import { collectCases as test } from './test-cases';

describe('Collect Command', () => {
  const { setup, cases} = test.validateArgs;

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

  const validateDBProvider = test.validateDBProvider;
  (Object.values(validateDBProvider)).map(caseX => {
    describe('Should validate DB Provider', () => {
      const { setup, cases } = caseX;
  
      beforeAll(() => {
        global.db = setup.db;
      });
    
      Object.values(cases).map(caseX => {
        it(caseX.name, async () => {
          try {
            const {mnemonic, receiveAcc } = caseX;
            await CollectCMD.cmd(mnemonic, receiveAcc);
          } catch (err) {
            expect(err).toBeInstanceOf(CollectCMDErr);
            expect(err.message).toMatch(caseX.errMsg);
          }
        });
      });
    });
  });
});





