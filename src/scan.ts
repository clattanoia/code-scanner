import * as path from 'path';
import * as fs from 'fs';
import * as glob from 'glob';
import ignore from 'ignore';

/**
 * 默认扫描扩展
 */
const EXTENSIONS = '**/*.?(js|ts|vue|jsx|tsx)';

/**
 * 默认忽略文件夹
 */
const DEFAULT_IGNORE_PATTERNS = [
  'node_modules/**',
  'build/**',
  'dist/**',
  'output/**',
  'common_build/**',
];

/**
 * ignore文件名
 */
const IGNORE_FILE_NAME = '.gitignore';

/**
 * 默认参数
 */
const DEFAULT_PARAM: ScanParams = {
  rootPath: '.',
  ignoreRules: [],
  defalutIgnore: true,
  extensions: EXTENSIONS,
  ignoreFileName: IGNORE_FILE_NAME,
};

/**
 * 获取glob扫描的文件列表
 */
export const getGlobScan = (
  rootPath: string,
  extensions: string,
  defalutIgnore: boolean,
): Promise<string[]> => {
  return new Promise(resolve => {
    console.log('scan-glob', `${rootPath}/${extensions}`);
    glob(
      `${rootPath}/${extensions}`,
      { dot: true, ignore: defalutIgnore ? DEFAULT_IGNORE_PATTERNS : [] },
      (err, files) => {
        if (err) {
          console.log(err);
          process.exit(1);
        }
        resolve(files);
      },
    );
  });
};

/**
 * 加载ignore配置文件，并处理成数组
 */
export const loadIgnorePatterns = async (
  ignoreFileName: string,
): Promise<string[]> => {
  const ignorePath = path.resolve(process.cwd(), ignoreFileName);
  try {
    const ignores = fs.readFileSync(ignorePath, 'utf8');
    return ignores.split(/[\n\r]|\n\r/).filter(pattern => Boolean(pattern));
  } catch (e) {
    return [];
  }
};

/**
 * 根据ignore配置过滤文件列表
 */
export const filterFilesByIgnore = (
  files: string[],
  ignorePatterns: string[],
  ignoreRules: string[],
  cwd: string = process.cwd(),
): string[] => {
  const ig = ignore().add([...ignorePatterns, ...ignoreRules]);
  const filtered = files
    .map(raw => (path.isAbsolute(raw) ? raw : path.resolve(cwd, raw)))
    .map(raw => path.relative(cwd, raw))
    .filter(filePath => !ig.ignores(filePath))
    .map(raw => path.resolve(cwd, raw));
  return filtered;
};

/**
 * 执行扫描
 */
export const scan = async (param: Partial<ScanParams>): Promise<string[]> => {
  const { rootPath, extensions, defalutIgnore, ignoreRules, ignoreFileName } = {
    ...DEFAULT_PARAM,
    ...param,
  };

  // todo: check it
  process.chdir(rootPath);

  const ignorePatterns = await loadIgnorePatterns(ignoreFileName);
  const files = await getGlobScan(rootPath, extensions, defalutIgnore);

  return filterFilesByIgnore(files, ignorePatterns, ignoreRules);
};
