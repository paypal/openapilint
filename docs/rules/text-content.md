# enforce text content either matches or does not match config constraints (text-content)

Validates that `title`, `summary`, or `description` do or do not match a configured pattern. Constraints are provided in a simple format:

1. Use `applyTo` specifies at least one of `title`, `summary`, or `description`,
2. and either `matchPattern` or `notMatchPattern` to specify a condition where the field above MUST match `matchPattern`, or MUST NOT match `notMatchPattern`.

## Config A

Validates that `title`, `summary`, and `description` all start with a capital letter.

```json
{
  "applyTo": [
    "title",
    "summary",
    "description" 
  ],
  "matchPattern": "^[A-Z]"
}
```

### Examples of *correct* usage with above config

```json
{
  "info": {
    "title": "Good title with no leading spaces"
  },
  "paths": {
    "/pets": {
      "get": {
        "summary": "The correct case summary",
        "parameters": [
          {
            "description": "The correct case description"
          }
        ]
      }
    }
  }
}
```

### Examples of *incorrect* usage with above config

```json
{
  "info": {
    "title": "    Title with spaces"
  },
  "paths": {
    "/pets": {
      "get": {
        "summary": "the lower case summary",
        "parameters": [
          {
            "description": "the lower case description"
          }
        ]
      }
    }
  }
}
```

## Config B

Validates that `summary` and `description` all end with a period (`.`).

```json
{
  "applyTo": [
    "summary",
    "description" 
  ],
  "matchPattern": "\\.$"
}
```

### Examples of *correct* usage with above config

```json
{
  "paths": {
    "/pets": {
      "get": {
        "summary": "The correct punctuated summary.",
        "parameters": [
          {
            "description": "The correct punctuated description."
          }
        ]
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
        "summary": "The incorrect summary without puncuation",
        "parameters": [
          {
            "description": "The incorrect description with trailing spaces.   "
          }
        ]
      }
    }
  }
}
```
