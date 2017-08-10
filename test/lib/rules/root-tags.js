'use strict';

const assert = require('chai').assert;
const rootTagsRule = require('../../../lib/rules/root-tags');

describe('root-tags', () => {
  const options = true;

  it('should not report errors when tags is present and non-empty', () => {
    const schema = {
      tags: [
          { name: 'tag1' },
          { name: 'tag2' }
      ]
    };

    const failures = rootTagsRule.validate(options, schema);

    assert.equal(failures.size, 0);
  });

  it('should report error when tags is not present', () => {
    const schema = {};

    const failures = rootTagsRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'tags');
    assert.equal(failures.get(0).get('hint'), 'Missing tags');
  });

  it('should report error when tags is empty', () => {
    const schema = {
      tags: []
    };

    const failures = rootTagsRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'tags');
    assert.equal(failures.get(0).get('hint'), 'Empty tags');
  });
});
