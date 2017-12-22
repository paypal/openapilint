# enforce operation response codes comply with custom key constraints (operation-response-codes)

Validates that operations of a specific http method match custom response code constraints. Constraints are provided in a simple format:

1. When `whenHttpMethod` matches the operation's http method,
2. Then the response key MUST match the `thenResponseCodePattern`.

`whenHttpMethod` is the name of the operation's http method, such as `put`, `post`, or `get`. `thenResponseCodePattern` is a properly escaped regex string. For more than one constraint, use an array of constraint options.

## Config A

Validates that `get` methods only emit `200` or `default` response keys.

```json
{
  "whenHttpMethod": "get",
  "thenResponseCodePattern": "(200|default)"
}
```

### Examples of *correct* usage with above config

```json
{
  "paths": {
    "/pets": {
      "get": {
        "responses": {
          "200": {
          },
          "default": {
          }
        }
      }
    }
  }
}
```

### Examples of *incorrect* usage with above config

```json
{
  "paths": {
    "/pets": {
      "get": {
        "responses": {
          "204": {
          }
        }
      }
    }
  }
}
```
