'use strict';

const _ = require('lodash');

const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const SchemaObjectParser = require('../helpers/SchemaObjectParser');

const rule = {
  description: 'enforce no refs have overrides',
  validate(options, schema) {
    const errorList = [];
    const mySchemaObjectParser = new SchemaObjectParser(schema, errorList);

    const normalizedOptions = options || {};
    const normalizedAllowProperties = normalizedOptions.allowProperties || [];

    mySchemaObjectParser.forEachSchema(undefined, undefined, (schemaObject, pathToSchema) => {
      Object.keys(_.omit(schemaObject, normalizedAllowProperties.concat(['$ref', 'openapilintType']))).forEach((schemaKey) => {
        errorList.push(new RuleFailure({
          location: `${pathToSchema}.${schemaKey}#override`,
          hint: 'Found $ref object override'
        }));
      });
    });

    // TODO check other referenced fields once this project supports them.

    return new List(errorList);
  }
};

module.exports = rule;
