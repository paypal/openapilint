# enforce operation objects comply with custom config constraints (operation-custom)

Validates that operation objects match their provided constraints. Constraints are provided in a simple format:

1. When `whenField` matches `whenPattern`,
2. Then `thenField` MUST match `thenPattern`.

This format works for almost any constraint.  `xField` is the name of the operation's field, or `$key` to indicate the operation's key. `xPattern` is a properly escaped regex string. For more than one constraint, use an array of constraint options.

## Config A

Validates that any operation object must have a summary.

```json
{
  "whenField": "$key",
  "whenPattern": ".*",
  "thenField": "summary",
  "thenPattern": "[a-zA-Z]",
}

```

### Examples of *correct* usage with above config

```json
{
  "paths": {
    "/pets": {
      "get": {
        "summary": "The get pets summary",
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
      }
    }
  }
}
```
