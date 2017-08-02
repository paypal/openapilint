'use strict';

const _ = require('lodash');
const assert = require('chai').assert;
const pathParametersRule = require('../../../lib/rules/path-parameters');

describe('path-parameters', () => {
  const options = true;

  // validSchema is used as the base for all tests to make them easier to read.
  const validSchema = {
    paths: {
      'first/{first_id}/second/{id}': {
        get: {
          parameters: [
            {
              name: 'first_id',
              type: 'string',
              in: 'path'
            },
            {
              name: 'id',
              type: 'string',
              in: 'path'
            }
          ]
        }
      }
    }
  };

  it('should not report errors when path parameters match the path parameters in the URI', (done) => {
    const failures = pathParametersRule.validate(options, validSchema);

    assert.equal(failures.size, 0);
    done();
  });

  it('should report error when a parameter specified in path is missing from parameter list', (done) => {
    const schema = _.cloneDeep(validSchema);
    schema.paths['first/{first_id}/second/{id}'].get.parameters = [];

    const failures = pathParametersRule.validate(options, schema);

    assert.equal(failures.size, 2);
    assert.equal(failures.get(0).get('location'), 'paths.first/{first_id}/second/{id}.get');
    assert.equal(failures.get(0).get('hint'), 'missing from parameter list: first_id');
    assert.equal(failures.get(1).get('location'), 'paths.first/{first_id}/second/{id}.get');
    assert.equal(failures.get(1).get('hint'), 'missing from parameter list: id');
    done();
  });

  it('should report error when there is an extra path parameter in the parameters list not in path', (done) => {
    const schema = _.cloneDeep(validSchema);
    schema.paths['first/{first_id}/second/{id}'].get.parameters.push({
      name: 'third_id',
      type: 'string',
      in: 'path'
    });

    const failures = pathParametersRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths.first/{first_id}/second/{id}.get.parameters[2]');
    assert.equal(failures.get(0).get('hint'), 'missing from path template: third_id');
    done();
  });

  it('should report several errors for lots of problems', (done) => {
    const schema = {
      paths: {
        'first/{id}': {
          get: {
            id: 'first.get'
          },
          post: {
            id: 'first.create'
          }
        },
        'second/{customer_id}/details': {
          get: {
            parameters: [
              {
                name: 'customer_id',
                type: 'string',
                in: 'path'
              },
              {
                name: 'event_id',
                type: 'string',
                in: 'path'
              }
            ]
          },
          put: {
            parameters: [
              {
                name: 'customer',
                type: 'string',
                in: 'path'
              },
              {
                name: 'event_id',
                type: 'string',
                in: 'path'
              }
            ]
          }
        }
      }
    };

    const failures = pathParametersRule.validate(options, schema);

    assert.equal(failures.size, 6);
    assert.equal(failures.get(0).get('location'), 'paths.first/{id}.get');
    assert.equal(failures.get(0).get('hint'), 'missing from parameter list: id');
    assert.equal(failures.get(1).get('location'), 'paths.first/{id}.post');
    assert.equal(failures.get(1).get('hint'), 'missing from parameter list: id');
    assert.equal(failures.get(2).get('location'), 'paths.second/{customer_id}/details.get.parameters[1]');
    assert.equal(failures.get(2).get('hint'), 'missing from path template: event_id');
    assert.equal(failures.get(3).get('location'), 'paths.second/{customer_id}/details.put.parameters[0]');
    assert.equal(failures.get(3).get('hint'), 'missing from path template: customer');
    assert.equal(failures.get(4).get('location'), 'paths.second/{customer_id}/details.put.parameters[1]');
    assert.equal(failures.get(4).get('hint'), 'missing from path template: event_id');
    assert.equal(failures.get(5).get('location'), 'paths.second/{customer_id}/details.put');
    assert.equal(failures.get(5).get('hint'), 'missing from parameter list: customer_id');
    done();
  });
});
