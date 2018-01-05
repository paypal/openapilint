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

    it('should report 3 errors when does not start with capital letter', () => {
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

  describe('title, summary, and description all start with a letter', () => {
    const options = {
      applyTo: [
        'title',
        'summary',
        'description'
      ],
      matchPatternIgnoreCase: '^[A-Z]'
    };

    it('should not report errors when valid', () => {
      const schema = {
        info: {
          title: 'Good title with no leading spaces'
        },
        paths: {
          '/pets': {
            get: {
              summary: 'the correct case summary',
              parameters: [
                {
                  description: 'the correct case description'
                }
              ]
            }
          }
        }
      };

      const failures = textContentRule.validate(options, schema);

      assert.equal(failures.size, 0);
    });

    it('should report 1 error when there are spaces in front of a title', () => {
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
                  description: 'The upper case description'
                }
              ]
            }
          }
        }
      };

      const failures = textContentRule.validate(options, schema);

      assert.equal(failures.size, 1);
      assert.equal(failures.get(0).get('location'), 'info.title');
      assert.equal(failures.get(0).get('hint'), 'Expected "    Title with spaces" to match "^[A-Z]"');
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
        definitions: {
          Pet: {}
        },
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
              ],
              responses: {
                200: {
                  schema: {
                    $ref: '#/definitions/Pet'
                  }
                }
              }
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


  describe('descriptions should not have the word supersecret, any case', () => {
    const options = {
      applyTo: [
        'description'
      ],
      notMatchPatternIgnoreCase: 'supersecret'
    };

    it('should not report errors when valid', () => {
      const schema = {
        info: {
          description: 'Good description with no secret words'
        }
      };

      const failures = textContentRule.validate(options, schema);

      assert.equal(failures.size, 0);
    });

    it('should report errors when secret words are present', () => {
      const schema = {
        info: {
          description: 'Bad description with superSECRET word'
        }
      };

      const failures = textContentRule.validate(options, schema);

      assert.equal(failures.size, 1);
      assert.equal(failures.get(0).get('location'), 'info.description');
      assert.equal(failures.get(0).get('hint'), 'Expected "Bad description with superSECRET word" to not match "supersecret"');
    });
  });


  describe('title and description ref overrides all start with capital letters.', () => {
    const options = {
      applyTo: [
        'title-ref-override',
        'description-ref-override'
      ],
      matchPattern: '^[A-Z]'
    };

    it('should not report errors when valid', () => {
      const schema = {
        definitions: {
          Pet: {}
        },
        info: {
          title: 'should ignore this title'
        },
        paths: {
          '/pets': {
            get: {
              summary: 'should ignore this one too',
              parameters: [
                {
                  description: 'should ignore this one too'
                }
              ],
              responses: {
                200: {
                  schema: {
                    title: 'Good title in override',
                    description: 'Good description in override',
                    $ref: '#/definitions/Pet'
                  }
                }
              }
            }
          }
        }
      };

      const failures = textContentRule.validate(options, schema);

      assert.equal(failures.size, 0);
    });

    it('should report only 2 errors when punctuation is incorrect', () => {
      const schema = {
        definitions: {
          Pet: {}
        },
        info: {
          title: 'should ignore this title'
        },
        paths: {
          '/pets': {
            get: {
              summary: 'should ignore this one too',
              parameters: [
                {
                  description: 'should ignore this one too'
                }
              ],
              responses: {
                200: {
                  schema: {
                    title: 'bad title in override',
                    description: 'bad description in override',
                    $ref: '#/definitions/Pet'
                  }
                }
              }
            }
          }
        }
      };

      const failures = textContentRule.validate(options, schema);

      assert.equal(failures.size, 2);
      assert.equal(failures.get(0).get('location'), 'paths./pets.get.responses.200.schema.title#override');
      assert.equal(failures.get(0).get('hint'), 'Expected "bad title in override" to match "^[A-Z]"');
      assert.equal(failures.get(1).get('location'), 'paths./pets.get.responses.200.schema.description#override');
      assert.equal(failures.get(1).get('hint'), 'Expected "bad description in override" to match "^[A-Z]"');
    });
  });


  describe('no http: links', () => {
    const options = {
      applyTo: [
        'title'
      ],
      notMatchPattern: '\\(http:'
    };

    it('should not report errors when valid', () => {
      const schema = {
        info: {
          title: 'This is a good [link](https://example.com).'
        }
      };

      const failures = textContentRule.validate(options, schema);

      assert.equal(failures.size, 0);
    });

    it('should report only 2 errors when punctuation is incorrect', () => {
      const schema = {
        info: {
          title: 'This is not a good [link](http://example.com).'
        }
      };

      const failures = textContentRule.validate(options, schema);

      assert.equal(failures.size, 1);
      assert.equal(failures.get(0).get('location'), 'info.title');
      assert.equal(failures.get(0).get('hint'), 'Expected "This is not a good [link](http://example.com)." to not match "\\(http:"');
    });
  });
});
