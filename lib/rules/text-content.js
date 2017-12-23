'use strict';

const List = require('immutable').List;

const RuleFailure = require('../RuleFailure');
const TextParser = require('../helpers/TextParser');

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
    if (!option.applyTo
    || (!option.matchPattern && !option.notMatchPattern)) {
      throw new Error(`Invalid option specified: ${JSON.stringify(option)}`);
    }
  });
}

const rule = {
  description: 'enforce text content either matches or does not match config constraints',

  validate(options, schema) {
    validateOptions(options);

    const errorList = [];
    const myTextParser = new TextParser(schema, errorList);

    myTextParser.forEachTextField((field, pathToField) => {
      getNormalizedOptions(options).forEach((option) => {
        if (option.matchPattern) {
          if (!new RegExp(option.matchPattern, 'g').test(field)) {
            errorList.push(new RuleFailure({
              location: pathToField,
              hint: `Expected "${field}" to match "${option.matchPattern}"`
            }));
          }
        } else if (new RegExp(option.notMatchPattern, 'g').test(field)) {
          errorList.push(new RuleFailure({
            location: pathToField,
            hint: `Expected "${field}" to not match "${option.notMatchPattern}"`
          }));
        }
      });
    });

    return new List(errorList);
  }
};

module.exports = rule;
