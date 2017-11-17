'use strict';

const assert = require('chai').assert;
const noPathDupesRule = require('../../../lib/rules/no-path-dupes');

describe('no-path-dupes', () => {
  const options = true;

  it('should not report errors when all paths are unique', () => {
    const schema = {
      paths: {
        '{root_id}': {},
        '/pets': {},
        '/pets/{pet_id}': {},
        '/pets/{pet_id}/feed': {},
        '/pets/{pet_id}/feed/{another_id}': {},
        '/pets/{pet_id}/feed/{another_id}/full': {}
      }
    };

    const failures = noPathDupesRule.validate(options, schema);

    assert.equal(failures.size, 0);
  });

  it('should report an error when two simple paths are functionally equivalent', () => {
    const schema = {
      paths: {
        '/{pet_id}': {},
        '/{monster_id}': {}
      }
    };

    const failures = noPathDupesRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./{monster_id}');
    assert.equal(failures.get(0).get('hint'), 'Found duplicate path');
  });

  it('should report an error when two complex paths are functionally equivalent', () => {
    const schema = {
      paths: {
        '/pets/{pet_id}/feed/{another_id}': {},
        '/pets/{monster_id}/feed/{another_monster_id}': {}
      }
    };

    const failures = noPathDupesRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets/{monster_id}/feed/{another_monster_id}');
    assert.equal(failures.get(0).get('hint'), 'Found duplicate path');
  });

  it('should report n-1 errors when n paths are duplicated', () => {
    const schema = {
      paths: {
        '/pets/{pet_id}': {},
        '/pets/{pet_id2}': {},
        '/pets/{pet_id3}': {},
        '/pets/{pet_id4}': {},
        '/pets/{pet_id5}': {}
      }
    };

    const failures = noPathDupesRule.validate(options, schema);

    assert.equal(failures.size, 4);
    assert.equal(failures.get(0).get('location'), 'paths./pets/{pet_id2}');
    assert.equal(failures.get(0).get('hint'), 'Found duplicate path');
    assert.equal(failures.get(1).get('location'), 'paths./pets/{pet_id3}');
    assert.equal(failures.get(1).get('hint'), 'Found duplicate path');
    assert.equal(failures.get(2).get('location'), 'paths./pets/{pet_id4}');
    assert.equal(failures.get(2).get('hint'), 'Found duplicate path');
    assert.equal(failures.get(3).get('location'), 'paths./pets/{pet_id5}');
    assert.equal(failures.get(3).get('hint'), 'Found duplicate path');
  });
});
