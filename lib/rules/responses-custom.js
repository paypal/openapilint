'use strict';

const _ = require('lodash');
const List = require('immutable').List;

const constants = require('../constants');
const CustomValidator = require('../helpers/CustomValidator');

const rule = {
  description: 'enforce responses comply with custom config constraints',
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

          const responses = operation.responses;

          if (responses) {
            Object.keys(responses).forEach((responseKey) => {
              const response = responses[responseKey];

              myCustomValidator.validateAllCustoms(
                responseKey,
                response,
                `paths.${pathKey}.${operationKey}.responses.${responseKey}`,
                'responses',
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
