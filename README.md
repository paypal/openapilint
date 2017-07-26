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
  // Do something with the LintResult object.
}).catch((error) => {
  // Do something with the Error.
});
```

`LintResult` is a `String -> RuleResult` [immutable Map](http://facebook.github.io/immutable-js/docs/#/Map) of nested immutable objects for consumption.  Specifically:

* `RuleResult` is a `String -> Object` [immutable Record](http://facebook.github.io/immutable-js/docs/#/Record) with two keys, `description` (`String`) & `failures` (`RuleFailureList`).
* `RuleFailureList` is a `RuleFailure` [immutable List](http://facebook.github.io/immutable-js/docs/#/List).
* `RuleFailure` is a `String -> String` [immutable Record](http://facebook.github.io/immutable-js/docs/#/Record) with two keys, `location` (`String`) & `hint` (`String`)

It is up to the implementer to parse this data and provide a useful error response to the user.

## Rules

By default, only the rules in `lib/rules` are supported.  Details of these rules can be found in the [`docs/rules`](docs/rules) directory.

## Dereferencing

Due to the complex nature of multi-file references, `openapilint` rules assume that a schema is fully dereferenced as much as possible. It is up to you to dereference the schema before passing it as input.
