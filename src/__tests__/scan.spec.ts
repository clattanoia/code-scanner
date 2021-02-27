import { getGlobScan } from '../scan';

describe('Scan', () => {
  it('function getGlobScan', async () => {
    expect(await getGlobScan('.', '**/*.test', false)).toEqual([
      './src/__tests__/testFiles/demo.test',
    ]);
  });
});
