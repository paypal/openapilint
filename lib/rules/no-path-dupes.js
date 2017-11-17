'use strict';

const _ = require('lodash');

const constants = require('../constants');
const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const rule = {
  description: 'enforce paths are logically unique',
  validate(options, schema) {
    const errorList = [];

    if (schema.paths) {
      const normalizedPaths = [];

      Object.keys(schema.paths).forEach((pathKey) => {
        // construct a normalized path
        let normalizedPath = '';

        _.each(pathKey.split('/'), (param, index) => {
          if (param.match(constants.reValidPathTemplateParam)) {
            normalizedPath += `/{pathTemplate${index}}`;
          } else {
            normalizedPath += `/${param}`;
          }
        });

        // error if normalized path already exists
        if (_.includes(normalizedPaths, normalizedPath)) {
          errorList.push(new RuleFailure({ location: `paths.${pathKey}`, hint: 'Found duplicate path' }));
        } else {
          normalizedPaths.push(normalizedPath);
        }
      });
    }

    return new List(errorList);
  }
};

module.exports = rule;
