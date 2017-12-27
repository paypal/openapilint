'use strict';

const List = require('immutable').List;

const RuleFailure = require('../RuleFailure');
const PatternOptionsValidator = require('../helpers/PatternOptionsValidator');
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
      || !Array.isArray(option.applyTo)
      || (!PatternOptionsValidator.isValidPatternOption(
        option.matchPattern, option.matchPatternIgnoreCase)
        && !PatternOptionsValidator.isValidPatternOption(
          option.notMatchPattern, option.notMatchPatternIgnoreCase))) {
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

    getNormalizedOptions(options).forEach((option) => {
      myTextParser.forEachTextField(option.applyTo, (field, pathToField) => {
        if (option.matchPattern || option.matchPatternIgnoreCase) {
          const matchPattern = (option.matchPatternIgnoreCase)
            ? option.matchPatternIgnoreCase
            : option.matchPattern;

          const matchPatternRegex = (option.matchPatternIgnoreCase)
            ? new RegExp(matchPattern, 'gi')
            : new RegExp(matchPattern, 'g');

          if (!matchPatternRegex.test(field)) {
            errorList.push(new RuleFailure({
              location: pathToField,
              hint: `Expected "${field}" to match "${matchPattern}"`
            }));
          }
        } else {
          const notMatchPattern = (option.notMatchPatternIgnoreCase)
            ? option.notMatchPatternIgnoreCase
            : option.notMatchPattern;

          const notMatchPatternRegex = (option.notMatchPatternIgnoreCase)
            ? new RegExp(notMatchPattern, 'gi')
            : new RegExp(notMatchPattern, 'g');

          if (notMatchPatternRegex.test(field)) {
            errorList.push(new RuleFailure({
              location: pathToField,
              hint: `Expected "${field}" to not match "${notMatchPattern}"`
            }));
          }
        }
      });
    });

    return new List(errorList);
  }
};

module.exports = rule;
