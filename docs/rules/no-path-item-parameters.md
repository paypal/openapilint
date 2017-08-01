# enforce not present path item parameters (no-path-item-parameters)

Validates that the optional path item parameters, at paths./mypath.parameters, is not present.

## Examples of *correct* usage

```json
{
  "paths": {
    "/pets": {
    }
  }
}
```

## Examples of **incorrect** usage
```json
{
  "paths": {
    "/pets": {
      "parameters": [
      ]
    }
  }
}
```
