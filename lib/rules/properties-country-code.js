'use strict';

const _ = require('lodash');

const constants = require('../constants');
const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const countryPattern = /country/;
const expectedCountryPattern = /^(?:.+_|)country_code$/;

/**
 * Validates the schemaObject (not the global schema).
 *
 * @param {Object} schemaObject The schema object being checked.
 * @param {Object} pathToSchema The path to the schema used for error messages.
 * @param {Object} errorList The local list of errors.
 */
function checkSchemaObject(schemaObject, pathToSchema, errorList) {
  if (!schemaObject) {
    return;
  }

  // TODO check for circular

  if (schemaObject.type === 'object' && schemaObject.properties) {
    Object.keys(schemaObject.properties).forEach((propertyKey) => {
      const propertyInfo = schemaObject.properties[propertyKey];

      // TODO check for sub properties.

      if (countryPattern.test(propertyKey) && !expectedCountryPattern.test(propertyKey)) {
        errorList.push(new RuleFailure({
          location: `${pathToSchema}.properties.${propertyKey}`,
          hint: 'country properties should be named country_code or end with _country_code'
        }));
      }
    });
  } else if (schemaObject.type === 'array' && schemaObject.items && schemaObject.items.type === 'object') {
    checkSchemaObject(schemaObject.items, `${pathToSchema}.items`, errorList);
  }

  if (schemaObject.allOf) {
    schemaObject.allOf.forEach((allOfValue, allOfIndex) => {
      checkSchemaObject(allOfValue, `${pathToSchema}.allOf[${allOfIndex}]`, errorList);
    });
  }
}

const rule = {
  description: 'enforce country properties are named country_code or end with _country_code',
  validate(options, schema) {
    const errorList = [];

    if (schema.paths) {
      Object.keys(schema.paths).forEach((pathKey) => {
        const path = schema.paths[pathKey];

        // check each operation
        Object.keys(_.pick(path, constants.httpMethods)).forEach((operationKey) => {
          const operation = path[operationKey];

          if (operation.parameters) {
            operation.parameters.forEach((parameter, parameterIndex) => {
              checkSchemaObject(parameter.schema, `paths.${pathKey}.${operationKey}.parameters[${parameterIndex}].schema`, errorList);
            });
          }

          if (operation.responses) {
            Object.keys(operation.responses).forEach((responseKey) => {
              const response = operation.responses[responseKey];

              checkSchemaObject(response.schema, `paths.${pathKey}.${operationKey}.responses.${responseKey}.schema`, errorList);
            });
          }

          // TODO check refs, recursively.
        });
      });
    }

    return new List(errorList);
  }
};

module.exports = rule;
