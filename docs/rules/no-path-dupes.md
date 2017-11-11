# enforce paths are logically unique (no-path-dupes)

Validates that paths that differ only in its path template parameters are not present.

Example of equivalent paths:
/pets/{pet_id}
/pets/{rascal_id}

## Examples of *correct* usage

```json
{
  "paths": {
    "/pets": {
    },
    "/pets/{pet_id}": {
    },
    "/pets/{pet_id}/feed": {
    }
  }
}
```

## Examples of **incorrect** usage
```json
{
  "paths": {
    "/pets": {
    },
    "/pets/{pet_id}": {
    },
    "/pets/{a_different_pet_id}": {
    }
  }
}
```
