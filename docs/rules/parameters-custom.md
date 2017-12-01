# enforce parameters comply with custom config constraints (parameters-custom)

Validates that parameters match their provided constraints. Constraints are provided in a simple format:

1. When `whenField` matches `whenPattern`,
2. Then `thenField` MUST match `thenPattern`.

This format works for almost any constraint.  `xField` is the name of the parameter's field. `xPattern` is a properly escaped regex string. For more than one constraint, use an array of constraint options.

## Config A

Validates that `PayPal-Request-Id` parameters have a `description` that matches `server stores keys for \\d+ [days|hours]`.

```json
{
  "whenField": "name",
  "whenPattern": "^PayPal-Request-Id$",
  "thenField": "description",
  "thenPattern": "server stores keys for \\d+ [days|hours]"
}

```

### Examples of *correct* usage with above config

```json
{
  "paths": {
    "/pets": {
      "get": {
        "parameters": [
          {
            "name": "PayPal-Request-Id",
            "in": "header",
            "type": "string",
            "description": "The server stores keys for 24 hours.",
            "required": false
          }
        ]
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
        "parameters": [
          {
            "name": "PayPal-Request-Id",
            "in": "header",
            "type": "string",
            "description": "This header description is not awesome.",
            "required": false
          }
        ]
      }
    }
  }
}
```

