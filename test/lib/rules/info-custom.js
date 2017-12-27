'use strict';

const assert = require('chai').assert;
const infoCustomRule = require('../../../lib/rules/info-custom');

describe('info-custom', () => {
  describe('description must be present', () => {
    const options = {
      whenField: '$key',
      whenPattern: '.*',
      thenField: 'description',
      thenPattern: '[a-zA-Z]'
    };

    it('should not report errors when description is present', () => {
      const schema = {
        info: {
          description: 'The description'
        }
      };

      const failures = infoCustomRule.validate(options, schema);

      assert.equal(failures.size, 0);
    });

    it('should report error when description is not present', () => {
      const schema = {
        info: {
        }
      };

      const failures = infoCustomRule.validate([options], schema);

      assert.equal(failures.size, 1);
      assert.equal(failures.get(0).get('location'), 'info');
      assert.equal(failures.get(0).get('hint'), 'Expected info description to be present and to match "[a-zA-Z]"');
    });
  });
});
