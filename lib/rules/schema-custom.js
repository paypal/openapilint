'use strict';

const List = require('immutable').List;

const CustomValidator = require('../helpers/CustomValidator');
const SchemaObjectParser = require('../helpers/SchemaObjectParser');

const rule = {
  description: 'enforce schema objects comply with custom config constraints',
  validate(options, schema) {
    const errorList = [];

    const myCustomValidator = new CustomValidator(options, schema, errorList);
    const mySchemaObjectParser = new SchemaObjectParser(schema, errorList);

    myCustomValidator.validateOptions();
    mySchemaObjectParser.forEachSchema((schemaObject, pathToSchema) => {
      myCustomValidator.validateAllCustoms(undefined, schemaObject, pathToSchema, 'schema',
        // returning true indicates the rule should be run.
        option =>
          schemaObject.openapilintType === undefined
            || (!!option.alsoApplyTo
              && option.alsoApplyTo.indexOf(schemaObject.openapilintType) > -1)
      );
    });

    return new List(errorList);
  }
};

module.exports = rule;
