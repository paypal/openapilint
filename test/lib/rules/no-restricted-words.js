'use strict';

const assert = require('chai').assert;
const noRestrictedWordsRule = require('../../../lib/rules/no-restricted-words');

describe('no-restricted-words', () => {
  const options = { words: ['blah-blah', 'RESTRICTED'] };

  it('should not report errors when not enabled', () => {
    const schema = {};

    const failures = noRestrictedWordsRule.validate(false, schema);

    assert.equal(failures.size, 0);
  });

  it('should not report errors when schema is perfect', () => {
    const schema = {
      info: {
        title: 'Sample title',
        description: 'Sample description'
      },
      paths: {
        '/pets': {
          get: {
            description: 'Sample operation description',
            parameters: [
              {
                name: 'limit',
                description: 'maximum number of results to return'
              }
            ],
            responses: {
              200: {
                description: 'sample response'
              }
            }
          }
        }
      }
    };

    const failures = noRestrictedWordsRule.validate(options, schema);

    assert.equal(failures.size, 0);
  });

  it('should report lots of errors when schema has a few restricted words', () => {
    const schema = {
      info: {
        title: 'restricted blah-blah',
        description: 'restricted'
      },
      paths: {
        '/pets': {
          get: {
            description: 'restricted',
            summary: 'restricted',
            parameters: [
              {
                name: 'limit',
                description: 'restricted'
              }
            ],
            responses: {
              200: {
                description: 'restricted'
              }
            }
          }
        },
        '/people': {
          get: {
            description: 'restricted',
            summary: 'restricted',
            parameters: [
              {
                name: 'limit',
                description: 'restricted'
              }
            ],
            responses: {
              200: {
                description: 'restricted'
              }
            }
          }
        }
      }
    };

    const failures = noRestrictedWordsRule.validate(options, schema);

    assert.equal(failures.size, 11);

    assert.equal(failures.get(0).get('location'), 'info.title');
    assert.equal(failures.get(0).get('hint'), 'Found \'restricted blah-blah\'');
    assert.equal(failures.get(1).get('location'), 'info.title');
    assert.equal(failures.get(1).get('hint'), 'Found \'restricted blah-blah\'');
    assert.equal(failures.get(2).get('location'), 'info.description');
    assert.equal(failures.get(2).get('hint'), 'Found \'restricted\'');
    assert.equal(failures.get(3).get('location'), 'paths./pets.get.description');
    assert.equal(failures.get(3).get('hint'), 'Found \'restricted\'');
    assert.equal(failures.get(4).get('location'), 'paths./pets.get.summary');
    assert.equal(failures.get(4).get('hint'), 'Found \'restricted\'');
    assert.equal(failures.get(5).get('location'), 'paths./pets.get.parameters[0].description');
    assert.equal(failures.get(5).get('hint'), 'Found \'restricted\'');
    assert.equal(failures.get(6).get('location'), 'paths./pets.get.responses.200.description');
    assert.equal(failures.get(6).get('hint'), 'Found \'restricted\'');
  });

  it('should report error when info.title has restricted words', () => {
    const schema = {
      info: {
        title: 'restricted'
      }
    };

    const failures = noRestrictedWordsRule.validate(options, schema);

    assert.equal(failures.size, 1);

    assert.equal(failures.get(0).get('location'), 'info.title');
    assert.equal(failures.get(0).get('hint'), 'Found \'restricted\'');
  });

  it('should report error when info.description has restricted words', () => {
    const schema = {
      info: {
        description: 'restricted'
      }
    };

    const failures = noRestrictedWordsRule.validate(options, schema);

    assert.equal(failures.size, 1);

    assert.equal(failures.get(0).get('location'), 'info.description');
    assert.equal(failures.get(0).get('hint'), 'Found \'restricted\'');
  });

  it('should report error when an operation summary has restricted words', () => {
    const schema = {
      paths: {
        '/pets': {
          get: {
            summary: 'restricted'
          }
        }
      }
    };

    const failures = noRestrictedWordsRule.validate(options, schema);

    assert.equal(failures.size, 1);

    assert.equal(failures.get(0).get('location'), 'paths./pets.get.summary');
    assert.equal(failures.get(0).get('hint'), 'Found \'restricted\'');
  });

  it('should report error when an operation description has restricted words', () => {
    const schema = {
      paths: {
        '/pets': {
          get: {
            description: 'restricted'
          }
        }
      }
    };

    const failures = noRestrictedWordsRule.validate(options, schema);

    assert.equal(failures.size, 1);

    assert.equal(failures.get(0).get('location'), 'paths./pets.get.description');
    assert.equal(failures.get(0).get('hint'), 'Found \'restricted\'');
  });

  it('should report error when a parameter description has restricted words', () => {
    const schema = {
      paths: {
        '/pets': {
          get: {
            parameters: [
              {
                description: 'restricted'
              }
            ]
          }
        }
      }
    };

    const failures = noRestrictedWordsRule.validate(options, schema);

    assert.equal(failures.size, 1);

    assert.equal(failures.get(0).get('location'), 'paths./pets.get.parameters[0].description');
    assert.equal(failures.get(0).get('hint'), 'Found \'restricted\'');
  });

  it('should report error when a response description has restricted words', () => {
    const schema = {
      paths: {
        '/pets': {
          get: {
            responses: {
              200: {
                description: 'restricted'
              }
            }
          }
        }
      }
    };

    const failures = noRestrictedWordsRule.validate(options, schema);

    assert.equal(failures.size, 1);

    assert.equal(failures.get(0).get('location'), 'paths./pets.get.responses.200.description');
    assert.equal(failures.get(0).get('hint'), 'Found \'restricted\'');
  });

  it('should report error when a schema object description has restricted words', () => {
    const schema = {
      paths: {
        '/pets': {
          get: {
            responses: {
              200: {
                schema: {
                  description: 'restricted'
                }
              }
            }
          }
        }
      }
    };

    const failures = noRestrictedWordsRule.validate(options, schema);

    assert.equal(failures.size, 1);

    assert.equal(failures.get(0).get('location'), 'paths./pets.get.responses.200.schema.description');
    assert.equal(failures.get(0).get('hint'), 'Found \'restricted\'');
  });


  it('should report error when a schema items description has restricted words', () => {
    const schema = {
      paths: {
        '/pets': {
          get: {
            responses: {
              200: {
                schema: {
                  type: 'array',
                  items: {
                    description: 'restricted'
                  }
                }
              }
            }
          }
        }
      }
    };

    const failures = noRestrictedWordsRule.validate(options, schema);

    assert.equal(failures.size, 1);

    assert.equal(failures.get(0).get('location'), 'paths./pets.get.responses.200.schema.items.description');
    assert.equal(failures.get(0).get('hint'), 'Found \'restricted\'');
  });

  it('should report error when a schema property description has restricted words', () => {
    const schema = {
      paths: {
        '/pets': {
          get: {
            responses: {
              200: {
                schema: {
                  type: 'object',
                  properties: {
                    petType: {
                      description: 'restricted'
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    const failures = noRestrictedWordsRule.validate(options, schema);

    assert.equal(failures.size, 1);

    assert.equal(failures.get(0).get('location'), 'paths./pets.get.responses.200.schema.properties.petType.description');
    assert.equal(failures.get(0).get('hint'), 'Found \'restricted\'');
  });


  it('should report error when a body request property description has restricted words', () => {
    const schema = {
      paths: {
        '/pets': {
          get: {
            parameters: [
              {
                in: 'body',
                schema: {
                  type: 'object',
                  properties: {
                    petType: {
                      description: 'restricted'
                    }
                  }
                }
              }
            ]
          }
        }
      }
    };

    const failures = noRestrictedWordsRule.validate(options, schema);

    assert.equal(failures.size, 1);

    assert.equal(failures.get(0).get('location'), 'paths./pets.get.parameters[0].schema.properties.petType.description');
    assert.equal(failures.get(0).get('hint'), 'Found \'restricted\'');
  });
});
