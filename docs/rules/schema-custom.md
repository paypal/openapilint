# enforce schema objects comply with custom config constraints (schema-custom)

Validates that schema objects match their provided constraints. Constraints are provided in a simple format:

1. When `whenField` matches `whenPattern`,
2. Then `thenField` MUST match `thenPattern`.

This format works for almost any constraint.  `xField` is the name of the schema's field. `xPattern` is a properly escaped regex string. For more than one constraint, use an array of constraint options.

Since `allOf` objects can be handled specially, they are ignored by default. To enable them in a config, add the config `alsoApplyTo` with a list of items: `alsoApplyTo: [ "allOf" ]`.

## Config A

Validates that when schema objects have `type` = `object`, they must have a `title` property with at least one non-whitespace character.

```json
{
  "whenField": "type",
  "whenPattern": "object",
  "thenField": "title",
  "thenPattern": "^\\s",
  "alsoApplyTo": [
    "allOf" 
  ]
}

```

### Examples of *correct* usage with above config

```json
{
  "definitions": {
    "Pet": {
      "type": "object",
      "title": "Pet title",
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
              "title": "Body schema",
              "type": "object"
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
                  "title": "allOf object title"
                },
                {
                  "type": "object",
                  "title": "allOf 2 object title"
                },
                {
                  "type": "string"
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
              "type": "object"
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
                  "type": "object"
                },
                {
                  "type": "object"
                },
                {
                  "type": "string"
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

