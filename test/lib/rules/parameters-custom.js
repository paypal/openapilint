'use strict';

const assert = require('chai').assert;
const parametersCustomRule = require('../../../lib/rules/parameters-custom');

describe('parameters-custom', () => {
  describe('PayPal-Request-Id parameters must have a good description', () => {
    const options = {
      whenField: 'name',
      whenPattern: '^PayPal-Request-Id$',
      thenField: 'description',
      thenPattern: '^(The server stores keys ((for \\d+ (day(s)?|hour(s)?))|forever))|((When .*, the server .*){2,})\\.$'
    };

    it('should not report errors when PayPal-Request-Id parameter is correct', () => {
      const schema = {
        paths: {
          '/pets': {
            post: {
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
          },
          '/wild-animals': {
            post: {
              parameters: [
                {
                  name: 'PayPal-Request-Id',
                  in: 'header',
                  type: 'string',
                  description: 'The server stores keys forever.',
                  required: false
                }
              ]
            }
          },
          '/rabid-creatures': {
            post: {
              parameters: [
                {
                  name: 'PayPal-Request-Id',
                  in: 'header',
                  type: 'string',
                  description: 'The server stores keys for 30 days.',
                  required: false
                }
              ]
            }
          },
          '/krazy-kats': {
            post: {
              parameters: [
                {
                  name: 'PayPal-Request-Id',
                  in: 'header',
                  type: 'string',
                  description: 'When intent=action, the server stores keys for 5 days. When intent=badaction, the server ignores this header.',
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
      assert.equal(failures.get(0).get('hint'), 'Expected parameter description:"This header description is not awesome." to match "^(The server stores keys ((for \\d+ (day(s)?|hour(s)?))|forever))|((When .*, the server .*){2,})\\.$"');
    });
  });

  describe('PayPal-Request-Id parameters must be capitalized correctly', () => {
    const options = {
      whenField: 'name',
      whenPatternIgnoreCase: '^PayPal-Request-Id$',
      thenField: 'name',
      thenPattern: '^PayPal-Request-Id$'
    };

    it('should not report errors when PayPal-Request-Id parameter is correct', () => {
      const schema = {
        paths: {
          '/pets': {
            get: {
              parameters: [
                {
                  name: 'PayPal-Request-Id'
                }
              ]
            }
          }
        }
      };

      const failures = parametersCustomRule.validate(options, schema);

      assert.equal(failures.size, 0);
    });

    it('should report an error when the case is incorrect', () => {
      const schema = {
        paths: {
          '/pets': {
            get: {
              parameters: [
                {
                  name: 'PAYPAL-REQUEST-ID'
                }
              ]
            }
          }
        }
      };

      const failures = parametersCustomRule.validate([options], schema);

      assert.equal(failures.size, 1);
      assert.equal(failures.get(0).get('location'), 'paths./pets.get.parameters[0]');
      assert.equal(failures.get(0).get('hint'), 'Expected parameter name:"PAYPAL-REQUEST-ID" to match "^PayPal-Request-Id$"');
    });
  });

  describe('bad config', () => {
    it('should throw an error with empty config', () => {
      const badConfigRuleFunction = () => {
        const schema = {};

        parametersCustomRule.validate({}, schema);
      };

      assert.throws(badConfigRuleFunction, Error, 'Invalid option specified: {}');
    });

    it('should throw an error missing option fields', () => {
      const badConfigRuleFunction = () => {
        const schema = {};
        const options = {
          whenField: 'name'
        };

        parametersCustomRule.validate(options, schema);
      };

      assert.throws(badConfigRuleFunction, Error, 'Invalid option specified: {"whenField":"name"}');
    });

    it('should throw an error when a pattern and patternIgnoreCase is provided', () => {
      const badConfigRuleFunction = () => {
        const schema = {};
        const options = {
          whenField: 'name',
          whenPattern: 'X',
          whenPatternIgnoreCase: 'X',
          thenField: 'description',
          thenPattern: 'X'
        };

        parametersCustomRule.validate(options, schema);
      };

      assert.throws(badConfigRuleFunction, Error, 'Invalid option specified: {"whenField":"name","whenPattern":"X","whenPatternIgnoreCase":"X","thenField":"description","thenPattern":"X"}');
    });
  });
});
