# enforce non-empty `tags` array (root-tags)

Validates that the `tags` is present and non-empty.

## Examples of *correct* usage

```
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

```
{
  "tags": []
}
```

```
{
}
```
