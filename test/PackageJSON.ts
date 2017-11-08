import test from 'ava';
import {access, constants, readFileSync} from 'fs';
import {basename, dirname, join, resolve} from 'path';

const pkgPath: string = resolve(__dirname, '..', 'package.json');
const pkgString: string = readFileSync(pkgPath, 'utf8');
const pkg: any = JSON.parse(pkgString);

const requireKeys = [
  'main',
  'es2015',
  'module',
  'typings'
];

for (const key of requireKeys) {
  const path = resolve(__dirname, '..', pkg[key]);
  test(`Has the "${key}" key`, t => t.true(key in pkg));

  if (key !== 'typings') {
    test.cb(`File for key "${key}" has mapping file`, t => {
      const dir = dirname(path);
      const base = basename(path);
      const finalPath = join(dir, base + '.map');

      access(finalPath, constants.F_OK, (e: Error) => {
        t.falsy(e);
        t.end();
      });
    });
  }

  test.cb(`File for key "${key}" exists`, t => {
    access(path, constants.F_OK, (e: NodeJS.ErrnoException) => {
      t.falsy(e);
      t.end();
    });
  });
}
