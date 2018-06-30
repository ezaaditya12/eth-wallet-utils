"use strict";

var _ETHBlock = _interopRequireDefault(require("ETHBlock"));

var _testCases = require("./test-cases");

var _helpers = require("core/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Init Web3 Instance', () => {
  it('Should init successfully', () => {
    const web3 = _ETHBlock.default.initWeb3();

    expect(web3[_testCases.createWeb3.case1.apiKey]).toMatch(_testCases.createWeb3.case1.versionAPI);
  });
});