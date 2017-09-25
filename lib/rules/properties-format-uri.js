'use strict';

// const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const rule = {
  description: 'enforce all properties keys are snake_case style',
  validate(options, schema) {
    const errorList = [];

    return new List(errorList);
  }
};

module.exports = rule;
