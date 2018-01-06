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


  describe('x-publicDocsPath should be present and valid', () => {
    const options = {
      whenField: '$key',
      whenPattern: '.*',
      thenField: 'x-publicDocsPath',
      thenPattern: '^[a-zA-Z0-9-_.]+$'
    };

    it('should not report errors when x-publicDocsPath is present', () => {
      const schema = {
        info: {
          'x-publicDocsPath': 'myApiPath-includes-dashes'
        }
      };

      const failures = infoCustomRule.validate(options, schema);

      assert.equal(failures.size, 0);
    });

    it('should report error when x-publicDocsPath is not present', () => {
      const schema = {
        info: {
        }
      };

      const failures = infoCustomRule.validate(options, schema);

      assert.equal(failures.size, 1);

      assert.equal(failures.get(0).get('location'), 'info');
      assert.equal(failures.get(0).get('hint'), 'Expected info x-publicDocsPath to be present and to match "^[a-zA-Z0-9-_.]+$"');
    });

    it('should report error when x-publicDocsPath is not well formed', () => {
      const schema = {
        info: {
          'x-publicDocsPath': 'my invalid #path'
        }
      };

      const failures = infoCustomRule.validate(options, schema);

      assert.equal(failures.size, 1);
      assert.equal(failures.get(0).get('location'), 'info');
      assert.equal(failures.get(0).get('hint'), 'Expected info x-publicDocsPath:"my invalid #path" to match "^[a-zA-Z0-9-_.]+$"');
    });

    it('should not report error when x-publicDocsPath has a period', () => {
      const schema = {
        info: {
          'x-publicDocsPath': 'path.subpath'
        }
      };

      const failures = infoCustomRule.validate(options, schema);

      assert.equal(failures.size, 0);
    });
  });
});
