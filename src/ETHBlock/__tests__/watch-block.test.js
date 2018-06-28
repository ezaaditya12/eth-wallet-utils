import Web3 from 'web3';

import ETHBlock from 'ETHBlock';
import { watchBlock as test } from 'ETHBlock/__tests__/test-cases';
import { log, delay } from 'core/helpers';

describe('Watch Latest Block', () => {
  const case1 = test.case1;

  const blockCb = jest.fn();
  const txCb = jest.fn();

  const blockMCs = blockCb.mock.calls;
  const txMCs = txCb.mock.calls;

  beforeAll(async () => {
    // Run ETHBlock.watch in specified time
    const tracker = ETHBlock.watch({ blockCb, txCb });
    await delay(case1.WATCH_TIMEOUT);
    ETHBlock.unWatch(tracker);
  }, case1.WATCH_TIMEOUT + 2*1000);

  it('Should watch block successfully', () => {
    expect(blockMCs.length).toBeGreaterThanOrEqual(case1.blockCbCalledTimes);
    expect(txMCs.length).toBeGreaterThanOrEqual(case1.txCbCalledTimes);
  });

  it('Should call blockCb with right params\'s shape', () => {
    const expectBlockCbParams = ({ height, hash }) => {
      expect(typeof height).toBe('number');
      expect(height).toBeGreaterThan(case1.oldBlock);
      expect(hash.length).toBe(case1.HASH_LENGTH);
    };

    expectBlockCbParams(blockMCs[0][0]);
  });

  it('Should call txCb with right parmas\'s shape', () => {
    const expectTxCbParams = tx => {
      const { from, to, value } = tx;
      const convertETH = () => Web3.utils.fromWei(value, 'ether');

      // When create "Smart Contract", tx.to is null
      expect(from.length).toBe(case1.ADR_LENGTH);
      to && expect(to.length).toBe(case1.ADR_LENGTH);
      expect(convertETH).not.toThrowError();
    };

    expectTxCbParams(txMCs[0][0]);
  });
});
