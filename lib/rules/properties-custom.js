'use strict';

const List = require('immutable').List;

const CustomOptionsValidator = require('../helpers/CustomOptionsValidator');
const SchemaObjectParser = require('../helpers/SchemaObjectParser');

const rule = {
  description: 'enforce properties comply with custom config constraints',
  validate(options, schema) {
    const errorList = [];

    const customOptionsValidator = new CustomOptionsValidator(options, schema, errorList);
    const mySchemaObjectParser = new SchemaObjectParser(schema, errorList);

    customOptionsValidator.validateOptions();
    mySchemaObjectParser.forEachProperty((propertyKey, propertyObject, pathToProperty) => {
      customOptionsValidator.validateAllCustoms(propertyKey, propertyObject, pathToProperty, 'property', () => true);
    });

    return new List(errorList);
  }
};

module.exports = rule;
