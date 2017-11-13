'use strict';

const constants = require('../constants');
const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const PropertiesParser = require('../helpers/PropertiesParser');

const rule = {
  description: 'enforce all properties\' keys conform to a specified input style',
  validate(options, schema) {
    if (!options
      || !options.case
      || Object.keys(constants.caseStyles).indexOf(options.case) === -1) {
      throw new Error('Invalid config specified');
    }

    const errorList = [];
    const myPropsParser = new PropertiesParser(schema, errorList);

    myPropsParser.forEachProperty((propertyKey, propertyObject, pathToProperty) => {
      if (!propertyKey.match(constants.caseStyles[options.case])) {
        errorList.push(new RuleFailure({ location: pathToProperty, hint: `"${propertyKey}" does not comply with case: "${options.case}"` }));
      }
    });

    return new List(errorList);
  }
};

module.exports = rule;
