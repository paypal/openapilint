'use strict';

const RuleResult = require('../RuleResult');
const RuleFailure = require('../RuleFailure');
const RuleFailureList = require('../RuleFailureList');

const pathPattern = /^[a-zA-Z]+$/;

const description = 'enforce existence and well formed `x-docPath`';

const rule = {
  validate(options, schema) {
    if (options) {
      if (schema.info && schema.info['x-docPath']) {
        if (!pathPattern.test(schema.info['x-docPath'])) {
            // return the actual path in this case to indicate that it was found, but still wrong.
          return new RuleResult(
            {
              description,
              failures: new RuleFailureList().push(new RuleFailure({ location: 'info.x-docPath', hint: '' }))
            }
          );
        }

        // success!
        return new RuleResult({ description, failures: new RuleFailureList() });
      }

      return new RuleResult(
        {
          description,
          failures: new RuleFailureList().push(new RuleFailure({ location: 'info', hint: '' }))
        }
      );
    }
    return new RuleResult({ description, failures: new RuleFailureList() });
  }
};

module.exports = rule;
