import * as path from 'path';
import {
  getComplexity,
  getFileName,
  getAdvice,
  executeOnFiles,
  scanComplexity,
} from '../complexity';

describe('Complexity', () => {
  const message = 'Arrow function has a complexity of 1. Maximum allowed is 0.';

  it('function getComplexity', () => {
    expect(getComplexity(message)).toBe(1);
  });

  it('function getFileName', () => {
    expect(
      getFileName(`${path.resolve()}/src/__tests__/testFiles/demo.test`),
    ).toBe('/src/__tests__/testFiles/demo.test');
  });

  it('function getAdvice', () => {
    expect(getAdvice(16)).toBe('强烈建议');
    expect(getAdvice(12)).toBe('建议');
    expect(getAdvice(9)).toBe('无需');
  });

  it('function executeOnFiles', async () => {
    expect(
      await executeOnFiles(
        [
          `${path.resolve()}/src/__tests__/testFiles/testA.ts`,
          `${path.resolve()}/src/__tests__/testFiles/testB.ts`,
        ],
        0,
      ),
    ).toEqual({
      fileCount: 2,
      funcCount: 2,
      result: [
        {
          advice: '无需',
          complexity: 5,
          fileName: '/src/__tests__/testFiles/testA.ts',
          funcType: 'ArrowFunctionExpression',
          position: '2,21',
        },
        {
          advice: '无需',
          complexity: 1,
          fileName: '/src/__tests__/testFiles/testB.ts',
          funcType: 'ArrowFunctionExpression',
          position: '2,21',
        },
      ],
    });

    expect(
      await executeOnFiles(
        [
          `${path.resolve()}/src/__tests__/testFiles/testA.ts`,
          `${path.resolve()}/src/__tests__/testFiles/testB.ts`,
        ],
        5,
      ),
    ).toEqual({
      fileCount: 2,
      funcCount: 2,
      result: [
        {
          advice: '无需',
          complexity: 5,
          fileName: '/src/__tests__/testFiles/testA.ts',
          funcType: 'ArrowFunctionExpression',
          position: '2,21',
        },
      ],
    });
  });

  it('function scanComplexity', async () => {
    expect(await scanComplexity({ extensions: '**/*.test' })).toEqual({
      fileCount: 1,
      funcCount: 1,
      result: [],
    });

    expect(await scanComplexity()).not.toBeNull();
  });
});
