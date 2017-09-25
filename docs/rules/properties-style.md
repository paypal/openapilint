# enforce all properties' keys are `snake_case` style (properties-style)

Validates that all properties' keys are `snake_case` style.

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
