'use strict';

class PatternOptionsValidator {
  /**
   * Returns true if a pattern option is correct, meaning only one of the pattern
   * or patternIgnoreCase is defined.
   * @param {Object} pattern The provided pattern.
   * @param {Object} patternIgnoreCase The provided patternIgnoreCase.
   * @returns {boolean} true if the pattern is valid.
   */
  static isValidPatternOption(pattern, patternIgnoreCase) {
    return (pattern && !patternIgnoreCase)
      || (!pattern && patternIgnoreCase);
  }
}

module.exports = PatternOptionsValidator;
