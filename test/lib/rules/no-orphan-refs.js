'use strict';

const assert = require('chai').assert;
const noOrphanRefsRule = require('../../../lib/rules/no-orphan-refs');

describe('no-orphan-refs', () => {
  const options = true;

  it('should not report errors when all refs are reachable', () => {
    const schema = {
      definitions: {
        Pet: {
        },
        Pets: {
          type: 'array',
          items: {
            $ref: '#/definitions/Pet'
          }
        }
      },
      paths: {
        '/pets': {
          get: {
            responses: {
              200: {
                schema: {
                  $ref: '#/definitions/Pets'
                }
              }
            }
          }
        }
      }
    };

    const failures = noOrphanRefsRule.validate(options, schema);

    assert.equal(failures.size, 0);
  });

  it('should not report errors when all refs are reachable with an implicit allOf', () => {
    const schema = {
      definitions: {
        Pet: {
        }
      },
      paths: {
        '/pets': {
          put: {
            parameters: [
              {
                schema: {
                  allOf: [
                    {
                      properties: {
                        related_resources: {
                          type: 'array',
                          items: {
                            $ref: '#/definitions/Pet'
                          }
                        }
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      }
    };

    const failures = noOrphanRefsRule.validate(options, schema);

    assert.equal(failures.size, 0);
  });

  it('should report an error when a definition ref is not reachable', () => {
    const schema = {
      definitions: {
        Pet: {
        },
        Pets: {
          type: 'array',
          items: {
            type: 'object'
          }
        }
      },
      paths: {
        '/pets': {
          get: {
            responses: {
              200: {
                schema: {
                  $ref: '#/definitions/Pets'
                }
              }
            }
          }
        }
      }
    };

    const failures = noOrphanRefsRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'definitions.Pet');
    assert.equal(failures.get(0).get('hint'), 'Definition is not reachable');
  });
});
