'use strict';

const _ = require('lodash');

const constants = require('../constants');
const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const rule = {
  description: 'enforce path parameter parity',
  validate(options, schema) {
    const errorList = [];

    if (schema.paths) {
      Object.keys(schema.paths).forEach((pathKey) => {
        const path = schema.paths[pathKey];
        const pathTemplateParameters = [];

        // get object parameters
        _.each(pathKey.split('/'), (param) => {
          if (/^{.*}$/.test(param)) {
            pathTemplateParameters.push(param.slice(1, -1));
          }
        });

        // check each operation
        Object.keys(_.pick(path, constants.httpMethods)).forEach((operationKey) => {
          const operation = path[operationKey];
          let extraPathTemplateParameters = _.clone(pathTemplateParameters);

          if (operation.parameters) {
            operation.parameters.forEach((parameter, parameterIndex) => {
              if (parameter.in === 'path') {
                if (!_.contains(pathTemplateParameters, parameter.name)) {
                  errorList.push(new RuleFailure(
                    {
                      location: `paths.${pathKey}.${operationKey}.parameters[${parameterIndex}]`,
                      hint: `missing from path template: ${parameter.name}`
                    }
                  ));
                } else {
                  // remove validated param name
                  extraPathTemplateParameters =
                    _.without(extraPathTemplateParameters, parameter.name);
                }
              }
            });
          }

          extraPathTemplateParameters.forEach((parameter) => {
            errorList.push(new RuleFailure(
              {
                location: `paths.${pathKey}.${operationKey}`,
                hint: `missing from parameter list: ${parameter}`
              }
            ));
          });
        });
      });
    }

    return new List(errorList);
  }
};

module.exports = rule;
