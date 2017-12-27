'use strict';

const List = require('immutable').List;

const CustomValidator = require('../helpers/CustomValidator');
const SchemaObjectParser = require('../helpers/SchemaObjectParser');

const rule = {
  description: 'enforce properties comply with custom config constraints',
  validate(options, schema) {
    const errorList = [];

    const myCustomValidator = new CustomValidator(options, schema, errorList);
    const mySchemaObjectParser = new SchemaObjectParser(schema, errorList);

    myCustomValidator.validateOptions();
    mySchemaObjectParser.forEachProperty((propertyKey, propertyObject, pathToProperty) => {
      myCustomValidator.validateAllCustoms(propertyKey, propertyObject, pathToProperty, 'property', () => true);
    });

    return new List(errorList);
  }
};

module.exports = rule;
