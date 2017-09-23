# enforce paths that conform to spec, and to a specified input style (path-style)

Validates that the `paths` keys conform to the spec.  The [spec](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#pathsObject) states: 

```
A relative path to an individual endpoint. The field name MUST begin with a slash. The path is appended to the basePath in order to construct the full URL. Path templating is allowed.
```

Path templates are allowed, and are surrounded by curly braces.

Not specified in the spec, but validated here:

* The path MUST not end with a trailing slash.

Not validated in this rule:

* The style of the path templates within curly braces.  A separate rule, or another config option for this rule can be added to validate the path template id style.

## Config

The config for this rule consists of:

* `case`: a string specifying the case style.  Choices are:
  * `spine` Example: `/this-is-a-spine-case-path`.  **This is option is preferred.**
  * `cap-spine` Example: `/THIS-IS-A-CAP-SPINE-CASE-PATH`
  * `snake`  Example: `/this_is_a_snake_case_path`

## Example of *correct* usage given config `{"case": "spine"}` 

```json
{
  "paths": {
    "/": {},
    "/first/{id}/second-third": {}
  }
}
```

## Examples of *incorrect* usage given config `{"case": "spine"}` 

```json
{
  "paths": {
    "/pets//food": {}
  }
}
```

```json
{
  "paths": {
    "pets": {}
  }
}
```

```json
{
  "paths": {
    "/badCase": {}
  }
}
```

```json
{
  "paths": {
    "/pets/": {}
  }
}
```

```json
{
  "paths": {
    "/invalid-param/{id/more-stuff": {}
  }
}
```

```json
{
  "paths": {
    "/another-invalid-param/{id/more-stuff}": {}
  }
}
```
