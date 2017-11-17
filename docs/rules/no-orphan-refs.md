# enforce all refs are reachable (no-orphan-refs)

Validates that all `$ref`s are reachable. 

## Example of *correct* usage

```json
{
  "definitions": {
    "Pet": {
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
        "responses": {
          "200": {
            "schema": {
              "$ref": "#/definitions/Pets"
            }
          }
        }
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
    },
    "Pets": {
      "type": "array",
      "items": {
        "type": "object"
      }
    }
  },
  "paths": {
    "/pets": {
      "get": {
        "responses": {
          "200": {
            "schema": {
              "$ref": "#/definitions/Pets"
            }
          }
        }
      }
    }
  }
}
```
