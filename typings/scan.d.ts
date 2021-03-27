interface ScanParams {
  rootPath: string;
  ignoreRules: string[];
  defalutIgnore: boolean;
  extensions: string;
  ignoreFileName: string;
}

interface Line {
  file: string;
  type: string;
  codeLine: number;
  blankLine: number;
  allLine: number;
}

interface LineReport {
  name?: string;
  files: number;
  allLine: number;
  codeLine: number;
  blankLine: number;
}

interface LineReportMap {
  [key: string]: LineReport;
}

interface FileReport {
  funcType?: string;
  position: string;
  fileName: string;
  complexity: number;
  advice: string;
}

interface FileReportMap {
  fileCount: number;
  funcCount: number;
  result: FileReport[];
}
