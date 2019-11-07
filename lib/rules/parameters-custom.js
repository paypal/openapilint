'use strict';

const List = require('immutable').List;

const CustomValidator = require('../helpers/CustomValidator');
const SchemaObjectParser = require('../helpers/SchemaObjectParser');

const rule = {
  description: 'enforce parameters comply with custom config constraints',
  validate(options, schema) {
    const errorList = [];

    const myCustomValidator = new CustomValidator(options, schema, errorList);
    const mySchemaObjectParser = new SchemaObjectParser(schema, errorList);

    myCustomValidator.validateOptions();
    mySchemaObjectParser.forEachProperty((propertyKey, propertyObject, pathToProperty) => {
      myCustomValidator.validateAllCustoms(propertyKey, propertyObject, pathToProperty, 'parameter', () => true);
    });

    return new List(errorList);
  }
};

module.exports = rule;
