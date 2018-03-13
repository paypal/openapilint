'use strict';

const assert = require('chai').assert;
const noParamRequiredDefaultRule = require('../../../lib/rules/no-param-required-default');

describe('no-param-required-default', () => {
  const options = true;

  it('should not report errors when there is no default value for a required parameter', () => {
    const schema = {
      paths: {
        '/first/{id}': {
          get: {
            parameters: [
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

    const failures = noParamRequiredDefaultRule.validate(options, schema);

    assert.equal(failures.size, 0);
  });

  it('should report errors when there are default values for required parameters', () => {
    const schema = {
      paths: {
        '/first/{id}': {
          get: {
            parameters: [
              {
                name: 'path_param',
                type: 'string',
                in: 'path',
                required: true,
                default: 'default_value'
              },
              {
                name: 'query_param',
                type: 'string',
                in: 'query',
                required: true,
                default: 2
              }
            ]
          }
        }
      }
    };

    const failures = noParamRequiredDefaultRule.validate(options, schema);

    assert.equal(failures.size, 2);
    assert.equal(failures.get(0).get('location'), 'paths./first/{id}.get.parameters[0]');
    assert.equal(failures.get(0).get('hint'), 'Expected required parameter to not have a default value.');
    assert.equal(failures.get(1).get('location'), 'paths./first/{id}.get.parameters[1]');
    assert.equal(failures.get(1).get('hint'), 'Expected required parameter to not have a default value.');
  });
});
