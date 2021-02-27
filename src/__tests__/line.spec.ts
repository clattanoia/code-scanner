import * as path from 'path';

import {
  getFileType,
  getLine,
  getCodeLine,
  formatReport,
  getLineReport,
  scanLines,
} from '../line';

const jsResult = {
  files: 10,
  allLine: 1000,
  codeLine: 900,
  blankLine: 100,
};

const tsResult = {
  files: 1,
  allLine: 100,
  codeLine: 90,
  blankLine: 10,
};

const scanLineResultMap = {
  js: jsResult,
  ts: tsResult,
};

const lines = [
  {
    allLine: 4,
    blankLine: 2,
    codeLine: 2,
    file: 'src/__tests__/testFiles/demo.md',
    type: 'md',
  },
  {
    allLine: 4,
    blankLine: 2,
    codeLine: 2,
    file: 'src/__tests__/testFiles/demo.test',
    type: 'test',
  },
];

describe('Line', () => {
  it('function getFileType', () => {
    expect(getFileType('demo.ts')).toBe('ts');
    expect(getFileType('.gitignore')).toBe('gitignore');
    expect(getFileType('Dockerfile')).toBe('');
  });

  it('function getLine', () => {
    expect(getLine('src/__tests__/testFiles/demo.md')).toEqual({
      allLine: 4,
      blankLine: 2,
      codeLine: 2,
      file: 'src/__tests__/testFiles/demo.md',
      type: 'md',
    });
    expect(getLine('src/__tests__/testFiles/demo')).toBeUndefined;
  });

  it('function getCodeLine', () => {
    const files = [
      'src/__tests__/testFiles/demo.md',
      'src/__tests__/testFiles/demo.test',
      'src/__tests__/testFiles/demo',
    ];
    expect(getCodeLine(files)).toEqual(lines);
  });

  it('function formatReport', () => {
    expect(formatReport(scanLineResultMap).length).toBe(3);
    expect(formatReport({ js: jsResult })).toEqual([
      { allLine: 1000, blankLine: 100, codeLine: 900, files: 10, name: 'js' },
      {
        allLine: 1000,
        blankLine: 100,
        codeLine: 900,
        files: 10,
        name: 'total',
      },
    ]);
  });

  it('function getLineReport', () => {
    expect(
      getLineReport([
        ...lines,
        {
          allLine: 4,
          blankLine: 2,
          codeLine: 2,
          file: 'src/__tests__/testFiles/demo.test',
          type: 'test',
        },
      ]),
    ).toEqual([
      { allLine: 12, blankLine: 6, codeLine: 6, files: 3, name: 'total' },
      { allLine: 8, blankLine: 4, codeLine: 4, files: 2, name: 'test' },
      { allLine: 4, blankLine: 2, codeLine: 2, files: 1, name: 'md' },
    ]);
  });

  it('function scanLines', async () => {
    expect(scanLines()).toBeInstanceOf(Promise);
    expect(await scanLines({ extensions: '**/*.test' })).toEqual({
      lines: [
        {
          allLine: 4,
          blankLine: 2,
          codeLine: 2,
          file: `${path.resolve()}/src/__tests__/testFiles/demo.test`,
          type: 'test',
        },
      ],
      reports: [
        {
          allLine: 4,
          blankLine: 2,
          codeLine: 2,
          files: 1,
          name: 'test',
        },
        {
          allLine: 4,
          blankLine: 2,
          codeLine: 2,
          files: 1,
          name: 'total',
        },
      ],
    });
  });
});
