'use strict';

const _ = require('lodash');
const List = require('immutable').List;

const constants = require('../constants');
const CustomValidator = require('../helpers/CustomValidator');
const PatternOption = require('../helpers/PatternOption');

/**
 * Gets a normalized options object array. If options are just an object, wraps in an array.
 * @param {Object} options The provided options.
 * @returns {Array} An options array.
 */
function getNormalizedOptions(options) {
  const normalizedOptions = [];

  if (!Array.isArray(options)) {
    normalizedOptions.push(options);
  } else {
    normalizedOptions.push.apply(normalizedOptions, options);
  }

  return normalizedOptions;
}

/**
 * Validates the provided options.
 * @param {Object} options The provided options.
 */
function validateOptions(options) {
  if (!options) {
    throw new Error('Missing config');
  }

  getNormalizedOptions(options).forEach((option) => {
    if (!option.whenHttpMethod
    || !PatternOption.isValidPatternOption('thenResponseCode', option)) {
      throw new Error(`Invalid option specified: ${JSON.stringify(option)}`);
    }
  });
}

const rule = {
  description: 'enforce operation response codes comply with custom key constraints',
  validate(options, schema) {
    const errorList = [];

    validateOptions(options);

    // convert into a custom format that the parser understands.
    const methodToValidatorsMap = {};

    getNormalizedOptions(options).forEach((option) => {
      const convertedOption = {
        whenField: '$key',
        whenPattern: '.*',
        thenField: '$key'
      };

      if (option.thenResponseCodePattern) {
        convertedOption.thenPattern = option.thenResponseCodePattern;
      } else {
        convertedOption.thenPatternIgnoreCase = option.thenResponseCodePatternIgnoreCase;
      }
      const myCustomValidator = new CustomValidator(convertedOption, schema, errorList);

      myCustomValidator.validateOptions();
      if (!methodToValidatorsMap[option.whenHttpMethod]) {
        methodToValidatorsMap[option.whenHttpMethod] = [];
      }
      methodToValidatorsMap[option.whenHttpMethod].push(myCustomValidator);
    });

    if (schema.paths) {
      Object.keys(schema.paths).forEach((pathKey) => {
        const path = schema.paths[pathKey];

        Object.keys(_.pick(path, constants.httpMethods)).forEach((operationKey) => {
          const operation = path[operationKey];

          const applicableValidations = methodToValidatorsMap[operationKey];

          if (applicableValidations && operation.responses) {
            Object.keys(operation.responses).forEach((responseKey) => {
              applicableValidations.forEach((validator) => {
                validator.validateAllCustoms(
                  responseKey,
                  undefined, // only care about keys
                  `paths.${pathKey}.${operationKey}.responses.${responseKey}`,
                  'responses',
                  () => true
                );
              });
            });
          }
        });
      });
    }

    return new List(errorList);
  }
};

module.exports = rule;
