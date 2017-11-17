'use strict';

const assert = require('chai').assert;
const rootConsumesRule = require('../../../lib/rules/root-consumes');

describe('root-consumes', () => {
  const options = true;

  it('should not report errors when consumes is present and non-empty', () => {
    const schema = {
      consumes: [
        'application/json'
      ]
    };

    const failures = rootConsumesRule.validate(options, schema);

    assert.equal(failures.size, 0);
  });

  it('should report error when consumes is not present', () => {
    const schema = {};

    const failures = rootConsumesRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'consumes');
    assert.equal(failures.get(0).get('hint'), 'Missing consumes');
  });

  it('should report error when consumes is empty', () => {
    const schema = {
      consumes: []
    };

    const failures = rootConsumesRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'consumes');
    assert.equal(failures.get(0).get('hint'), 'Empty consumes');
  });
});
