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
   * @param {Array} applyTo An array of which objects to apply the function to.
   *                The array only allows:
   *                      [ "title", "description", "summary",
   *                        "title-ref-override", and/or "description-ref-override"].
   * @param {Function} textContentFunction The function that checks text content.
   */
  forEachTextField(applyTo, textContentFunction) {
    const applyToTitle = _.includes(applyTo, 'title');
    const applyToDescription = _.includes(applyTo, 'description');
    const applyToSummary = _.includes(applyTo, 'summary');

    if (applyToTitle && this.rootSchema.info && this.rootSchema.info.title) {
      textContentFunction(this.rootSchema.info.title, 'info.title');
    }

    if (applyToDescription && this.rootSchema.info && this.rootSchema.info.description) {
      textContentFunction(this.rootSchema.info.description, 'info.description');
    }

    if (this.rootSchema.paths) {
      const mySchemaObjectParser = new SchemaObjectParser(this.rootSchema);

      mySchemaObjectParser.forEachSchema((schemaObject, pathToSchema) => {
        if (applyToDescription && schemaObject.description) {
          textContentFunction(schemaObject.description, `${pathToSchema}.description`);
        }
        if (applyToTitle && schemaObject.title) {
          textContentFunction(schemaObject.title, `${pathToSchema}.title`);
        }
      },
      undefined,
      (schemaObject, pathToSchema) => {
        const applyToTitleRefOverride = _.includes(applyTo, 'title-ref-override');
        const applyToDescriptionRefOverride = _.includes(applyTo, 'description-ref-override');

        if (applyToTitleRefOverride && schemaObject.title) {
          textContentFunction(schemaObject.title, `${pathToSchema}.title#override`);
        }
        if (applyToDescriptionRefOverride && schemaObject.description) {
          textContentFunction(schemaObject.description, `${pathToSchema}.description#override`);
        }
      });

      Object.keys(this.rootSchema.paths).forEach((pathKey) => {
        const path = this.rootSchema.paths[pathKey];

        // no path descriptions or titles
        Object.keys(_.pick(path, constants.httpMethods)).forEach((operationKey) => {
          const operation = path[operationKey];
          const parameters = operation.parameters;
          const responses = operation.responses;

          if (applyToDescription && operation.description) {
            textContentFunction(operation.description, `paths.${pathKey}.${operationKey}.description`);
          }

          if (applyToSummary && operation.summary) {
            textContentFunction(operation.summary, `paths.${pathKey}.${operationKey}.summary`);
          }

          if (parameters) {
            parameters.forEach((parameter, parameterIndex) => {
              if (applyToDescription && parameter.description) {
                textContentFunction(parameter.description, `paths.${pathKey}.${operationKey}.parameters[${parameterIndex}].description`);
              }
            });
          }

          if (responses) {
            Object.keys(responses).forEach((responseKey) => {
              const response = responses[responseKey];

              if (applyToDescription && response.description) {
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
