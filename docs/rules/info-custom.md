# enforce info object complies with custom config constraints (properties-custom)

Validates that properties match their provided constraints. Constraints are provided in a simple format:

1. When `whenField` matches `whenPattern`,
2. Then `thenField` MUST match `thenPattern`.

This format works for almost any constraint.  `xField` is the name of the info object's field. `xPattern` is a properly escaped regex string. For more than one constraint, use an array of constraint options.

## Config A

Validates that info.description is present and non-empty.

```json
{
  "whenField": "$key",
  "whenPattern": ".*",
  "thenField": "description",
  "thenPattern": "[a-zA-Z]",
}
```

### Examples of *correct* usage with above config

```json
{
  "info": {
    "description": "The description"
  }
}
```

### Examples of *incorrect* usage with above config

```json
{
  "info": {
  }
}
```
