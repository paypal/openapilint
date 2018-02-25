# enforce schema objects do not set readOnly to the default value, false (no-schema-default-read-only)

Validates that schema objects do not set readOnly to false. This is the default value, and is therefore is not necessary.

## Examples of *correct* usage

```json
{
  "definitions": {
    "Pet": {
      "type": "object",
      "title": "Pet title",
      "properties": {
        "country_code": {
          "type": "string",
          "readOnly": true
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

## Examples of **incorrect** usage
```json
{
  "definitions": {
    "Pet": {
      "type": "object",
      "title": "Pet title",
      "properties": {
        "country_code": {
          "type": "string",
          "readOnly": false
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

