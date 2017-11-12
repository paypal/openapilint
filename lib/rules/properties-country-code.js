'use strict';

const _ = require('lodash');

const constants = require('../constants');
const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const countryPattern = /country/;
const expectedCountryPattern = /^(?:.+_|)country_code$/;

/**
 * Returns the dereferenced object from the schemaObject.$ref
 *
 * @param {Object} schemaObject The schema object being checked.
 * @param {Object} pathToSchema The path to the schema used for error messages.
 * @param {Object} definitions The definitions object of the original schema.
 * @param {Object} errorList The local list of errors.
 * @returns {Object} dereferencedSchema The derefenced schema.
 */
function getReferencedSchema(schemaObject, pathToSchema, definitions, errorList) {
  if (schemaObject.$ref.startsWith('#/definitions/')) {
    const trimmedRef = schemaObject.$ref.substr(2);
    const splitRef = trimmedRef.split('/');

    const referencedSchema = definitions[splitRef[1]];

    return referencedSchema;
  }
  errorList.push(new RuleFailure({
    location: `${pathToSchema}`,
    hint: 'Found a non-internal reference'
  }));

  return {};
}

/**
 * Validates the schemaObject (not the global schema).
 *
 * @param {Object} schemaObject The schema object being checked.
 * @param {Object} pathToSchema The path to the schema used for error messages.
 * @param {Object} definitions The definitions object of the original schema.
 * @param {Object} visitedRefs The list of already visited refs. These will not be visited again.
 * @param {Object} errorList The local list of errors.
 */
function checkSchemaObject(schemaObject, pathToSchema, definitions, visitedRefs, errorList) {
  if (!schemaObject) {
    return;
  }

  if (schemaObject.$ref && !_.includes(visitedRefs, schemaObject.$ref)) {
    visitedRefs.push(schemaObject.$ref);
    const referencedSchema = getReferencedSchema(
      schemaObject, pathToSchema, definitions, errorList);

    checkSchemaObject(referencedSchema, pathToSchema, definitions, visitedRefs, errorList);
  } else if (schemaObject.type === 'object' && schemaObject.properties) {
    Object.keys(schemaObject.properties).forEach((propertyKey) => {
      if (countryPattern.test(propertyKey) && !expectedCountryPattern.test(propertyKey)) {
        errorList.push(new RuleFailure({
          location: `${pathToSchema}.properties.${propertyKey}`,
          hint: 'Found country property not named country_code or ending with _country_code'
        }));
      }

      const propertyInfo = schemaObject.properties[propertyKey];

      checkSchemaObject(propertyInfo, pathToSchema, definitions, visitedRefs, errorList);
    });
  } else if (schemaObject.type === 'array' && schemaObject.items) {
    checkSchemaObject(schemaObject.items, `${pathToSchema}.items`, definitions, visitedRefs, errorList);
  }

  if (schemaObject.allOf) {
    schemaObject.allOf.forEach((allOfValue, allOfIndex) => {
      checkSchemaObject(allOfValue, `${pathToSchema}.allOf[${allOfIndex}]`, definitions, visitedRefs, errorList);
    });
  }
}

const rule = {
  description: 'enforce country properties are named country_code or end with _country_code',
  validate(options, rootSchema) {
    const visitedRefs = [];
    const errorList = [];

    if (rootSchema.paths) {
      Object.keys(rootSchema.paths).forEach((pathKey) => {
        const path = rootSchema.paths[pathKey];

        // check each operation
        Object.keys(_.pick(path, constants.httpMethods)).forEach((operationKey) => {
          const operation = path[operationKey];

          if (operation.parameters) {
            operation.parameters.forEach((parameter, parameterIndex) => {
              checkSchemaObject(parameter.schema, `paths.${pathKey}.${operationKey}.parameters[${parameterIndex}].schema`, rootSchema.definitions, visitedRefs, errorList);
            });
          }

          if (operation.responses) {
            Object.keys(operation.responses).forEach((responseKey) => {
              const response = operation.responses[responseKey];

              checkSchemaObject(response.schema, `paths.${pathKey}.${operationKey}.responses.${responseKey}.schema`, rootSchema.definitions, visitedRefs, errorList);
            });
          }
        });
      });
    }

    return new List(errorList);
  }
};

module.exports = rule;
