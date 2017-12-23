'use strict';

const assert = require('chai').assert;
const operationResponseCodesRule = require('../../../lib/rules/operation-response-codes');

describe('operation-response-codes', () => {
  describe('get must be 200 or default', () => {
    const options = {
      whenHttpMethod: 'get',
      thenResponseCodePattern: '(200|default)'
    };

    it('should not report errors when operation-response-codes are correct', () => {
      const schema = {
        paths: {
          '/pets': {
            get: {
              responses: {
                200: {
                },
                default: {
                }
              }
            }
          }
        }
      };

      const failures = operationResponseCodesRule.validate(options, schema);

      assert.equal(failures.size, 0);
    });

    it('should report an error when operation-response-codes include a non-matching code', () => {
      const schema = {
        paths: {
          '/pets': {
            get: {
              responses: {
                204: {
                }
              }
            }
          }
        }
      };

      const failures = operationResponseCodesRule.validate([options], schema);

      assert.equal(failures.size, 1);
      assert.equal(failures.get(0).get('location'), 'paths./pets.get.responses.204');
      assert.equal(failures.get(0).get('hint'), 'Expected responses $key:"204" to match "(200|default)"');
    });
  });

  describe('options must be valid', () => {
    it('should throw error when options are invalid', () => {
      const badConfigRuleFunction = () => {
        operationResponseCodesRule.validate({}, {});
      };

      assert.throws(badConfigRuleFunction, Error, 'Invalid option specified: {}');
    });

    it('should throw error when options are invalid', () => {
      const badConfigRuleFunction = () => {
        operationResponseCodesRule.validate({ whenHttpMethod: 'get' }, {});
      };

      assert.throws(badConfigRuleFunction, Error, 'Invalid option specified: {"whenHttpMethod":"get"}');
    });
  });
});
