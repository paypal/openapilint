'use strict';

const LintResult = require('./LintResult');

class OpenApiLint {
  constructor(config) {
    this.config = config || {};
    this.config.rules = this.config.rules || {};
  }

  /**
   * Lint specified OpenAPI spec.
   *
   * @param {Object} config Configuration options.
   * @param {Object} schema Schema to lint.
   * @returns {Promise<LintResult>} A promise to the LintResult object.
   */
  lint(schema) {
    return new Promise((resolve, reject) => {
      // Normalize inputs
      const errorList = [];

      const result = new LintResult().withMutations((map) => {
        Object.keys(this.config.rules).forEach((ruleKey) => {
          const ruleConfig = this.config.rules[ruleKey];
          let validRuleName;
          const ruleName = `./rules/${ruleKey}`;

          // Check that this is a valid rule by file name of the rules.
          try {
            require.resolve(ruleName);
            validRuleName = true;
          } catch (e) {
            validRuleName = false;
          }

          if (validRuleName) {
            const rule = require(ruleName);
            const ruleResult = rule.validate(ruleConfig, schema);
            map.set(ruleKey, ruleResult);
          } else {
            errorList.push(`${ruleKey} not a valid config option`);
          }
        });
      });

      if (errorList.length > 0) {
        reject(Error(`${errorList.length} errors with config: $errorList`));
      } else {
        resolve(result);
      }
    });
  }
}

module.exports = OpenApiLint;
