'use strict';

const _ = require('lodash');

const constants = require('../constants');
const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

/**
 * Returns true if the field matches any restrictedWords.
 */
function checkString(field, restrictedWords) {
  return _.some(restrictedWords, word => new RegExp(word, 'g').test(field));
}

/**
 * Validates the schemaObject (not the global schema).
 */
function checkSchemaObject(schemaObject, pathToSchema, restrictedWords, errorList) {
  if (schemaObject.description
    && checkString(schemaObject.description, restrictedWords)) {
    errorList.push(new RuleFailure({
      location: `${pathToSchema}.description`,
      hint: ''
    }));
  }

  if (schemaObject.items
    && schemaObject.items.description
    && checkString(schemaObject.items.description, restrictedWords)) {
    errorList.push(new RuleFailure({
      location: `${pathToSchema}.items.description`,
      hint: ''
    }));
  }

  if (schemaObject.properties) {
    Object.keys(schemaObject.properties).forEach((propertyKey) => {
      const property = schemaObject.properties[propertyKey];
      if (property.description && checkString(property.description, restrictedWords)) {
        errorList.push(new RuleFailure({
          location: `${pathToSchema}.properties.${propertyKey}.description`,
          hint: ''
        }));
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
    if (schema.info && schema.info.title
      && checkString(schema.info.title, restrictedWords)) {
      errorList.push(new RuleFailure({ location: 'info.title', hint: '' }));
    }

    if (schema.info && schema.info.description
      && checkString(schema.info.description, restrictedWords)) {
      errorList.push(new RuleFailure({ location: 'info.description', hint: '' }));
    }

    if (schema.paths) {
      Object.keys(schema.paths).forEach((pathKey) => {
        const path = schema.paths[pathKey];

        // no path descriptions or titles
        Object.keys(_.pick(path, constants.httpMethods)).forEach((operationKey) => {
          const operation = path[operationKey];
          const parameters = operation.parameters;
          const responses = operation.responses;

          if (operation.description && checkString(operation.description, restrictedWords)) {
            errorList.push(new RuleFailure({
              location: `paths.${pathKey}.${operationKey}.description`,
              hint: ''
            }));
          }

          if (operation.summary && checkString(operation.summary, restrictedWords)) {
            errorList.push(new RuleFailure({
              location: `paths.${pathKey}.${operationKey}.summary`,
              hint: ''
            }));
          }

          if (parameters) {
            parameters.forEach((parameter, parameterIndex) => {
              if (parameter.description && checkString(parameter.description, restrictedWords)) {
                errorList.push(new RuleFailure({
                  location: `paths.${pathKey}.${operationKey}.parameters[${parameterIndex}].description`,
                  hint: ''
                }));
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
              if (response.description && checkString(response.description, restrictedWords)) {
                errorList.push(new RuleFailure({
                  location: `paths.${pathKey}.${operationKey}.responses.${responseKey}.description`,
                  hint: ''
                }));
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
