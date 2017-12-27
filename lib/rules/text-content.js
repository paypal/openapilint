'use strict';

const List = require('immutable').List;

const RuleFailure = require('../RuleFailure');
const PatternOption = require('../helpers/PatternOption');
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
      || (!PatternOption.isValidPatternOption('match', option)
        && !PatternOption.isValidPatternOption('notMatch', option))) {
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
      let currentPatternOption;

      if (option.matchPattern || option.matchPatternIgnoreCase) {
        currentPatternOption = new PatternOption('match', option);
      } else {
        currentPatternOption = new PatternOption('notMatch', option);
      }

      myTextParser.forEachTextField(option.applyTo, (field, pathToField) => {
        const matchedRegex = currentPatternOption.getRegex().test(field);

        if (!matchedRegex && currentPatternOption.prefix === 'match') {
          errorList.push(new RuleFailure({
            location: pathToField,
            hint: `Expected "${field}" to match "${currentPatternOption.pattern}"`
          }));
        }

        if (matchedRegex && currentPatternOption.prefix === 'notMatch') {
          errorList.push(new RuleFailure({
            location: pathToField,
            hint: `Expected "${field}" to not match "${currentPatternOption.pattern}"`
          }));
        }
      });
    });

    return new List(errorList);
  }
};

module.exports = rule;
