'use strict';

const _ = require('lodash');

const RuleFailure = require('../RuleFailure');
const RuleFailureList = require('../RuleFailureList');

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
      _.forEach(Object.keys(schema.paths), (pathKey) => {
        const path = schema.paths[pathKey];

        // no path descriptions or titles
        _.forEach(Object.keys(path), (operationKey) => {
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
            _.forEach(parameters, (parameter, parameterIndex) => {
              if (parameter.description && checkString(parameter.description, restrictedWords)) {
                errorList.push(new RuleFailure({ location: `paths.${pathKey}.${operationKey}.parameters[${parameterIndex}].description`, hint: '' }));
              }
            });
          }

          if (responses) {
            _.forEach(Object.keys(responses), (responseKey) => {
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

  return new RuleFailureList(errorList);
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
