'use strict';

const RuleFailure = require('../RuleFailure');
const RuleFailureList = require('../RuleFailureList');

const pathPattern = /^[a-zA-Z]+$/;

const rule = {
  description: 'enforce existence and well formed `x-docPath`',
  validate(options, schema) {
    if (schema.info && schema.info['x-docPath']) {
      if (!pathPattern.test(schema.info['x-docPath'])) {
          // return the actual path in this case to indicate that it was found, but still wrong.
        return new RuleFailureList().push(new RuleFailure({ location: 'info.x-docPath', hint: '' }));
      }

      // success!
      return new RuleFailureList();
    }

    return new RuleFailureList().push(new RuleFailure({ location: 'info', hint: '' }));
  }  
};

module.exports = rule;
