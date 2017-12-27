'use strict';

const List = require('immutable').List;

const CustomValidator = require('../helpers/CustomValidator');

const rule = {
  description: 'enforce info object complies with custom config constraints',
  validate(options, schema) {
    const errorList = [];

    const myCustomValidator = new CustomValidator(options, schema, errorList);

    myCustomValidator.validateOptions();

    if (schema.info) {
      myCustomValidator.validateAllCustoms('info', schema.info, 'info', 'info', () => true);
    }

    return new List(errorList);
  }
};

module.exports = rule;
