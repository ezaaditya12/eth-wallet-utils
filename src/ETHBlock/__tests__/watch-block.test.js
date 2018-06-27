import Web3 from 'web3';

import ETHBlock from 'ETHBlock';
import { watchBlock as test } from 'ETHBlock/__tests__/test-cases';
import { log, delay } from 'core/helpers';

describe('Watch Latest Block', () => {
  const case1 = test.case1;

  it(
    'Should watch block successfully',
    done => {
      const expectBlockCbParams = ({ height, hash }) => {
        expect(typeof height).toBe('number');
        expect(height).toBeGreaterThan(case1.oldBlock);
        expect(hash.length).toBe(case1.HASH_LENGTH);
      };

      const expectTxCbParams = tx => {
        const { from, to, value } = tx;
        const convertETH = () => Web3.utils.fromWei(value, 'ether');

        expect(from.length).toBe(case1.ADR_LENGTH);
        expect(to.length).toBe(case1.ADR_LENGTH);
        expect(convertETH).not.toThrowError();
      };

      const blockCb = jest.fn();
      const txCb = jest.fn();

      const expectCallTimes = () => {
        const blockMCs = blockCb.mock.calls;
        const txMCs = txCb.mock.calls;

        expectBlockCbParams(blockMCs[0][0]);
        expectTxCbParams(txMCs[0][0]);
        expect(blockMCs.length).toBeGreaterThanOrEqual(case1.blockCbCalledTimes);
        expect(txMCs.length).toBeGreaterThanOrEqual(case1.txCbCalledTimes);
      };

      const tracker = ETHBlock.watch({ blockCb, txCb });

      delay(case1.WATCH_TIME).then(() => {
        ETHBlock.unWatch(tracker);
        expectCallTimes();
        done();
      });
    },
    case1.WATCH_MAX_TIME
  );
});
