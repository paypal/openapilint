'use strict';

const _ = require('lodash');
const List = require('immutable').List;

const constants = require('../constants');
const CustomValidator = require('../helpers/CustomValidator');

const rule = {
  description: 'enforce operation objects comply with custom config constraints',
  validate(options, schema) {
    const errorList = [];

    const myCustomValidator = new CustomValidator(options, schema, errorList);

    myCustomValidator.validateOptions();

    if (schema.paths) {
      Object.keys(schema.paths).forEach((pathKey) => {
        const path = schema.paths[pathKey];

        Object.keys(_.pick(path, constants.httpMethods)).forEach((operationKey) => {
          const operationObject = path[operationKey];

          myCustomValidator.validateAllCustoms(operationKey, operationObject, `paths.${pathKey}.${operationKey}`, 'operation', () => true);
        });
      });
    }

    return new List(errorList);
  }
};

module.exports = rule;
