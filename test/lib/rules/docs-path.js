'use strict';

const assert = require('chai').assert;
const docsPathRule = require('../../../lib/rules/docs-path');

describe('docs-path', () => {
  const options = true;

  it('should not report errors when x-publicDocsPath is present', () => {
    const schema = {
      info: {
        'x-publicDocsPath': 'myApiPath-includes-dashes'
      }
    };

    const failures = docsPathRule.validate(options, schema);

    assert.equal(failures.size, 0);
  });

  it('should report error when x-publicDocsPath is not present', () => {
    const schema = {
      info: {
      }
    };

    const failures = docsPathRule.validate(options, schema);

    assert.equal(failures.size, 1);

    assert.equal(failures.get(0).get('location'), 'info');
    assert.equal(failures.get(0).get('hint'), 'Missing');
  });

  it('should report error when x-publicDocsPath is not well formed', () => {
    const schema = {
      info: {
        'x-publicDocsPath': 'my invalid #path'
      }
    };

    const failures = docsPathRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'info.x-publicDocsPath');
    assert.equal(failures.get(0).get('hint'), 'Not a valid path');
  });
});
