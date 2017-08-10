'use strict';

const _ = require('lodash');

const constants = require('../constants');
const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const rule = {
  description: 'enforce present and non-empty operation tags array',
  validate(options, schema) {
    const errorList = [];

    if (schema.paths) {
      Object.keys(schema.paths).forEach((pathKey) => {
        const path = schema.paths[pathKey];

        Object.keys(_.pick(path, constants.httpMethods)).forEach((operationKey) => {
          const operation = path[operationKey];

          if (operation.tags) {
            if (operation.tags.length === 0) {
              errorList.push(new RuleFailure({ location: `paths.${pathKey}.${operationKey}.tags`, hint: 'Empty tags' }));
            } else {
              // success, yay!
            }
          } else {
            errorList.push(new RuleFailure({ location: `paths.${pathKey}.${operationKey}`, hint: 'Missing tags' }));
          }
        });
      });
    }

    return new List(errorList);
  }
};

module.exports = rule;
