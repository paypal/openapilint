'use strict';

const List = require('immutable').List;

const SchemaObjectParser = require('../helpers/SchemaObjectParser');

const rule = {
  description: 'enforce schema objects comply with custom config constraints',
  validate(options, schema) {
    const errorList = [];

    const mySchemaObjectParser = new SchemaObjectParser(schema, errorList);

    myCustomValidator.validateOptions();
    mySchemaObjectParser.forEachSchema((schemaObject, pathToSchema) => {
      console.log(schemaObject);
      console.log(schemaObject["readOnly"]);
      if (schemaObject["readOnly"]) {
        
      }
    });

    return new List(errorList);
  }
};

module.exports = rule;
