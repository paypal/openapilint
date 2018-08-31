'use strict';

const RuleFailure = require('../RuleFailure');
const PatternOption = require('./PatternOption');
/**
 * This function enables field names with dot notation to be
 * used, allowing the rules to look for nested field names.
 *
 * @param {Object} obj  The key's object
 * @param {String} path The option config for the field.
*/
const getDescendantProp = (obj, path) => (
    path.split('.').reduce((acc, part) => acc && acc[part], obj)
);

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

  return getDescendantProp(object,fieldValueSpecifier);
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
      || (!PatternOption.isValidPatternOption('then', option))
      || !option.thenField
      || (!PatternOption.isValidPatternOption('when', option))) {
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

        const whenPatternOption = new PatternOption('when', option);
        const thenPatternOption = new PatternOption('then', option);

        if ((whenPatternOption.isAbsent && whenFieldValue === undefined) ||
           (!whenPatternOption.isAbsent && whenPatternOption.getRegex().test(whenFieldValue))) {
          if (!thenPatternOption.isAbsent && thenFieldValue === undefined) {
            this.errorList.push(new RuleFailure({
              location: pathToObject,
              hint: `Expected ${objectName} ${option.thenField} to be present and to match "${thenPatternOption.pattern}"`
            }));
          } else if (thenPatternOption.isAbsent && thenFieldValue !== undefined) {
            this.errorList.push(new RuleFailure({
              location: pathToObject,
              hint: `Expected ${objectName} ${option.thenField}:"${thenFieldValue}" to be absent`
            }));
          } else if (!thenPatternOption.getRegex().test(thenFieldValue)) {
            this.errorList.push(new RuleFailure({
              location: pathToObject,
              hint: `Expected ${objectName} ${option.thenField}:"${thenFieldValue}" to match "${thenPatternOption.pattern}"`
            }));
          }
        }
      }
    });
  }
}

module.exports = CustomValidator;
