# enforce present and non-empty `produces` array (root-produces)

Validates that the `produces` array is present and non-empty.

## Examples of *correct* usage

```json
{
  "produces": [
    "application/json"
  ]
}
```

## Examples of **incorrect** usage

```json
{
  "produces": []
}
```

```json
{
}
```
