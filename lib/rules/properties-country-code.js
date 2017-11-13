'use strict';

const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const PropertiesParser = require('../helpers/PropertiesParser');

const countryPattern = /country/;
const expectedCountryPattern = /^(?:.+_|)country_code$/;

const rule = {
  description: 'enforce country properties are named country_code or end with _country_code',
  validate(options, schema) {
    const errorList = [];
    const myPropsParser = new PropertiesParser(schema, errorList);

    myPropsParser.forEachProperty((propertyKey, propertyObject, pathToProperty) => {
      if (countryPattern.test(propertyKey) && !expectedCountryPattern.test(propertyKey)) {
        errorList.push(new RuleFailure({
          location: pathToProperty,
          hint: 'Found country property not named country_code or ending with _country_code'
        }));
      }
    });

    return new List(errorList);
  }
};

module.exports = rule;
