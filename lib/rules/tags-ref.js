'use strict';

const _ = require('lodash');

const constants = require('../constants');
const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const rule = {
  description: 'enforce operation tags are present in root level tags',
  validate(options, schema) {
    const errorList = [];

    if (schema.paths) {
      let tagNames;
      if (schema.tags) {
        tagNames = schema.tags.map(tag => tag.name);
      } else {
        tagNames = [];
      }

      Object.keys(schema.paths).forEach((pathKey) => {
        const path = schema.paths[pathKey];

        Object.keys(_.pick(path, constants.httpMethods)).forEach((operationKey) => {
          const operation = path[operationKey];

          if (operation.tags) {
            operation.tags.forEach((tag, tagIndex) => {
              if (!_.includes(tagNames, tag)) {
                errorList.push(new RuleFailure({ location: `paths.${pathKey}.${operationKey}.tags[${tagIndex}]`, hint: '' }));
              }
            });
          } else {
            // no tags to check
          }
        });
      });
    }

    return new List(errorList);
  }
};

module.exports = rule;
