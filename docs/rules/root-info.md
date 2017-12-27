# enforce present and valid `info` object (root-info)

Validates that the `info` object is present and valid to the specification, which states that [the `info` object is required](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#swagger-object), and within it, the [`title` and `version` properties are required](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#infoObject).

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
