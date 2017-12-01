'use strict';

const List = require('immutable').List;

const CustomOptionsValidator = require('../helpers/CustomOptionsValidator');
const PropertiesParser = require('../helpers/PropertiesParser');

const rule = {
  description: 'enforce properties comply with custom config constraints',
  validate(options, schema) {
    const errorList = [];

    const customOptionsValidator = new CustomOptionsValidator(options, schema, errorList);
    const myPropsParser = new PropertiesParser(schema, errorList);

    customOptionsValidator.validateOptions();
    myPropsParser.forEachProperty((propertyKey, propertyObject, pathToProperty) => {
      customOptionsValidator.validateAllCustoms(propertyKey, propertyObject, pathToProperty, 'property');
    });

    return new List(errorList);
  }
};

module.exports = rule;
