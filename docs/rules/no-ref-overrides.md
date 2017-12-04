# enforce no refs have overrides (no-ref-overrides)

Some projects decide to support overriding a `$ref`'s value. This isn't supported in OpenAPI, as mentioned in [this OpenAPI specification issue](https://github.com/OAI/OpenAPI-Specification/issues/556).

This rule validates that there are no properties specified in the same object as a `$ref`, except those allowed by the configuration.

## Example of *correct* usage given the config: `{"allowProperties": ["description"]}`

```json
{
  "definitions": {
    "Pet": {}
  },
  "paths": {
    "/pets/{id}": {
      "get": {
        "responses": {
          "200": {
            "schema": {
              "description": "A description override.",
              "$ref": "#/definitions/Pet"
            }
          }
        }
      }
    }
  }
}
```

## Example of **incorrect** usage

```json
{
  "definitions": {
    "Pet": {}
  },
  "paths": {
    "/pets/{id}": {
      "get": {
        "responses": {
          "200": {
            "schema": {
              "type": "object",
              "description": "A description override.",
              "$ref": "#/definitions/Pet"
            }
          }
        }
      }
    }
  }
}
```
