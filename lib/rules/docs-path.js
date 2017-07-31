'use strict';

const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const pathPattern = /^[a-zA-Z]+$/;

const rule = {
  description: 'enforce existence and well formed `x-publicDocsPath`',
  validate(options, schema) {
    if (schema.info && schema.info['x-publicDocsPath']) {
      if (!pathPattern.test(schema.info['x-publicDocsPath'])) {
          // return the actual path in this case to indicate that it was found, but still wrong.
        return new List().push(new RuleFailure({ location: 'info.x-publicDocsPath', hint: '' }));
      }

      // success!
      return new List();
    }

    return new List().push(new RuleFailure({ location: 'info', hint: '' }));
  }
};

module.exports = rule;
