'use strict';

const RuleResult = require('../RuleResult');
const RuleFailure = require('../RuleFailure');
const RuleFailureList = require('../RuleFailureList');

const description = 'enforce non-empty `tags` array';
const rule = {
  validate(options, schema) {
    if (options) {
      if (schema.tags && schema.tags.length > 0) {
        // success!
        return new RuleResult({ description, failures: new RuleFailureList() });
      }

      return new RuleResult(
        {
          description,
          failures: new RuleFailureList().push(new RuleFailure({ location: 'tags', hint: '' }))
        }
      );
    }
    return new RuleResult({ description, failures: new RuleFailureList() });
  }
};

module.exports = rule;
