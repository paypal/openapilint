# enforce country properties are named `country_code` or end with `_country_code` (properties-country-code)

Validates that properties with the word `country` are named `country_code`, or end with `_country_code`.

## Examples of *correct* usage

```json
{
  "definitions": {
    "Pet": {
      "properties": {
        "country_code": {
          "type": "string"
        }
      }
    },
    "Pets": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Pet"
      }
    }
  },
  "paths": {
    "/pets": {
      "get": {
        "parameters": [
          {
            "in": "body",
            "schema": {
              "type": "object",
              "properties": {
                "super_special_country_code": {
                  "type": "string"
                }
              }
            }
          }
        ],
        "responses": {
          "200": {
            "schema": {
              "$ref": "#/definitions/Pets"
            }
          }
        }
      },
      "put": {
        "parameters": [
          {
            "in": "body",
            "schema": {
              "allOf": [
                {
                  "type": "object",
                  "properties": {
                    "foreign_pet_country_code": {
                      "type": "string"
                    }
                  }
                },
                {
                  "type": "object",
                  "properties": {
                    "moon_pet_country_code": {
                      "type": "string"
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
}
```

## Examples of **incorrect** usage

```json
{
  "definitions": {
    "Pet": {
      "properties": {
        "my_country": {
          "type": "string"
        }
      }
    },
    "Pets": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Pet"
      }
    }
  },
  "paths": {
    "/pets": {
      "get": {
        "parameters": [
          {
            "in": "body",
            "schema": {
              "type": "object",
              "properties": {
                "country": {
                  "type": "string"
                }
              }
            }
          }
        ],
        "responses": {
          "200": {
            "schema": {
              "$ref": "#/definitions/Pets"
            }
          }
        }
      },
      "put": {
        "parameters": [
          {
            "in": "body",
            "schema": {
              "allOf": [
                {
                  "type": "object",
                  "properties": {
                    "my_country_tis_of_thee": {
                      "type": "string"
                    }
                  }
                },
                {
                  "type": "object",
                  "properties": {
                    "country_specific_mega_code": {
                      "type": "string"
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
}
```
