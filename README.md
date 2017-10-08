[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Downloads][downloads-image]][downloads-url]

# openapilint

This project uses Node.js to implement an OpenAPI linter.  As with any linter, there are configurable options for validating your OpenAPI specs.

## Install openapilint

```
npm install openapilint --save
```

## Usage

`openapilint` takes as input a json schema, and json config object:

```js
const schema = {
  info: {
    description: 'handy description'
  }
};
const config = {
  "rules": {
    "docs-path": true,  // rule will be run, and has no special config
    "no-restricted-words": {"words": ["supersecretacronym"]},  // rule will be run with the specified config
    "root-tags": false // rule will not be run
  }
};

```

and returns a promise of the results:

```js
const result = new OpenApiLint(config).lint(schema);

return result.then((lintResult) => {
  // Do something with the result Map.
}).catch((error) => {
  // Do something with the Error.
});
```

`lintResult` is a `String -> RuleResult` [immutable Map](http://facebook.github.io/immutable-js/docs/#/Map) of nested immutable objects for consumption.  Specifically:

* `RuleResult` is a `String -> Object` [immutable Record](http://facebook.github.io/immutable-js/docs/#/Record) with two keys, `description` (`String`) & `failures` (`List<RuleFailure>`).
* `RuleFailure` is a `String -> String` [immutable Record](http://facebook.github.io/immutable-js/docs/#/Record) with two keys, `location` (`String`) & `hint` (`String`)

It is up to the implementer to parse this data and provide a useful error response to the user.

## Rules

By default, only the rules in `lib/rules` are supported.  Details of these rules can be found in [`docs/rules`](https://github.com/braintree/openapilint/tree/master/docs/rules).

## Dereferencing

Due to the complex nature of multi-file references, `openapilint` rules assume that a schema is fully dereferenced as much as possible. It is up to you to dereference the schema before passing it as input.

## OpenAPI supported versions

`openapilint` supports Swagger 2.0.  Support for OpenAPI 3.0 is coming shortly.

## Comparison to other validators

`openapilint` does have some overlapping features with other json validators, such as [`joi`](https://github.com/hapijs/joi) and [`jsonschema`](https://github.com/tdegrunt/jsonschema).  A developer using this project may choose to use those validators as a first wave of checks against a particular spec before running it through the `openapilint` set of rules.  This is expected and encouraged.  `openapilint` is to add easy convention checks and configuration specific to OpenAPI, as well as some helpful hints for particular errors.

## License

See [License](LICENSE).

## Contributing

See [Contributing](CONTRIBUTING.md).

## Acknowledgements

This project was inspired by - and heavily influenced by - [`eslint`](https://github.com/eslint/eslint/), [`markdownlint`](https://github.com/DavidAnson/markdownlint), and [`swagger-api-checkstyle`](https://github.com/jharmn/swagger-api-checkstyle).  The configuration schema and some code was modified for usage in this project.

[npm-image]: https://img.shields.io/npm/v/openapilint.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/openapilint
[travis-image]: https://img.shields.io/travis/braintree/openapilint/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/braintree/openapilint
[downloads-image]: https://img.shields.io/npm/dm/openapilint.svg?style=flat-square
[downloads-url]: https://www.npmjs.com/package/openapilint
