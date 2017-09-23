'use strict';

const constants = require('../constants');
const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const rule = {
  description: 'enforce present and well formed x-publicDocsPath',
  validate(options, schema) {
    if (schema.info && schema.info['x-publicDocsPath']) {
      if (!constants.caseStyles.any.test(schema.info['x-publicDocsPath'])) {
          // return the actual path in this case to indicate that it was found, but still wrong.
        return new List().push(new RuleFailure({ location: 'info.x-publicDocsPath', hint: 'Not a valid path' }));
      }

      // success!
      return new List();
    }

    return new List().push(new RuleFailure({ location: 'info', hint: 'Missing' }));
  }
};

module.exports = rule;
