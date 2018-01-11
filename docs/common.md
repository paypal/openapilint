# Common rule config

## `case`

Any rule that takes `case` as an argument will accept the following values:

  * `spine` Example: `this-is-a-spine-case`
  * `cap-spine` Example: `THIS-IS-A-CAP-SPINE-CASE`
  * `snake`  Example: `this_is_a_snake_case`
  * `any`  Example: `thisIs-..Any_CASE`


## `*-custom` config

All `*-custom` rules support the following common config:

1. When `whenField` matches `whenPattern`/`whenAbsent`,
2. Then `thenField` MUST match `thenPattern`/`thenAbsent`.

For object types that have keys, and are not part of an array, the `whenField` name can be `$key` to denote its key.

Any `*Pattern` can be made case insensitive by adding `IgnoreCase`, such as `thenPatternIgnoreCase`.

The `*Absent` option is as it sounds, will match only if the field is not present at all. The following example shows how a `description` field should be absent if the `name` matches a `special_name`:

```json
{
  "whenField": "name",
  "whenPattern": "special_name",
  "thenField": "description",
  "thenAbsent": true
}
```
