'use strict';

const assert = require('chai').assert;
const textContentRule = require('../../../lib/rules/text-content');

describe('text-content', () => {
  describe('title, summary, and description all start with a capital letter', () => {
    const options = {
      applyTo: [
        'title',
        'summary',
        'description'
      ],
      matchPattern: '^[A-Z]'
    };

    it('should not report errors when valid', () => {
      const schema = {
        info: {
          title: 'Good title with no leading spaces'
        },
        paths: {
          '/pets': {
            get: {
              summary: 'The correct case summary',
              parameters: [
                {
                  description: 'The correct case description'
                }
              ]
            }
          }
        }
      };

      const failures = textContentRule.validate(options, schema);

      assert.equal(failures.size, 0);
    });

    it('should report errors when titles are not present', () => {
      const schema = {
        info: {
          title: '    Title with spaces'
        },
        paths: {
          '/pets': {
            get: {
              summary: 'the lower case summary',
              parameters: [
                {
                  description: 'the lower case description'
                }
              ]
            }
          }
        }
      };

      const failures = textContentRule.validate(options, schema);

      assert.equal(failures.size, 3);
      assert.equal(failures.get(0).get('location'), 'info.title');
      assert.equal(failures.get(0).get('hint'), 'Expected "    Title with spaces" to match "^[A-Z]"');
      assert.equal(failures.get(1).get('location'), 'paths./pets.get.summary');
      assert.equal(failures.get(1).get('hint'), 'Expected "the lower case summary" to match "^[A-Z]"');
      assert.equal(failures.get(2).get('location'), 'paths./pets.get.parameters[0].description');
      assert.equal(failures.get(2).get('hint'), 'Expected "the lower case description" to match "^[A-Z]"');
    });
  });

  describe('summary and description all end with a period (`.`).', () => {
    const options = {
      applyTo: [
        'summary',
        'description'
      ],
      matchPattern: '\\.$'
    };

    it('should not report errors when valid', () => {
      const schema = {
        info: {
          title: 'Should ignore this title'
        },
        paths: {
          '/pets': {
            get: {
              summary: 'The correct punctuated summary.',
              parameters: [
                {
                  description: 'The correct punctuated description.'
                }
              ]
            }
          }
        }
      };

      const failures = textContentRule.validate(options, schema);

      assert.equal(failures.size, 0);
    });

    it('should report only 2 errors when punctuation is incorrect', () => {
      const schema = {
        paths: {
          '/pets': {
            get: {
              summary: 'The incorrect summary without punctuation',
              parameters: [
                {
                  description: 'The incorrect description with trailing spaces.   '
                }
              ],
              responses: {
                200: {
                  schema: {
                    title: 'Any issue with titles should be ignored'
                  }
                }
              }
            }
          }
        }
      };

      const failures = textContentRule.validate(options, schema);

      assert.equal(failures.size, 2);
      assert.equal(failures.get(0).get('location'), 'paths./pets.get.summary');
      assert.equal(failures.get(0).get('hint'), 'Expected "The incorrect summary without punctuation" to match "\\.$"');
      assert.equal(failures.get(1).get('location'), 'paths./pets.get.parameters[0].description');
      assert.equal(failures.get(1).get('hint'), 'Expected "The incorrect description with trailing spaces.   " to match "\\.$"');
    });
  });
});
