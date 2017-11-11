# enforce path parameter parity (path-parameters)

Validates that the sum of the parameters with {"location": "path"} matches the number of path template parameters in the URI, and that required='true'.  See the [spec](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#fixed-fields-7) for the full description.

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
    },
    "/first/{first_id}/second/{id}": {
      "get": {
        "parameters": [
          {
            "name": "first_id",
            "type": "string",
            "in": "path",
            "required": true
          },
          {
            "name": "id",
            "type": "string",
            "in": "path",
            "required": true
          }
        ]
      }
    },
    "/second/{customer_id}/details": {
      "get": {
        "parameters": [
          {
            "name": "customer_id",
            "type": "string",
            "in": "path",
            "required": true
          },
          {
            "name": "merchant_id",
            "type": "string",
            "in": "query"
          }
        ]
      }
    },
    "/second/{customer_id}/{event_id}/details": {
      "get": {
        "parameters": [
          {
            "name": "customer_id",
            "type": "string",
            "in": "path",
            "required": true
          },
          {
            "name": "event_id",
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
      "get": {},
      "post": {}
    },
    "/second/{customer_id}/details": {
      "get": {
        "parameters": [
          {
            "name": "customer_id",
            "type": "string",
            "in": "path",
            "required": true
          },
          {
            "name": "extra_path_id",
            "type": "string",
            "in": "path",
            "required": true
          }
        ]
      },
      "put": {
        "parameters": [
          {
            "name": "customer",
            "type": "string",
            "in": "path",
            "required": true
          },
          {
            "name": "extra_path_id",
            "type": "string",
            "in": "path",
            "required": true
          }
        ]
      }
    },
    "/missing_required/{customer_id}": {
      "get": {
        "parameters": [
          {
            "name": "customer_id",
            "type": "string",
            "in": "path"
          }
        ]
      }
    },
  }
}
```
