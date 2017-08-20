'use strict';

const _ = require('lodash');

const constants = require('../constants');
const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

/**
 * Adds an error if a restricted word is found.
 */
function checkString(field, pathToField, restrictedWords, errorList) {
  restrictedWords.forEach((word) => {
    if (new RegExp(word, 'g').test(field)) {
      errorList.push(new RuleFailure({
        location: pathToField,
        hint: `Found '${word}'`
      }));
    }
  });
}

/**
 * Validates the schemaObject (not the global schema).
 */
function checkSchemaObject(schemaObject, pathToSchema, restrictedWords, errorList) {
  if (schemaObject.description) {
    checkString(schemaObject.description, `${pathToSchema}.description`, restrictedWords, errorList);
  }

  if (schemaObject.items && schemaObject.items.description) {
    checkString(schemaObject.items.description, `${pathToSchema}.items.description`, restrictedWords, errorList);
  }

  if (schemaObject.properties) {
    Object.keys(schemaObject.properties).forEach((propertyKey) => {
      const property = schemaObject.properties[propertyKey];
      if (property.description) {
        checkString(property.description, `${pathToSchema}.properties.${propertyKey}.description`, restrictedWords, errorList);
      }
    });
  }
}

/**
 * Returns the list of failures for the schema.
 */
function getFailures(restrictedWords, schema) {
  const errorList = [];

  if (restrictedWords.length !== 0) {
    if (schema.info && schema.info.title) {
      checkString(schema.info.title, 'info.title', restrictedWords, errorList);
    }

    if (schema.info && schema.info.description) {
      checkString(schema.info.description, 'info.description', restrictedWords, errorList);
    }

    if (schema.paths) {
      Object.keys(schema.paths).forEach((pathKey) => {
        const path = schema.paths[pathKey];

        // no path descriptions or titles
        Object.keys(_.pick(path, constants.httpMethods)).forEach((operationKey) => {
          const operation = path[operationKey];
          const parameters = operation.parameters;
          const responses = operation.responses;

          if (operation.description) {
            checkString(operation.description, `paths.${pathKey}.${operationKey}.description`, restrictedWords, errorList);
          }

          if (operation.summary) {
            checkString(operation.summary, `paths.${pathKey}.${operationKey}.summary`, restrictedWords, errorList);
          }

          if (parameters) {
            parameters.forEach((parameter, parameterIndex) => {
              if (parameter.description) {
                checkString(parameter.description, `paths.${pathKey}.${operationKey}.parameters[${parameterIndex}].description`, restrictedWords, errorList);
              }

              if (parameter.schema) {
                checkSchemaObject(
                  parameter.schema,
                  `paths.${pathKey}.${operationKey}.parameters[${parameterIndex}].schema`,
                  restrictedWords,
                  errorList);
              }
            });
          }

          if (responses) {
            Object.keys(responses).forEach((responseKey) => {
              const response = responses[responseKey];
              if (response.description) {
                checkString(response.description, `paths.${pathKey}.${operationKey}.responses.${responseKey}.description`, restrictedWords, errorList);
              }

              if (response.schema) {
                checkSchemaObject(response.schema, `paths.${pathKey}.${operationKey}.responses.${responseKey}.schema`, restrictedWords, errorList);
              }
            });
          }
        });
      });
    }
  }

  return new List(errorList);
}

const rule = {
  description: 'enforce certain words are not included in text fields, including title, summary, or description',

  validate(options, schema) {
    const normalizedOptions = options || {};
    const normalizedWords = normalizedOptions.words || [];

    return getFailures(normalizedWords, schema);
  }
};

module.exports = rule;
