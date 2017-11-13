'use strict';

const assert = require('chai').assert;
const propertiesStyleRule = require('../../../lib/rules/properties-style');

describe('properties-style', () => {
  const snakeCaseOptions = { case: 'snake' };

  it('should not report errors when the properties match the snake case', () => {
    const schema = {
      paths: {
        '/pets': {
          get: {
            parameters: [
              {
                schema: {
                  type: 'object',
                  properties: {
                    super_special_country_code: {
                      type: 'string'
                    }
                  }
                }
              }
            ],
            responses: {
              200: {
                schema: {
                  type: 'object',
                  properties: {
                    country_code: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          },
          put: {
            parameters: [
              {
                schema: {
                  allOf: [
                    {
                      type: 'object',
                      properties: {
                        foreign_pet_country_code: {
                          type: 'string'
                        }
                      }
                    },
                    {
                      type: 'object',
                      properties: {
                        moon_pet_country_code: {
                          type: 'string'
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

    const failures = propertiesStyleRule.validate(snakeCaseOptions, schema);

    assert.equal(failures.size, 0);
  });

  it('should not report errors when properties defined in refs are snake case', () => {
    const schema = {
      definitions: {
        Pet: {
          type: 'object',
          properties: {
            country_code: {
              type: 'string'
            },
            circular_ref: {
              $ref: '#/definitions/Pets'
            }
          }
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

    const failures = propertiesStyleRule.validate(snakeCaseOptions, schema);

    assert.equal(failures.size, 0);
  });


  it('should report an error when a property defined in refs does not match snake case', () => {
    const schema = {
      definitions: {
        Pet: {
          type: 'object',
          properties: {
            MY_COUNTRY: {
              type: 'string'
            }
          }
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

    const failures = propertiesStyleRule.validate(snakeCaseOptions, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets.get.responses.200.schema.items.properties.MY_COUNTRY');
    assert.equal(failures.get(0).get('hint'), '"MY_COUNTRY" does not comply with case: "snake"');
  });

  it('should report errors when a parameter property does not match snake case', () => {
    const schema = {
      paths: {
        '/pets': {
          get: {
            parameters: [
              {
                schema: {
                  type: 'object',
                  properties: {
                    'NOT-SNAKE': {
                      type: 'string'
                    }
                  }
                }
              }
            ]
          }
        }
      }
    };

    const failures = propertiesStyleRule.validate(snakeCaseOptions, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets.get.parameters[0].schema.properties.NOT-SNAKE');
    assert.equal(failures.get(0).get('hint'), '"NOT-SNAKE" does not comply with case: "snake"');
  });

  it('should report an error when a response property is snot snake case', () => {
    const schema = {
      paths: {
        '/pets': {
          get: {
            responses: {
              200: {
                schema: {
                  type: 'object',
                  properties: {
                    country_code_blah_BLAH: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    const failures = propertiesStyleRule.validate(snakeCaseOptions, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets.get.responses.200.schema.properties.country_code_blah_BLAH');
    assert.equal(failures.get(0).get('hint'), '"country_code_blah_BLAH" does not comply with case: "snake"');
  });

  it('should report two errors when two allOf parameters property are not snake case', () => {
    const schema = {
      paths: {
        '/pets': {
          put: {
            parameters: [
              {
                schema: {
                  allOf: [
                    {
                      type: 'object',
                      properties: {
                        'NOT-SNAKE': {
                          type: 'string'
                        }
                      }
                    },
                    {
                      type: 'object',
                      properties: {
                        'NOT-SNAKE_2': {
                          type: 'string'
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

    const failures = propertiesStyleRule.validate(snakeCaseOptions, schema);

    assert.equal(failures.size, 2);
    assert.equal(failures.get(0).get('location'), 'paths./pets.put.parameters[0].schema.allOf[0].properties.NOT-SNAKE');
    assert.equal(failures.get(0).get('hint'), '"NOT-SNAKE" does not comply with case: "snake"');
    assert.equal(failures.get(1).get('location'), 'paths./pets.put.parameters[0].schema.allOf[1].properties.NOT-SNAKE_2');
    assert.equal(failures.get(1).get('hint'), '"NOT-SNAKE_2" does not comply with case: "snake"');
  });
});
