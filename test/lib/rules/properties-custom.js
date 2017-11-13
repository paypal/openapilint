'use strict';

const assert = require('chai').assert;
const propertiesCustomRule = require('../../../lib/rules/properties-custom');

describe('properties-custom', () => {
  describe('$key must be a country_code', () => {
    const options = {
      whenField: '$key',
      whenPattern: 'country',
      thenField: '$key',
      thenPattern: '^(?:.+_|)country_code$'
    };

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

      const failures = propertiesCustomRule.validate(options, schema);

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

      const failures = propertiesCustomRule.validate(options, schema);

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

      const failures = propertiesCustomRule.validate(options, schema);

      assert.equal(failures.size, 1);
      assert.equal(failures.get(0).get('location'), 'paths./pets.get.responses.200.schema.items.properties.my_country_tis_of_thee');
      assert.equal(failures.get(0).get('hint'), 'Expected property $key:"my_country_tis_of_thee" to match "^(?:.+_|)country_code$"');
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

      const failures = propertiesCustomRule.validate(options, schema);

      assert.equal(failures.size, 1);
      assert.equal(failures.get(0).get('location'), 'paths./pets.get.parameters[0].schema.properties.country');
      assert.equal(failures.get(0).get('hint'), 'Expected property $key:"country" to match "^(?:.+_|)country_code$"');
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

      const failures = propertiesCustomRule.validate(options, schema);

      assert.equal(failures.size, 1);
      assert.equal(failures.get(0).get('location'), 'paths./pets.get.responses.200.schema.properties.country_code_blah_blah');
      assert.equal(failures.get(0).get('hint'), 'Expected property $key:"country_code_blah_blah" to match "^(?:.+_|)country_code$"');
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

      const failures = propertiesCustomRule.validate(options, schema);

      assert.equal(failures.size, 2);
      assert.equal(failures.get(0).get('location'), 'paths./pets.put.parameters[0].schema.allOf[0].properties.my_country_tis_of_thee');
      assert.equal(failures.get(0).get('hint'), 'Expected property $key:"my_country_tis_of_thee" to match "^(?:.+_|)country_code$"');
      assert.equal(failures.get(1).get('location'), 'paths./pets.put.parameters[0].schema.allOf[1].properties.country_specific_mega_code');
      assert.equal(failures.get(1).get('hint'), 'Expected property $key:"country_specific_mega_code" to match "^(?:.+_|)country_code$"');
    });
  });

  describe('format must be uri', () => {
    const options = {
      whenField: '$key',
      whenPattern: 'ur[l|i]$',
      thenField: 'format',
      thenPattern: '^uri$'
    };

    it('should not report errors when uri properties are correct', () => {
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
                      service_uri: {
                        type: 'string',
                        format: 'uri'
                      },
                      profile_url: {
                        type: 'string',
                        format: 'uri'
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
                      my_return_url: {
                        type: 'string',
                        format: 'uri'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };

      const failures = propertiesCustomRule.validate(options, schema);

      assert.equal(failures.size, 0);
    });

    it('should report 3 errors when 3 uri types are incorrect', () => {
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
                      service_uri: {
                        type: 'string',
                        format: 'not-a-uri'
                      },
                      profile_url: {
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
                      my_return_url: {
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

      const failures = propertiesCustomRule.validate(options, schema);

      assert.equal(failures.size, 3);
      assert.equal(failures.get(0).get('location'), 'paths./pets.get.parameters[0].schema.properties.service_uri');
      assert.equal(failures.get(0).get('hint'), 'Expected property format:"not-a-uri" to match "^uri$"');
      assert.equal(failures.get(1).get('location'), 'paths./pets.get.parameters[0].schema.properties.profile_url');
      assert.equal(failures.get(1).get('hint'), 'Expected property format:"undefined" to match "^uri$"');
      assert.equal(failures.get(2).get('location'), 'paths./pets.get.responses.200.schema.properties.my_return_url');
      assert.equal(failures.get(2).get('hint'), 'Expected property format:"undefined" to match "^uri$"');
    });
  });
});
