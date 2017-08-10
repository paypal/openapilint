'use strict';

const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const rule = {
  description: 'enforce present and non-empty tags array',
  validate(options, schema) {
    if (schema.tags) {
      if (schema.tags.length > 0) {
        // success!
        return new List();
      } else {
        return new List().push(new RuleFailure({ location: 'tags', hint: 'Empty tags' }));
      }
    }

    return new List().push(new RuleFailure({ location: 'tags', hint: 'Missing tags' }));
  }
};

module.exports = rule;
