'use strict';

const _ = require('lodash');
const List = require('immutable').List;

const constants = require('../constants');

const CustomOptionsValidator = require('../helpers/CustomOptionsValidator');

const rule = {
  description: 'enforce responses comply with custom config constraints',
  validate(options, schema) {
    const errorList = [];

    const customOptionsValidator = new CustomOptionsValidator(options, schema, errorList);

    customOptionsValidator.validateOptions();

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

              customOptionsValidator.validateAllCustoms(
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
