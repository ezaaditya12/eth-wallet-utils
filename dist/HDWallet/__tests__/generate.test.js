"use strict";

var _HDWallet = _interopRequireDefault(require("HDWallet"));

var _testCases = require("./test-cases");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import compose from 'compose-funcs';
// import { log } from 'core/helpers';
describe('Generate Child Wallet From Mnemonic', () => {
  it('Should generate children\'s account successfully', () => {
    const masterNode = _HDWallet.default.fromMnemonic(_testCases.generateCases.case1.mnemonic);

    const childAccArr = _HDWallet.default.generate({
      offset: 0,
      limit: 10
    })(masterNode);

    const {
      address: firstChildAdr
    } = childAccArr[0];
    expect(firstChildAdr).toBe(_testCases.generateCases.case1.firstChildAdr);
  });
});