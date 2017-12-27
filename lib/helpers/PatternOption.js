'use strict';

class PatternOption {
  constructor(prefix, option) {
    this.prefix = prefix;

    const patternKey = `${prefix}Pattern`;
    const patternIgnoreCaseKey = `${prefix}PatternIgnoreCase`;

    if (option[patternKey]) {
      this.pattern = option[patternKey];
      this.ignoreCase = false;
    } else {
      this.pattern = option[patternIgnoreCaseKey];
      this.ignoreCase = true;
    }
  }

  /**
   * Returns a new RegExp object for this pattern.
   * @returns {RegExp} the new RegExp object.
   */
  getRegex() {
    const i = (this.ignoreCase) ? 'i' : '';


    return new RegExp(this.pattern, `g${i}`);
  }

  /**
   * Returns true if a pattern option is correct, meaning only one of the pattern
   * or patternIgnoreCase is defined.
   * @param {Object} prefix The prefix for the option.
   * @param {Object} option The provided option object.
   * @returns {boolean} true if a valid pattern matching the prefix is found.
   */
  static isValidPatternOption(prefix, option) {
    const patternKey = `${prefix}Pattern`;
    const patternIgnoreCaseKey = `${prefix}PatternIgnoreCase`;


    return (!!option[patternKey] && !option[patternIgnoreCaseKey])
      || (!option[patternKey] && !!option[patternIgnoreCaseKey]);
  }
}

module.exports = PatternOption;
