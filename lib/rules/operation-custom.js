'use strict';

const _ = require('lodash');
const List = require('immutable').List;

const constants = require('../constants');
const CustomOptionsValidator = require('../helpers/CustomOptionsValidator');

const rule = {
  description: 'enforce operation objects comply with custom config constraints',
  validate(options, schema) {
    const errorList = [];

    const customOptionsValidator = new CustomOptionsValidator(options, schema, errorList);

    customOptionsValidator.validateOptions();

    if (schema.paths) {
      Object.keys(schema.paths).forEach((pathKey) => {
        const path = schema.paths[pathKey];

        Object.keys(_.pick(path, constants.httpMethods)).forEach((operationKey) => {
          const operationObject = path[operationKey];

          customOptionsValidator.validateAllCustoms(operationKey, operationObject, `paths.${pathKey}.${operationKey}`, 'operation', () => true);
        });
      });
    }

    return new List(errorList);
  }
};

module.exports = rule;
