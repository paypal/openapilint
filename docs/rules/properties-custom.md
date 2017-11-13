# enforce properties comply with custom config constraints (properties-custom)

Validates that properties match their provided constraints. Constraints are provided in a simple format:

1. When `whenField` matches `whenRegex`,
2. Then `thenField` MUST match `thenRegex`.

This format works for almost any constraint.  `xField` is the name of the property's field, or `$key` to indicate the property's key. `xRegex` is a properly escaped regex string.

## Config A

Validates that properties with the word `country` are named `country_code`, or end with `_country_code`.

```json
{
  "whenField": "$key",
  "whenRegex": "country",
  "thenField": "$key",
  "thenRegex": "^(?:.+_|)country_code$"
}

```

### Examples of *correct* usage with above config

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

### Examples of *incorrect* usage with above config

```json
{
  "definitions": {
    "Pet": {
      "type": "object",
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


## Config B

Validates that any properties ending in `url` or `uri` include `{"format": "uri"}`.

```json
{
  "whenField": "$key",
  "whenPattern": "ur[l|i]$",
  "thenField": "format",
  "thenPattern": "^uri$"
}

```


### Examples of *correct* usage with above config

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
                "service_uri": {
                  "type": "string",
                  "format": "uri"
                },
                "profile_url": {
                  "type": "string",
                  "format": "uri"
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
                "my_return_url": {
                  "type": "string",
                  "format": "uri"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### Examples of **incorrect** usage with above config

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
                "service_uri": {
                  "type": "string"
                },
                "profile_url": {
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
                "my_return_url": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    }
  }
}
```
