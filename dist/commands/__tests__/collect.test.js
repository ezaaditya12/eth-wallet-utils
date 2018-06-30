"use strict";

var _helpers = require("core/helpers");

var _collect = require("commands/collect");

var _testCases = require("./test-cases");

describe('Collect Command', () => {
  const {
    validateArgs,
    validateProdDB
  } = _testCases.collectCases;
  Object.values(validateArgs).map(caseX => {
    it(`Should validate input args: ${caseX.name}`, async () => {
      try {
        const {
          mnemonic,
          receiveAcc
        } = caseX;
        await _collect.CollectCMD.cmd(mnemonic, receiveAcc);
      } catch (err) {
        expect(err).toBeInstanceOf(caseX.Err);
        expect(err.message).toMatch(caseX.errMsg);
      }
    });
  });
  it('Should have valid DB', async () => {
    try {
      const {
        mnemonic,
        receiveAcc
      } = validateProdDB;
      await _collect.CollectCMD.cmd(mnemonic, receiveAcc);
    } catch (err) {
      expect(err).not.toBeInstanceOf(validateProdDB.Err);
    }
  });
});