# enforce present and valid `info` object (root-info)

Validates that the `info` object is present and valid to spec.

## Examples of *correct* usage

```json
{
  "info": {
    "title": "The title",
    "version": "1.3"
  }
}
```

## Examples of **incorrect** usage

```json
{
}
```

```json
{
  "info": {}
}
```

```json
{  
  "info": {
    "version": "1.3"
  }
}
```

```json
{
  "info": {
    "title": "The title"
  }
}
```
