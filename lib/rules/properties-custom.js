'use strict';

const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const PropertiesParser = require('../helpers/PropertiesParser');

/**
 * Get the correct field, either the key or the object's field.
 *
 * @param {String} fieldValueSpecifier The option config for the field.
 * @param {Object} propertyKey The key name of the property.
 * @param {Object} propertyObject The property object.
 * @returns {String} The value of the propertie's fieldValueSpecifier
 */
function getFieldValue(fieldValueSpecifier, propertyKey, propertyObject) {
  if (fieldValueSpecifier === '$key') {
    return propertyKey;
  }

  return propertyObject[fieldValueSpecifier];
}

const rule = {
  description: 'enforce properties comply with custom config constraints',
  validate(options, schema) {
    if (!options
      || !options.whenField
      || !options.whenPattern
      || !options.thenField
      || !options.thenPattern) {
      throw new Error('Invalid config specified');
    }

    const errorList = [];
    const myPropsParser = new PropertiesParser(schema, errorList);

    myPropsParser.forEachProperty((propertyKey, propertyObject, pathToProperty) => {
      const whenFieldValue = getFieldValue(options.whenField, propertyKey, propertyObject);
      const thenFieldValue = getFieldValue(options.thenField, propertyKey, propertyObject);

      const whenPatternRegex = new RegExp(options.whenPattern, 'g');
      const thenPatternRegex = new RegExp(options.thenPattern, 'g');

      if (whenPatternRegex.test(whenFieldValue) && !thenPatternRegex.test(thenFieldValue)) {
        errorList.push(new RuleFailure({
          location: pathToProperty,
          hint: `Expected property ${options.thenField}:"${thenFieldValue}" to match "${options.thenPattern}"`
        }));
      }
    });

    return new List(errorList);
  }
};

module.exports = rule;
