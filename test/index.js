import path from 'path';
import fs from 'fs';
import assert from 'assert';
import { transformFileSync } from '@babel/core';
import plugin from '../src';

function trim(str) {
  return str.replace(/\s+/g, '');
}

describe('', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  fs.readdirSync(fixturesDir).map((caseName) => {
    it(`should ${caseName.split('-').join(' ')}`, () => {
      const fixtureDir = path.join(fixturesDir, caseName);
      const actualPath = path.join(fixtureDir, 'actual.js');
      const actual = transformFileSync(actualPath, {
        plugins: [
          [plugin, {}],
          [
            'babel-plugin-transform-jsx-fragment',
            { moduleName: 'react', ignoreModuleCheck: true },
          ],
        ],
        parserOpts: {
          plugins: ['jsx'],
        },
      }).code;

      const expected = fs
        .readFileSync(path.join(fixtureDir, 'expected.js'))
        .toString();

      assert.equal(trim(actual), trim(expected));
    });
  });
});
