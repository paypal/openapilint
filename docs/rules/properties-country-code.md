# enforce country properties are named `country_code` or end with `_country_code` (properties-country-code)

Validates that properties with the word `country` are named `country_code`, or end with `_country_code`.

## Examples of *correct* usage

```json
{
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
              "type": "object",
              "properties": {
                "country_code": {
                  "type": "string"
                }
              }
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
                  "discriminator": "petType",
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
              "type": "object",
              "properties": {
                "country_code_blah_blah": {
                  "type": "string"
                }
              }
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
                  "discriminator": "petType",
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
