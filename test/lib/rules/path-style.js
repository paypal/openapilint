'use strict';

const assert = require('chai').assert;
const pathStyleRule = require('../../../lib/rules/path-style');

describe('path-style', () => {
  const spineCaseOptions = { style: 'spine-case' };
  const capSpineCaseOptions = { style: 'cap-spine-case' };
  const snakeCaseOptions = { style: 'snake-case' };
  const camelCaseOptions = { style: 'camel-case' };
  const properCaseOptions = { style: 'proper-case' };

  it('should not report errors for no paths', () => {
    const schema = { paths: { } };
    const failures = pathStyleRule.validate(spineCaseOptions, schema);
    assert.equal(failures.size, 0);
  });

  it('should not report errors when the paths match the spine-case style', () => {
    const schema = { paths: { '/first/{id}/second-third': {}, '/fourth': {} } };
    const failures = pathStyleRule.validate(spineCaseOptions, schema);
    assert.equal(failures.size, 0);
  });

  it('should not report errors when the paths match the cap-spine-case style', () => {
    const schema = { paths: { '/FIRST/{id}/SECOND-THIRD': { }, '/FOURTH': {} } };
    const failures = pathStyleRule.validate(capSpineCaseOptions, schema);
    assert.equal(failures.size, 0);
  });

  it('should not report errors when the paths match the snake-case style', () => {
    const schema = { paths: { '/first/{id}/second_third': {} } };
    const failures = pathStyleRule.validate(snakeCaseOptions, schema);
    assert.equal(failures.size, 0);
  });

  it('should not report errors when the paths match the camel-case style', () => {
    const schema = { paths: { '/first/{id}/secondThird': { } } };
    const failures = pathStyleRule.validate(camelCaseOptions, schema);
    assert.equal(failures.size, 0);
  });

  it('should not report errors when the paths match the proper-case style', () => {
    const schema = { paths: { '/First/{id}/SecondThird': { } } };
    const failures = pathStyleRule.validate(properCaseOptions, schema);
    assert.equal(failures.size, 0);
  });

  it('should report an error when the config is not properly specified', () => {
    const badConfigRuleFunction = () => {
      const schema = {};
      pathStyleRule.validate({}, schema);
    };
    assert.throws(badConfigRuleFunction, Error, 'Invalid config to path-style specified');
  });

  it('should report an error for a path without a starting slash', (done) => {
    const schema = { paths: { pets: { } } };

    const failures = pathStyleRule.validate(spineCaseOptions, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths.pets');
    assert.equal(failures.get(0).get('hint'), 'Missing a leading slash');
    done();
  });

  it('should report an error for a path not matching the case', (done) => {
    const schema = { paths: { '/badCase': { } } };

    const failures = pathStyleRule.validate(spineCaseOptions, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./badCase');
    assert.equal(failures.get(0).get('hint'), 'Does not match case: "spine-case"');
    done();
  });

  it('should report an error for a path with a trailing slash', (done) => {
    const schema = { paths: { '/pets/': { } } };

    const failures = pathStyleRule.validate(spineCaseOptions, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets/');
    assert.equal(failures.get(0).get('hint'), 'Must not have a trailing slash');
    done();
  });

  it('should report an error for a path with invalid path params', (done) => {
    const schema = { paths: { '/incomplete-param/{id/more-stuff': { } } };

    const failures = pathStyleRule.validate(spineCaseOptions, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./incomplete-param/{id/more-stuff');
    assert.equal(failures.get(0).get('hint'), 'Invalid path param');
    done();
  });
});
