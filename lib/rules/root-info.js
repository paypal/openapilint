'use strict';

const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const rule = {
  description: 'enforce present and valid info object',
  validate(options, schema) {
    const errorList = [];

    if (schema.info) {
      if (!schema.info.title) {
        errorList.push(new RuleFailure({ location: 'info', hint: 'Missing info.title' }));
      }

      if (!schema.info.version) {
        errorList.push(new RuleFailure({ location: 'info', hint: 'Missing info.version' }));
      }
    } else {
      errorList.push(new RuleFailure({ location: 'info', hint: 'Missing info' }));
    }

    return new List(errorList);
  }
};

module.exports = rule;
