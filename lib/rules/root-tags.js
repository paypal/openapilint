'use strict';

const RuleFailure = require('../RuleFailure');
const RuleFailureList = require('../RuleFailureList');

const rule = {
  description: 'enforce non-empty `tags` array',
  validate(options, schema) {
    if (schema.tags && schema.tags.length > 0) {
      // success!
      return new RuleFailureList();
    }

    return new RuleFailureList().push(new RuleFailure({ location: 'tags', hint: '' }));
  }
};

module.exports = rule;
