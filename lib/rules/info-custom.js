'use strict';

const List = require('immutable').List;

const CustomOptionsValidator = require('../helpers/CustomOptionsValidator');

const rule = {
  description: 'enforce info object complies with custom config constraints',
  validate(options, schema) {
    const errorList = [];

    const customOptionsValidator = new CustomOptionsValidator(options, schema, errorList);

    customOptionsValidator.validateOptions();

    if (schema.info) {
      customOptionsValidator.validateAllCustoms('info', schema.info, 'info', 'info', () => true);
    }

    return new List(errorList);
  }
};

module.exports = rule;
