# Common rule config

## `case`

Any rule that takes `case` as an argument will accept the following values:

  * `spine` Example: `this-is-a-spine-case`
  * `cap-spine` Example: `THIS-IS-A-CAP-SPINE-CASE`
  * `snake`  Example: `this_is_a_snake_case`
  * `any`  Example: `thisIs-..Any_CASE`


## `*-custom` config

All `*-custom` rules support the following common config:

1. When `whenField` matches `whenPattern`,
2. Then `thenField` MUST match `thenPattern`.

For object types that have keys, and are not part of an array, the `whenField` name can be `$key` to denote its key.

Any `*Pattern` can be made case insensitive by adding `IgnoreCase`, such as `thenPatternIgnoreCase`.
