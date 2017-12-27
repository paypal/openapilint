'use strict';

const _ = require('lodash');

const List = require('immutable').List;

const constants = require('../constants');
const CustomValidator = require('../helpers/CustomValidator');

const rule = {
  description: 'enforce parameters comply with custom config constraints',
  validate(options, schema) {
    const errorList = [];

    const myCustomValidator = new CustomValidator(options, schema, errorList);

    myCustomValidator.validateOptions();

    if (schema.paths) {
      Object.keys(schema.paths).forEach((pathKey) => {
        const path = schema.paths[pathKey];

        // check each operation
        Object.keys(_.pick(path, constants.httpMethods)).forEach((operationKey) => {
          const operation = path[operationKey];

          if (operation.parameters) {
            operation.parameters.forEach((parameter, parameterIndex) => {
              myCustomValidator.validateAllCustoms(
                undefined, // parameters have no key name coming from a list.
                parameter,
                `paths.${pathKey}.${operationKey}.parameters[${parameterIndex}]`,
                'parameter',
                () => true
              );
            });
          }
        });
      });
    }

    return new List(errorList);
  }
};

module.exports = rule;
