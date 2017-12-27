'use strict';

const RuleFailure = require('../RuleFailure');
const PatternOptionsValidator = require('./PatternOptionsValidator');

/**
 * Get the correct field, either the key or the object's field.
 *
 * @param {String} fieldValueSpecifier The option config for the field.
 * @param {Object} key The key name.
 * @param {Object} object The key's object.
 * @returns {String} The value of the field fieldValueSpecifier
 */
function getFieldValue(fieldValueSpecifier, key, object) {
  if (fieldValueSpecifier === '$key') {
    if (key === undefined) {
      throw new Error('$key is not valid for this rule.');
    }

    return key;
  }

  return object[fieldValueSpecifier];
}

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

class CustomValidator {
  constructor(options, rootSchema, errorList) {
    this.options = options;
    this.rootSchema = rootSchema;
    this.errorList = errorList;
  }

  /**
   * Validates the provided options.
   */
  validateOptions() {
    if (!this.options) {
      throw new Error('Missing config');
    }

    getNormalizedOptions(this.options).forEach((option) => {
      if (!option.whenField
      || (!PatternOptionsValidator.isValidPatternOption(
        option.thenPattern, option.thenPatternIgnoreCase))
      || !option.thenField
      || (!PatternOptionsValidator.isValidPatternOption(
        option.whenPattern, option.whenPatternIgnoreCase))) {
        throw new Error(`Invalid option specified: ${JSON.stringify(option)}`);
      }
    });
  }

  /**
   * Validates each object.
   * @param {Object} key The key name.
   * @param {Object} object The key's object.
   * @param {Object} pathToObject The path to the object for error reporting.
   * @param {Object} objectName The object name for error reporting.
   * @param {Function} predicateFunction A required function to let the calling method
   *                   run an additional check.
   */
  validateAllCustoms(key, object, pathToObject, objectName, predicateFunction) {
    getNormalizedOptions(this.options).forEach((option) => {
      if (predicateFunction === undefined) {
        throw new Error('predicateFunction cannot be undefined');
      }

      const shouldExecute = predicateFunction(option);

      if (shouldExecute) {
        const whenFieldValue = getFieldValue(option.whenField, key, object);
        const thenFieldValue = getFieldValue(option.thenField, key, object);

        const whenPatternRegex = (option.whenPatternIgnoreCase) ? new RegExp(option.whenPatternIgnoreCase, 'gi') : new RegExp(option.whenPattern, 'g');
        const thenPatternRegex = (option.thenPatternIgnoreCase) ? new RegExp(option.thenPatternIgnoreCase, 'gi') : new RegExp(option.thenPattern, 'g');

        if (whenPatternRegex.test(whenFieldValue)) {
          const thenPattern =
            (option.thenPatternIgnoreCase)
              ? option.thenPatternIgnoreCase
              : option.thenPattern;

          if (thenFieldValue === undefined) {
            this.errorList.push(new RuleFailure({
              location: pathToObject,
              hint: `Expected ${objectName} ${option.thenField} to be present and to match "${thenPattern}"`
            }));
          } else if (!thenPatternRegex.test(thenFieldValue)) {
            this.errorList.push(new RuleFailure({
              location: pathToObject,
              hint: `Expected ${objectName} ${option.thenField}:"${thenFieldValue}" to match "${thenPattern}"`
            }));
          }
        }
      }
    });
  }
}

module.exports = CustomValidator;
