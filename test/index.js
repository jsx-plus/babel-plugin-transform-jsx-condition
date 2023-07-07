import assert from 'assert';
import { transformSync } from '@babel/core';
import plugin from '../src';

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

describe('jsx-plus', () => {
  it('transform', () => {
    const { code } = transformSync('<div x-if={false} />', {
      plugins: [[plugin, {}]],
      parserOpts: {
        plugins: ['jsx'],
      },
    });
    assert.equal(
      code,
      `import { createCondition as __create_condition__ } from "babel-runtime-jsx-plus";
__create_condition__([[() => false, () => <div />]]);`
    );
  });

  it('transformer w/ parent element is a <></> ', () => {
    const { code } = transformSync('<><div x-if={true} /></>', {
      plugins: [
        [plugin],
        [
          'babel-plugin-transform-jsx-fragment',
          { moduleName: 'react', ignoreModuleCheck: true },
        ],
      ],
      parserOpts: {
        plugins: ['jsx'],
      },
    });
    assert.equal(
      code,
      `import { createCondition as __create_condition__ } from "babel-runtime-jsx-plus";
import { Fragment } from "react";
<>{__create_condition__([[() => true, () => <div />]])}</>;`
    );
  });
});
