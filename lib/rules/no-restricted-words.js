'use strict';

const _ = require('lodash');

const constants = require('../constants');
const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

/**
 *
 */
function checkString(field, restrictedWords) {
  return _.some(restrictedWords, word => new RegExp(word, 'g').test(field));
}

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
            errorList.push(new RuleFailure({ location: `paths.${pathKey}.${operationKey}.description`, hint: '' }));
          }

          if (operation.summary && checkString(operation.summary, restrictedWords)) {
            errorList.push(new RuleFailure({ location: `paths.${pathKey}.${operationKey}.summary`, hint: '' }));
          }

          if (parameters) {
            parameters.forEach((parameter, parameterIndex) => {
              if (parameter.description && checkString(parameter.description, restrictedWords)) {
                errorList.push(new RuleFailure({ location: `paths.${pathKey}.${operationKey}.parameters[${parameterIndex}].description`, hint: '' }));
              }
            });
          }

          if (responses) {
            Object.keys(responses).forEach((responseKey) => {
              const response = responses[responseKey];
              if (response.description && checkString(response.description, restrictedWords)) {
                errorList.push(new RuleFailure({ location: `paths.${pathKey}.${operationKey}.responses.${responseKey}.description`, hint: '' }));
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
