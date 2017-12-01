'use strict';

const List = require('immutable').List;

const CustomOptionsValidator = require('../helpers/CustomOptionsValidator');
const SchemaObjectParser = require('../helpers/SchemaObjectParser');

const rule = {
  description: 'enforce schema objects comply with custom config constraints',
  validate(options, schema) {
    const errorList = [];

    const customOptionsValidator = new CustomOptionsValidator(options, schema, errorList);
    const mySchemaObjectParser = new SchemaObjectParser(schema, errorList);

    customOptionsValidator.validateOptions();
    mySchemaObjectParser.forEachSchema((schemaObject, pathToSchema) => {
      customOptionsValidator.validateAllCustoms(undefined, schemaObject, pathToSchema, 'schema');
    });

    return new List(errorList);
  }
};

module.exports = rule;
