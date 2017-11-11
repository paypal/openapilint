'use strict';

const assert = require('chai').assert;
const rootProducesRule = require('../../../lib/rules/root-produces');

describe('root-produces', () => {
  const options = true;

  it('should not report errors when produces is present and non-empty', () => {
    const schema = {
      produces: [
        'application/json'
      ]
    };

    const failures = rootProducesRule.validate(options, schema);

    assert.equal(failures.size, 0);
  });

  it('should report error when produces is not present', () => {
    const schema = {};

    const failures = rootProducesRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'produces');
    assert.equal(failures.get(0).get('hint'), 'Missing produces');
  });

  it('should report error when produces is empty', () => {
    const schema = {
      produces: []
    };

    const failures = rootProducesRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'produces');
    assert.equal(failures.get(0).get('hint'), 'Empty produces');
  });
});
