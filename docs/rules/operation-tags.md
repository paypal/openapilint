# enforce existence and non-empty operation tags (operation-tags)

Validates that all operations have a non-empty `tags` array.

## Examples of *correct* usage

```
{
  "paths": {
    "/pets": {
      "get": {
        tags: ["pet"]
        ...
      }
    }
  }
}

```

## Examples of **incorrect** usage

```
{
  "paths": {
    "/pets": {
      "get": {
        tags: []
        ...
      }
    }
  }
}
```

```
{
  "paths": {
    "/pets": {
      "get": {
        ...
      }
    }
  }
}
```
