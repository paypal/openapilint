'use strict';

const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const rule = {
  description: 'enforce existence and non-empty operation tags',
  validate(options, schema) {
    const errorList = [];

    if (schema.paths) {
      Object.keys(schema.paths).forEach((pathKey) => {
        const path = schema.paths[pathKey];

        // no path descriptions or titles
        Object.keys(path).forEach((operationKey) => {
          const operation = path[operationKey];

          if (operation.tags) {
            if (operation.tags.length === 0) {
              errorList.push(new RuleFailure({ location: `paths.${pathKey}.${operationKey}.tags`, hint: '' }));
            } else {
              // success, yay!
            }
          } else {
            errorList.push(new RuleFailure({ location: `paths.${pathKey}.${operationKey}`, hint: '' }));
          }
        });
      });
    }

    return new List(errorList);
  }
};

module.exports = rule;
