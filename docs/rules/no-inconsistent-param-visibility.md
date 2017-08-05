# enforce consistent visibility of parameters (no-inconsistent-param-visibility)

Visibility can generally be specified for operations and parameters.  Some parameters can be used for special clients, despite the operation being more open.  The opposite, however, does not make sense.

Validates that the visibility specified for a parameter is not less restrictive than its parent operation.

## Config

The config for this rule consists of:

* `orderedOptions`: a list of the possible  options, in order from least visible to most visible.
* `selector`: json path, in array form, of the actual visibility values.  This allows visibility to be a more complex object property, rather than just a string.
* `default`: the default visibility if not specified.

## Examples of *correct* usage given config `{"orderedOptions": ["INTERNAL","LIMITED_RELEASE","EXTERNAL"], "selector": ["x-visibility", "extent"], "default": "INTERNAL"}`

```json
{
  "paths": {
    "/pets": {
      "get": {
        "x-visibility": {
          "extent": "LIMITED_RELEASE"
        },
        "parameters": [
          {
            "name": "id",
            "x-visibility": {
              "extent": "LIMITED_RELEASE"
            }
          },
          {
            "name": "secret_code1",
            "x-visibility": {
              "extent": "INTERNAL"
            }
          },
          {
            "name": "secret_code2"
          }
        ]
      }
    }
  }
}
```

## Examples of **incorrect** usage given config `{"orderedOptions": ["INTERNAL","LIMITED_RELEASE","EXTERNAL"], "selector": ["x-visibility", "extent"], "default": "INTERNAL"}`
```json
{
  "paths": {
    "/pets": {
      "get": {
        "parameters": [
          {
            "name": "id",
            "x-visibility": {
              "extent": "EXTERNAL" // default is INTERNAL, so this is not allowed.
            }
          }
        ]
      }
    }
  }
}
```
