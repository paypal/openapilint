'use strict';

const assert = require('chai').assert;
const operationCustomRule = require('../../../lib/rules/operation-custom');

describe('operation-custom', () => {
  describe('summary must have non-whitespace summaries', () => {
    const basicOptions = {
      whenField: '$key',
      whenPattern: '.*',
      thenField: 'summary',
      thenPattern: '[a-zA-Z]'
    };

    it('should not report errors when titles are present and valid', () => {
      const schema = {
        paths: {
          '/pets': {
            get: {
              summary: 'The get pets summary'
            }
          }
        }
      };

      const failures = operationCustomRule.validate(basicOptions, schema);

      assert.equal(failures.size, 0);
    });

    it('should report errors when summary is not present', () => {
      const schema = {
        paths: {
          '/pets': {
            get: {
            }
          }
        }
      };

      const failures = operationCustomRule.validate([basicOptions], schema);

      assert.equal(failures.size, 1);
      assert.equal(failures.get(0).get('location'), 'paths./pets.get');
      assert.equal(failures.get(0).get('hint'), 'Expected operation summary to be present and to match "[a-zA-Z]"');
    });
  });
});
