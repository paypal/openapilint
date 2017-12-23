'use strict';

const _ = require('lodash');

const constants = require('../constants');
const SchemaObjectParser = require('../helpers/SchemaObjectParser');

class TextParser {
  constructor(rootSchema) {
    this.rootSchema = rootSchema;
  }

  /**
   * Runs the propertyFunction for each property found.
   *
   * @param {Function} textContentFunction The function that checks text content.
   */
  forEachTextField(textContentFunction) {
    if (this.rootSchema.info && this.rootSchema.info.title) {
      textContentFunction(this.rootSchema.info.title, 'info.title');
    }

    if (this.rootSchema.info && this.rootSchema.info.description) {
      textContentFunction(this.rootSchema.info.description, 'info.description');
    }

    if (this.rootSchema.paths) {
      const mySchemaObjectParser = new SchemaObjectParser(this.rootSchema);

      mySchemaObjectParser.forEachSchema((schemaObject, pathToSchema) => {
        if (schemaObject.description) {
          textContentFunction(schemaObject.description, `${pathToSchema}.description`);
        }
        if (schemaObject.title) {
          textContentFunction(schemaObject.title, `${pathToSchema}.title`);
        }
      });

      Object.keys(this.rootSchema.paths).forEach((pathKey) => {
        const path = this.rootSchema.paths[pathKey];

        // no path descriptions or titles
        Object.keys(_.pick(path, constants.httpMethods)).forEach((operationKey) => {
          const operation = path[operationKey];
          const parameters = operation.parameters;
          const responses = operation.responses;

          if (operation.description) {
            textContentFunction(operation.description, `paths.${pathKey}.${operationKey}.description`);
          }

          if (operation.summary) {
            textContentFunction(operation.summary, `paths.${pathKey}.${operationKey}.summary`);
          }

          if (parameters) {
            parameters.forEach((parameter, parameterIndex) => {
              if (parameter.description) {
                textContentFunction(parameter.description, `paths.${pathKey}.${operationKey}.parameters[${parameterIndex}].description`);
              }
            });
          }

          if (responses) {
            Object.keys(responses).forEach((responseKey) => {
              const response = responses[responseKey];

              if (response.description) {
                textContentFunction(response.description, `paths.${pathKey}.${operationKey}.responses.${responseKey}.description`);
              }
            });
          }
        });
      });
    }
  }
}

module.exports = TextParser;
