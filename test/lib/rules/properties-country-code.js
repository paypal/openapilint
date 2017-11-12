'use strict';

const assert = require('chai').assert;
const propertiesCountryCodeRule = require('../../../lib/rules/properties-country-code');

describe('properties-country-code', () => {
  const options = true;

  it('should not report errors when country_code properties are correct', () => {
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

    const failures = propertiesCountryCodeRule.validate(options, schema);

    assert.equal(failures.size, 0);
  });

  it('should not report errors when country_code properties defined in refs are correct', () => {
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

    const failures = propertiesCountryCodeRule.validate(options, schema);

    assert.equal(failures.size, 0);
  });


  it('should report an error when a country_code property defined in refs are incorrect', () => {
    const schema = {
      definitions: {
        Pet: {
          type: 'object',
          properties: {
            my_country_tis_of_thee: {
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

    const failures = propertiesCountryCodeRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets.get.responses.200.schema.items.properties.my_country_tis_of_thee');
    assert.equal(failures.get(0).get('hint'), 'Found country property not named country_code or ending with _country_code');
  });

  it('should report errors when a parameter property is incorrectly named', () => {
    const schema = {
      paths: {
        '/pets': {
          get: {
            parameters: [
              {
                schema: {
                  type: 'object',
                  properties: {
                    country: {
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

    const failures = propertiesCountryCodeRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets.get.parameters[0].schema.properties.country');
    assert.equal(failures.get(0).get('hint'), 'Found country property not named country_code or ending with _country_code');
  });

  it('should report errors when a response property is incorrectly named', () => {
    const schema = {
      paths: {
        '/pets': {
          get: {
            responses: {
              200: {
                schema: {
                  type: 'object',
                  properties: {
                    country_code_blah_blah: {
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

    const failures = propertiesCountryCodeRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets.get.responses.200.schema.properties.country_code_blah_blah');
    assert.equal(failures.get(0).get('hint'), 'Found country property not named country_code or ending with _country_code');
  });

  it('should report two errors when two allOf parameters property are incorrectly named', () => {
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
                        my_country_tis_of_thee: {
                          type: 'string'
                        }
                      }
                    },
                    {
                      type: 'object',
                      properties: {
                        country_specific_mega_code: {
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

    const failures = propertiesCountryCodeRule.validate(options, schema);

    assert.equal(failures.size, 2);
    assert.equal(failures.get(0).get('location'), 'paths./pets.put.parameters[0].schema.allOf[0].properties.my_country_tis_of_thee');
    assert.equal(failures.get(0).get('hint'), 'Found country property not named country_code or ending with _country_code');
    assert.equal(failures.get(1).get('location'), 'paths./pets.put.parameters[0].schema.allOf[1].properties.country_specific_mega_code');
    assert.equal(failures.get(1).get('hint'), 'Found country property not named country_code or ending with _country_code');
  });
});
