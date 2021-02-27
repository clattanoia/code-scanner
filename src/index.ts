// import { scan } from './scan';
import { scanLines } from './line';
// import { scanComplexity } from './complexity';

(async () => {
  // console.log(
  //   'scanList',
  //   await scan({
  //     extensions: '**/*.ts',
  //     // rootPath: 'src',
  //     defalutIgnore: true,
  //     ignoreRules: [],
  //     ignoreFileName: '.gitignore',
  //   }),
  // );
  const result = await scanLines({ extensions: '**/+(*.ts|*.js)' });
  // const result = await scanComplexity({}, 2);
  console.log(result);
})();
