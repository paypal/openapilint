# enforce all properties' keys conform to a specified input style (properties-style)

Validates that all properties' keys conform to a specified input style.

## Config

The config for this rule consists of:

* `case`: a string specifying the case style.  Choices are defined in the [common docs](../common.md).

## Example of *correct* usage given config `{"case": "snake"}`

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
                "awesome_parameter_key": {
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
                "another_awesome_parameter_key": {
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

## Examples of **incorrect** usage given config `{"case": "snake"}`

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
                "notAwesomeParameterKey": {
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
                "another-not-awesome_parameter_key": {
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
