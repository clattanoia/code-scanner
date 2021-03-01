import { getGlobScan, loadIgnorePatterns } from '../scan';

describe('Scan', () => {
  it('function getGlobScan', async () => {
    expect(await getGlobScan('.', '**/*.test', false)).toEqual([
      './src/__tests__/testFiles/demo.test',
    ]);
  });
  it('function loadIgnorePatterns', async () => {
    expect(
      await loadIgnorePatterns('src/__tests__/testFiles/demo.test'),
    ).toEqual(['这个文件仅用于单元测试', 'Just for testing']);

    expect(await loadIgnorePatterns('src/__tests__/testFiles/demo.ts')).toEqual(
      [],
    );
  });
});
