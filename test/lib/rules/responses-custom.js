'use strict';

const assert = require('chai').assert;
const responsesCustomRule = require('../../../lib/rules/responses-custom');

describe('responses-custom', () => {
  describe('$key must 200 or 201', () => {
    const options = {
      whenField: '$key',
      whenPattern: '\\.*',
      thenField: '$key',
      thenPattern: '^(200|201)$'
    };

    it('should not report errors when key is correct', () => {
      const schema = {
        paths: {
          '/pets': {
            get: {
              responses: {
                200: {
                },
                201: {
                }
              }
            }
          }
        }
      };

      const failures = responsesCustomRule.validate(options, schema);

      assert.equal(failures.size, 0);
    });

    it('should report an error when a key is incorrect', () => {
      const schema = {
        paths: {
          '/pets': {
            get: {
              responses: {
                999: {
                }
              }
            }
          }
        }
      };

      const failures = responsesCustomRule.validate([options], schema);

      assert.equal(failures.size, 1);
      assert.equal(failures.get(0).get('location'), 'paths./pets.get.responses.999');
      assert.equal(failures.get(0).get('hint'), 'Expected responses $key:"999" to match "^(200|201)$"');
    });
  });
});
