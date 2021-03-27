/**
 * 代码复杂度检测
 */

import * as eslint from 'eslint';
import { scan } from './scan';

const cli = new eslint.ESLint({
  overrideConfig: {
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    rules: {
      complexity: ['error', { max: 0 }],
    },
  },
});

/**
 * 提取代码复杂度
 */
export const getComplexity = (message: string): number => {
  const COMPLEXITY = /complexity of (\d*)./;
  const regExpResult = COMPLEXITY.exec(message);
  if (regExpResult && typeof regExpResult[1] === 'string') {
    return Number(regExpResult[1]);
  }
  return 0;
};

/**
 * 提取文件名称
 */
export const getFileName = (filePath: string): string => {
  return filePath.replace(process.cwd(), '').trim();
};

/**
 * 获取重构建议
 */
export const getAdvice = (complexity: number): string => {
  if (complexity > 15) {
    return '强烈建议';
  } else if (complexity > 10) {
    return '建议';
  } else {
    return '无需';
  }
};

/**
 * 获取单个文件的复杂度
 */
export const executeOnFiles = async (
  paths: string[],
  min: number,
): Promise<FileReportMap> => {
  const reports = await cli.lintFiles(paths);
  // console.log(reports.map(el => el.messages));
  const result: FileReport[] = [];
  const fileCount = paths.length;
  let funcCount = 0;
  for (let i = 0; i < reports.length; i++) {
    const { messages, filePath } = reports[i];
    for (let j = 0; j < messages.length; j++) {
      const { message, ruleId, line, column, nodeType } = messages[j];
      funcCount++;
      if (ruleId === 'complexity') {
        const complexity = getComplexity(message);
        if (complexity >= min) {
          result.push({
            funcType: nodeType,
            position: line + ',' + column,
            fileName: getFileName(filePath),
            complexity,
            advice: getAdvice(complexity),
          });
        }
      }
    }
  }
  return { fileCount, funcCount, result };
};

/**
 * 执行扫描
 */
export const scanComplexity = async (
  scanParam: Partial<ScanParams> = {},
  min = 1,
): Promise<FileReportMap> => {
  const files = await scan(scanParam);
  return executeOnFiles(files, min);
};
