# enforce non-empty `tags` array (root-tags)

Validates that the `tags` is present and non-empty.

## Examples of *correct* usage

```json
{
  "tags": [
    {
      "name": "pet"
    },
    {
      "name": "animal"
    }
  ]
}
```

## Examples of **incorrect** usage

```json
{
  "tags": []
}
```

```json
{
}
```
