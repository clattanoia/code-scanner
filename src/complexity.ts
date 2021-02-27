/**
 * 代码复杂度检测
 */

import * as eslint from 'eslint';
import { scan } from './scan';

const { CLIEngine } = eslint;

const cli = new CLIEngine({
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
  useEslintrc: true,
});

/**
 * eslint提示前缀
 */
const MESSAGE_PREFIX = 'Maximum allowed is 1.';

/**
 * eslint提示后缀
 */
const MESSAGE_SUFFIX = 'has a complexity of ';

/**
 * 提取mssage主要部分
 */
const getMain = (message: string): string => {
  return message.replace(MESSAGE_PREFIX, '').replace(MESSAGE_SUFFIX, '');
};

/**
 * 提取代码复杂度
 */
const getComplexity = (message: string): number => {
  const main = getMain(message);
  /(\d+)\./g.test(main);
  return +RegExp.$1;
};

/**
 * 获取函数名
 */
const getFunctionName = (message: string): string => {
  const main = getMain(message);
  const test = /'([a-zA-Z0-9_$]+)'/g.test(main);
  return test ? RegExp.$1 : '*';
};

/**
 * 提取文件名称
 */
const getFileName = (filePath: string): string => {
  return filePath.replace(process.cwd(), '').trim();
};

/**
 * 获取重构建议
 */
const getAdvice = (complexity: number): string => {
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
const executeOnFiles = (paths: string[], min: number): FileReportMap => {
  const reports = cli.executeOnFiles(paths).results;
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
            funcName: getFunctionName(message),
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
