/**
 * 代码行数检测
 */
import * as fs from 'fs';
import { scan } from './scan';

const DEFAULT_PARAM = {
  // extensions: '**/+(*.js|*.md|*.cpp|*.py|*.ts|*.tsx|*.jsx|*.vue|*.json|*.c|*.h|*.c++|*.java|*.php|*.html|*.ejs|*.css|*.sass|*.less|*.sql|*.dart|*.xml|*.go|*.svg|*.cc|*.CPP|*.cpp|*.cxx|*.h++|*.inl|*.ipp|*.pcc|*.tcc|*.tpp|*.jsp)'
  extensions: '**/+(*.*)',
};

/**
 * 获取文件类型
 */
export const getFileType = (path: string): string => {
  const matches = /\.[\w]+$/.exec(path);
  return matches ? matches[0].replace('.', '') : '';
};

/**
 * 计算单个文件的代码行数
 */
export const getLine = (file: string): Line | void => {
  try {
    const fileContent = fs.readFileSync(file).toString();
    const codeArray = fileContent.split('\n');
    const allLine = codeArray.length;
    const codeLine = codeArray.filter(c => c).length;
    const blankLine = allLine - codeLine;
    const type = getFileType(file);
    if (type && allLine) {
      return {
        file,
        type,
        codeLine,
        blankLine,
        allLine,
      };
    }
  } catch (error) {
    // 类似 .git 类的文件夹会根据规则被匹配为文件。
  }
};

/**
 * 获取代码行数
 */
export const getCodeLine = (files: string[]): Line[] => {
  const result: Line[] = [];
  files.forEach(file => {
    const line = getLine(file);
    if (line) {
      result.push(line);
    }
  });
  return result;
};

/**
 * 处理统计结果
 */
export const formatReport = (report: LineReportMap): LineReport[] => {
  const lineReportList: LineReport[] = [];
  const totalReport: LineReport = {
    name: 'total',
    files: 0,
    allLine: 0,
    codeLine: 0,
    blankLine: 0,
  };
  for (const key in report) {
    lineReportList.push({
      name: key,
      ...report[key],
    });
    totalReport.files += report[key].files;
    totalReport.allLine += report[key].allLine;
    totalReport.codeLine += report[key].codeLine;
    totalReport.blankLine += report[key].blankLine;
  }
  lineReportList.push(totalReport);
  return lineReportList.sort((a, b) => b.allLine - a.allLine);
};

/**
 * 统计源文件代码情况
 */
export const getLineReport = (datas: Line[]): LineReport[] => {
  const result: LineReportMap = {};
  for (let i = 0; i < datas.length; i++) {
    const { type, codeLine, blankLine, allLine } = datas[i];
    const current = result[type];
    if (result[type]) {
      current.codeLine += codeLine;
      current.blankLine += blankLine;
      current.allLine += allLine;
      current.files++;
    } else {
      result[type] = {
        codeLine,
        blankLine,
        allLine,
        files: 1,
      };
    }
  }
  return formatReport(result);
};

/**
 * 执行扫描
 */
export const scanLines = async (
  scanParam: Partial<ScanParams> = {},
): Promise<{ lines: Line[]; reports: LineReport[] }> => {
  const files = await scan({ ...DEFAULT_PARAM, ...scanParam });

  const lines = getCodeLine(files);

  const reports = getLineReport(lines);

  return {
    lines,
    reports,
  };
};
