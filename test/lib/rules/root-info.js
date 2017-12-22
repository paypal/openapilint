'use strict';

const assert = require('chai').assert;
const rootinfoRule = require('../../../lib/rules/root-info');

describe('root-info', () => {
  const options = true;

  it('should not report errors when info is present and has a valid title and version', () => {
    const schema = {
      info: {
        title: 'The title',
        version: '1.3'
      }
    };

    const failures = rootinfoRule.validate(options, schema);

    assert.equal(failures.size, 0);
  });

  it('should report error when info is not present', () => {
    const schema = {};

    const failures = rootinfoRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'info');
    assert.equal(failures.get(0).get('hint'), 'Missing info');
  });

  it('should report error when info has no title', () => {
    const schema = {
      info: {
        version: '1.3'
      }
    };

    const failures = rootinfoRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'info');
    assert.equal(failures.get(0).get('hint'), 'Missing info.title');
  });

  it('should report error when info has no version', () => {
    const schema = {
      info: {
        title: 'The title'
      }
    };

    const failures = rootinfoRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'info');
    assert.equal(failures.get(0).get('hint'), 'Missing info.version');
  });

  it('should report 2 errors when info has both no version and no title', () => {
    const schema = {
      info: {
      }
    };

    const failures = rootinfoRule.validate(options, schema);

    assert.equal(failures.size, 2);
    assert.equal(failures.get(0).get('location'), 'info');
    assert.equal(failures.get(0).get('hint'), 'Missing info.title');
    assert.equal(failures.get(1).get('location'), 'info');
    assert.equal(failures.get(1).get('hint'), 'Missing info.version');
  });
});
