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

  it('should report errors when properties are incorrectly named', () => {
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
            ],
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
          },
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

    assert.equal(failures.size, 4);
    assert.equal(failures.get(0).get('location'), 'paths./pets.get.parameters[0].schema.properties.country');
    assert.equal(failures.get(0).get('hint'), 'country properties should be named country_code or end with _country_code');
    assert.equal(failures.get(1).get('location'), 'paths./pets.get.responses.200.schema.properties.country_code_blah_blah');
    assert.equal(failures.get(1).get('hint'), 'country properties should be named country_code or end with _country_code');
    assert.equal(failures.get(2).get('location'), 'paths./pets.put.parameters[0].schema.allOf[0].properties.my_country_tis_of_thee');
    assert.equal(failures.get(2).get('hint'), 'country properties should be named country_code or end with _country_code');
    assert.equal(failures.get(3).get('location'), 'paths./pets.put.parameters[0].schema.allOf[1].properties.country_specific_mega_code');
    assert.equal(failures.get(3).get('hint'), 'country properties should be named country_code or end with _country_code');
  });
});
