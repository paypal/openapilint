'use strict';

const assert = require('chai').assert;
const parametersCustomRule = require('../../../lib/rules/parameters-custom');

describe('parameters-custom', () => {
  describe('PayPal-Request-Id parameters must have a good description', () => {
    const options = {
      whenField: 'name',
      whenPattern: '^PayPal-Request-Id$',
      thenField: 'description',
      thenPattern: 'server stores keys for \\d+ [days|hours]'
    };

    it('should not report errors when PayPal-Request-Id parameter is correct', () => {
      const schema = {
        paths: {
          '/pets': {
            get: {
              parameters: [
                {
                  name: 'PayPal-Request-Id',
                  in: 'header',
                  type: 'string',
                  description: 'The server stores keys for 24 hours.',
                  required: false
                }
              ]
            }
          }
        }
      };

      const failures = parametersCustomRule.validate(options, schema);

      assert.equal(failures.size, 0);
    });


    it('should report an error when the description does not match pattern', () => {
      const schema = {
        paths: {
          '/pets': {
            get: {
              parameters: [
                {
                  name: 'PayPal-Request-Id',
                  in: 'header',
                  type: 'string',
                  description: 'This header description is not awesome.',
                  required: false
                }
              ]
            }
          }
        }
      };

      const failures = parametersCustomRule.validate([options], schema);

      assert.equal(failures.size, 1);
      assert.equal(failures.get(0).get('location'), 'paths./pets.get.parameters[0]');
      assert.equal(failures.get(0).get('hint'), 'Expected parameter description:"This header description is not awesome." to match "server stores keys for \\d+ [days|hours]"');
    });
  });
});
