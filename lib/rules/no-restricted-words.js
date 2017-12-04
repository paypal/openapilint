'use strict';

const _ = require('lodash');
const List = require('immutable').List;

const constants = require('../constants');
const RuleFailure = require('../RuleFailure');
const SchemaObjectParser = require('../helpers/SchemaObjectParser');

/**
 * Adds an error if a restricted word is found.
 *
 * @param {Object} field The string being checked.
 * @param {Object} pathToField The path to the field used for error messages.
 * @param {Object} restrictedWords The list of restricted words.
 * @param {Object} errorList The local list of errors.
 */
function checkString(field, pathToField, restrictedWords, errorList) {
  restrictedWords.forEach((word) => {
    if (new RegExp(`\\b${word}\\b`, 'gi').test(field)) {
      errorList.push(new RuleFailure({
        location: pathToField,
        hint: `Found '${field}'`
      }));
    }
  });
}

/**
 * Returns the list of failures for the schema.
 *
 * @param {Object} restrictedWords The list of restricted words.
 * @param {Object} schema The schema to check.
 *
 * @returns {Object} List the list of failures.
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
      const mySchemaObjectParser = new SchemaObjectParser(schema, errorList);

      mySchemaObjectParser.forEachSchema((schemaObject, pathToSchema) => {
        if (schemaObject.description) {
          checkString(schemaObject.description, `${pathToSchema}.description`, restrictedWords, errorList);
        }
        if (schemaObject.title) {
          checkString(schemaObject.title, `${pathToSchema}.title`, restrictedWords, errorList);
        }
      });

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
            });
          }

          if (responses) {
            Object.keys(responses).forEach((responseKey) => {
              const response = responses[responseKey];

              if (response.description) {
                checkString(response.description, `paths.${pathKey}.${operationKey}.responses.${responseKey}.description`, restrictedWords, errorList);
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
