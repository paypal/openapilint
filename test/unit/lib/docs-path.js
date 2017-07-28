'use strict';

const assert = require('chai').assert;
const docsPathRule = require('../../../lib/rules/docs-path');

describe('docs-path', () => {
  const options = true;

  it('should not report errors when x-docPath is present', () => {
    const schema = {
      info: {
        'x-docPath': 'myApiPath'
      }
    };

    const failures = docsPathRule.validate(options, schema);

    assert.equal(failures.size, 0);
  });

  it('should report error when x-docPath is not present', () => {
    const schema = {
      info: {
      }
    };

    const failures = docsPathRule.validate(options, schema);

    assert.equal(failures.size, 1);

    assert.equal(failures.get(0).get('location'), 'info');
    assert.equal(failures.get(0).get('hint'), '');
  });

  it('should report error when x-docPath is not well formed', () => {
    const schema = {
      info: {
        'x-docPath': 'my invalid #path'
      }
    };

    const failures = docsPathRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'info.x-docPath');
    assert.equal(failures.get(0).get('hint'), '');
  });
});
