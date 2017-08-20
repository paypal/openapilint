'use strict';

const _ = require('lodash');

const constants = require('../constants');
const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

function extractVisibility(field, selector, defaultVisibility) {
  try {
    return _.reduce(selector, (selectedObject, value) => selectedObject[value], field);
  } catch (err) {
    return defaultVisibility;
  }
}

const rule = {
  description: 'enforce consistent visibility of parameters',
  validate(config, schema) {
    const errorList = [];

    // TODO validate config
    const orderedOptions = config.orderedOptions;
    const selector = config.selector;
    const defaultVisibility = config.default;

    if (schema.paths) {
      Object.keys(schema.paths).forEach((pathKey) => {
        const path = schema.paths[pathKey];

        Object.keys(_.pick(path, constants.httpMethods)).forEach((operationKey) => {
          const operation = path[operationKey];
          const operationVisibility = extractVisibility(operation, selector, defaultVisibility);

          if (operation.parameters) {
            operation.parameters.forEach((parameter, parameterIndex) => {
              const paramVisibility = extractVisibility(parameter, selector);
              if (orderedOptions.indexOf(paramVisibility)
                > orderedOptions.indexOf(operationVisibility)) {
                errorList.push(new RuleFailure(
                  {
                    location: `paths.${pathKey}.parameters[${parameterIndex}]`,
                    hint: `${paramVisibility} more visible than parent ${operationVisibility}`
                  }
                ));
              }
            });
          }
        });
      });
    }

    return new List(errorList);
  }
};

module.exports = rule;
