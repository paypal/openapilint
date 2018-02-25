# enforce required parameters do not have a default value (no-param-required-default)

Validates that required parameters do not have a `default` field, as defined in the [OpenAPI 2.0 spec](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md).

## Examples of *correct* usage

```json
{
  "paths": {
    "/first/{id}": {
      "get": {
        "parameters": [
          {
            "name": "id",
            "type": "string",
            "in": "path",
            "required": true
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
    "/first/{id}": {
      "get": {
        "parameters": [
          {
            "name": "id",
            "type": "string",
            "in": "path",
            "required": true,
            "default": "default_value"
          }
        ]
      }
    }
  }
}
```
