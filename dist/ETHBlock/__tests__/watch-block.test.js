"use strict";

var _web = _interopRequireDefault(require("web3"));

var _moment = _interopRequireDefault(require("moment"));

var _ETHBlock = _interopRequireDefault(require("ETHBlock"));

var _testCases = require("ETHBlock/__tests__/test-cases");

var _helpers = require("core/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe.only('Watch Latest Block', () => {
  const case1 = _testCases.watchBlock.case1;
  const blockCb = jest.fn();
  const txCb = jest.fn();
  const blockMCs = blockCb.mock.calls;
  const txMCs = txCb.mock.calls;
  beforeAll(async () => {
    // Run ETHBlock.watch in specified time
    const tracker = _ETHBlock.default.watch({
      blockCb,
      txCb
    });

    await (0, _helpers.delay)(case1.WATCH_TIMEOUT);

    _ETHBlock.default.unWatch(tracker);
  }, case1.WATCH_TIMEOUT + 2 * 1000);
  it('Should watch block successfully', () => {
    expect(blockMCs.length).toBeGreaterThanOrEqual(case1.blockCbCalledTimes);
    expect(txMCs.length).toBeGreaterThanOrEqual(case1.txCbCalledTimes);
  });
  it('Should call blockCb with right params\'s shape', () => {
    const expectBlockCbParams = ({
      height,
      hash
    }) => {
      expect(typeof height).toBe('number');
      expect(height).toBeGreaterThan(case1.oldBlock);
      expect(hash.length).toBe(case1.HASH_LENGTH);
    };

    expectBlockCbParams(blockMCs[0][0]);
  });
  it('Should call txCb with right parmas\'s shape', () => {
    const expectTxCbParams = tx => {
      const {
        from,
        to,
        value
      } = tx;

      const convertETH = () => _web.default.utils.fromWei(value, 'ether'); // When create "Smart Contract", tx.to is null


      expect(from.length).toBe(case1.ADR_LENGTH);
      to && expect(to.length).toBe(case1.ADR_LENGTH);
      expect(convertETH).not.toThrowError();
    };

    expectTxCbParams(txMCs[0][0]);
  });
}); // describe('Watch Keep Looping', () => {
//   const case2 = test.case2;
//   const blockCb = jest.fn();
//   const txCb = jest.fn();
//   const blockMCs = blockCb.mock.calls;
//   const txMCs = txCb.mock.calls;
//   const watchTime = moment.duration(case2.WATCH_TIMEOUT);
//   describe(`Test Watch Block in ${watchTime.humanize()}`, () => {
//     beforeAll(async () => {
//       // Run ETHBlock.watch in specified time
//       const tracker = ETHBlock.watch({ blockCb, txCb });
//       await delay(case2.WATCH_TIMEOUT);
//       ETHBlock.unWatch(tracker);
//     }, case2.WATCH_TIMEOUT + 2 * 1000);
//     it('Should call blockCb & txCb a lot', () => {
//       expect(blockMCs.length).toBeGreaterThan(case2.blockCbCalledTimes);
//       expect(txMCs.length).toBeGreaterThan(case2.txCbCalledTimes);
//     });
//   });
// });