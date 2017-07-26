'use strict';

const assert = require('chai').assert;
const rootTagsRule = require('../../../lib/rules/root-tags');

describe('root-tags', () => {
  const options = true;

  it('should not report errors when not enabled', () => {
    const schema = {};

    const result = rootTagsRule.validate(false, schema);

    assert.isDefined(result.get('description'));
    assert.equal(result.get('failures').size, 0);
  });

  it('should not report errors when tags is present and non-empty', () => {
    const schema = {
      tags: [
          { name: 'tag1' },
          { name: 'tag2' }
      ]
    };

    const result = rootTagsRule.validate(options, schema);

    assert.isDefined(result.get('description'));
    assert.equal(result.get('failures').size, 0);
  });

  it('should report error when tags is not present', () => {
    const schema = {};

    const result = rootTagsRule.validate(options, schema);

    assert.isDefined(result.get('description'));
    assert.equal(result.get('failures').size, 1);
    assert.equal(result.get('failures').get(0).get('location'), 'tags');
    assert.equal(result.get('failures').get(0).get('hint'), '');
  });

  it('should report error when tags is empty', () => {
    const schema = {
      tags: []
    };

    const result = rootTagsRule.validate(options, schema);

    assert.isDefined(result.get('description'));
    assert.equal(result.get('failures').size, 1);
    assert.equal(result.get('failures').get(0).get('location'), 'tags');
    assert.equal(result.get('failures').get(0).get('hint'), '');
  });
});
