# enforce uri named properties include uri format (properties-format-uri)

Validates that any properties with name ending in `url` or `uri` include `{"format": "uri"}`.

## Examples of *correct* usage

```json
{
  "paths": {
    "/pets": {
      "get": {
        "parameters": [
          {
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

## Examples of **incorrect** usage

```json
{
  "paths": {
    "/pets": {
      "get": {
        "parameters": [
          {
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
