'use strict';

const _ = require('lodash');

const constants = require('../constants');
const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const rule = {
  description: 'enforce not present path item parameters',
  validate(options, schema) {
    const errorList = [];

    if (schema.paths) {
      Object.keys(schema.paths).forEach((pathKey) => {
        const path = schema.paths[pathKey];

        if (path.parameters) {
          errorList.push(new RuleFailure({ location: `paths.${pathKey}.parameters`, hint: '' }));
        }
      });
    }

    return new List(errorList);
  }
};

module.exports = rule;
