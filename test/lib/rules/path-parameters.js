'use strict';

const _ = require('lodash');
const assert = require('chai').assert;
const pathParametersRule = require('../../../lib/rules/path-parameters');

describe('path-parameters', () => {
  const options = true;

  // validSchema is used as the base for all tests to make them easier to read.
  const validSchema = {
    paths: {
      '/first/{first_id}/second/{id}': {
        get: {
          parameters: [
            {
              name: 'first_id',
              type: 'string',
              in: 'path',
              required: true
            },
            {
              name: 'id',
              type: 'string',
              in: 'path',
              required: true
            }
          ]
        }
      }
    }
  };

  it('should not report errors when path parameters match the path parameters in the URI', () => {
    const failures = pathParametersRule.validate(options, validSchema);

    assert.equal(failures.size, 0);
  });

  it('should report error when a parameter specified in path is Missing from parameter list', () => {
    const schema = _.cloneDeep(validSchema);

    schema.paths['/first/{first_id}/second/{id}'].get.parameters = [];

    const failures = pathParametersRule.validate(options, schema);

    assert.equal(failures.size, 2);
    assert.equal(failures.get(0).get('location'), 'paths./first/{first_id}/second/{id}.get');
    assert.equal(failures.get(0).get('hint'), 'Missing from parameter list: first_id');
    assert.equal(failures.get(1).get('location'), 'paths./first/{first_id}/second/{id}.get');
    assert.equal(failures.get(1).get('hint'), 'Missing from parameter list: id');
  });

  it('should report error when there is an extra path parameter in the parameters list not in path', () => {
    const schema = _.cloneDeep(validSchema);

    schema.paths['/first/{first_id}/second/{id}'].get.parameters.push({
      name: 'third_id',
      type: 'string',
      in: 'path',
      required: true
    });

    const failures = pathParametersRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./first/{first_id}/second/{id}.get.parameters[2]');
    assert.equal(failures.get(0).get('hint'), 'Missing from path template: third_id');
  });

  it('should report error when there is an path parameter without any required property', () => {
    const schema = _.cloneDeep(validSchema);

    delete schema.paths['/first/{first_id}/second/{id}'].get.parameters[0].required;

    const failures = pathParametersRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./first/{first_id}/second/{id}.get.parameters[0]');
    assert.equal(failures.get(0).get('hint'), 'Found path parameter without required=true: first_id');
  });

  it('should report error when there is an path parameter with required=false', () => {
    const schema = _.cloneDeep(validSchema);

    schema.paths['/first/{first_id}/second/{id}'].get.parameters[0].required = false;

    const failures = pathParametersRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./first/{first_id}/second/{id}.get.parameters[0]');
    assert.equal(failures.get(0).get('hint'), 'Found path parameter without required=true: first_id');
  });

  it('should report several errors for lots of problems', () => {
    const schema = {
      paths: {
        '/first/{id}': {
          get: {},
          post: {
            parameters: []
          }
        },
        '/second/{customer_id}/details': {
          get: {
            parameters: [
              {
                name: 'customer_id',
                type: 'string',
                in: 'path',
                required: true
              },
              {
                name: 'extra_path_id',
                type: 'string',
                in: 'path',
                required: true
              }
            ]
          },
          put: {
            parameters: [
              {
                name: 'customer',
                type: 'string',
                in: 'path',
                required: true
              },
              {
                name: 'extra_path_id',
                type: 'string',
                in: 'path',
                required: true
              }
            ]
          }
        },
        '/missing_required/{customer_id}': {
          get: {
            parameters: [
              {
                name: 'customer_id',
                type: 'string',
                in: 'path'
              }
            ]
          }
        }
      }
    };

    const failures = pathParametersRule.validate(options, schema);

    assert.equal(failures.size, 7);
    assert.equal(failures.get(0).get('location'), 'paths./first/{id}.get');
    assert.equal(failures.get(0).get('hint'), 'Missing from parameter list: id');
    assert.equal(failures.get(1).get('location'), 'paths./first/{id}.post');
    assert.equal(failures.get(1).get('hint'), 'Missing from parameter list: id');
    assert.equal(failures.get(2).get('location'), 'paths./second/{customer_id}/details.get.parameters[1]');
    assert.equal(failures.get(2).get('hint'), 'Missing from path template: extra_path_id');
    assert.equal(failures.get(3).get('location'), 'paths./second/{customer_id}/details.put.parameters[0]');
    assert.equal(failures.get(3).get('hint'), 'Missing from path template: customer');
    assert.equal(failures.get(4).get('location'), 'paths./second/{customer_id}/details.put.parameters[1]');
    assert.equal(failures.get(4).get('hint'), 'Missing from path template: extra_path_id');
    assert.equal(failures.get(5).get('location'), 'paths./second/{customer_id}/details.put');
    assert.equal(failures.get(5).get('hint'), 'Missing from parameter list: customer_id');
    assert.equal(failures.get(6).get('location'), 'paths./missing_required/{customer_id}.get.parameters[0]');
    assert.equal(failures.get(6).get('hint'), 'Found path parameter without required=true: customer_id');
  });
});
