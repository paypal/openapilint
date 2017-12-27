# enforce responses comply with custom config constraints (responses-custom)

Validates that responses match their provided constraints. Constraints are provided in a simple format:

1. When `whenField` matches `whenPattern`,
2. Then `thenField` MUST match `thenPattern`.

This format works for almost any constraint.  `xField` is the name of the response's field, or `$key` to indicate the response's key. `xPattern` is a properly escaped regex string. For more than one constraint, use an array of constraint options.

## Config A

Validates that all response keys are either `200` or `201`.

```json
{
  "whenField": "$key",
  "whenPattern": "\\.*",
  "thenField": "$key",
  "thenPattern": "^(200|201)$"
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
          "201": {
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
          "999": {
          }
        }
      }
    }
  }
}
```
