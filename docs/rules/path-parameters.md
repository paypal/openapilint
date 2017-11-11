# enforce path parameter parity (path-parameters)

Validates that the sum of the parameters with {"location": "path"} matches the number of path template parameters in the URI.

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
            "in": "path"
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
            "in": "path"
          },
          {
            "name": "id",
            "type": "string",
            "in": "path"
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
            "in": "path"
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
            "in": "path"
          },
          {
            "name": "event_id",
            "type": "string",
            "in": "path"
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
          "id": "first.get"
        },
        "post": {
          "id": "first.create"
        }
    },
    "/second/{customer_id}/details": {
      "get": {
        "parameters": [
          {
            "name": "customer_id",
            "type": "string",
            "in": "path"
          },
          {
            "name": "event_id",
            "type": "string",
            "in": "path"
          }
        ]
      },
      "put": {
        "parameters": [
          {
            "name": "customer",
            "type": "string",
            "in": "path"
          },
          {
            "name": "event_id",
            "type": "string",
            "in": "path"
          }
        ]
      }
    }
  }
}
```
