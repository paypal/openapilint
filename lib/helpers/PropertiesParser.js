'use strict';

const _ = require('lodash');

const RuleFailure = require('../RuleFailure');
const constants = require('../constants');

class PropertiesParser {
  constructor(rootSchema, errorList) {
    this.rootSchema = rootSchema;
    this.errorList = errorList;
  }

  /**
   * Validates the schemaObject (not the global schema).
   *
   * @param {Function} propertyFunction The function that checks properties.
   * @param {Object} schemaObject The schema object being checked.
   * @param {Object} pathToSchema The path to the schema used for error messages.
   */
  checkSchemaObject(propertyFunction, schemaObject, pathToSchema) {
    if (!schemaObject) {
      return;
    }

    if (schemaObject.$ref && !_.includes(this.visitedRefs, schemaObject.$ref)) {
      this.visitedRefs.push(schemaObject.$ref);
      if (schemaObject.$ref.startsWith('#/definitions/')) {
        const trimmedRef = schemaObject.$ref.substr(2);
        const splitRef = trimmedRef.split('/');

        const referencedSchema = this.rootSchema.definitions[splitRef[1]];

        this.checkSchemaObject(propertyFunction, referencedSchema, pathToSchema);
      } else {
        this.errorList.push(new RuleFailure({
          location: `${pathToSchema}`,
          hint: 'Found a non-internal reference'
        }));
      }
    } else if (schemaObject.type === 'object' && schemaObject.properties) {
      Object.keys(schemaObject.properties).forEach((propertyKey) => {
        const propertyObject = schemaObject.properties[propertyKey];

        propertyFunction(propertyKey, propertyObject, `${pathToSchema}.properties.${propertyKey}`);

        this.checkSchemaObject(propertyFunction, propertyObject, pathToSchema);
      });
    } else if (schemaObject.type === 'array' && schemaObject.items) {
      this.checkSchemaObject(propertyFunction, schemaObject.items, `${pathToSchema}.items`);
    }

    if (schemaObject.allOf) {
      schemaObject.allOf.forEach((allOfValue, allOfIndex) => {
        this.checkSchemaObject(propertyFunction, allOfValue, `${pathToSchema}.allOf[${allOfIndex}]`);
      });
    }
  }

  forEachProperty(propertyFunction) {
    this.visitedRefs = [];
    if (this.rootSchema.paths) {
      Object.keys(this.rootSchema.paths).forEach((pathKey) => {
        const path = this.rootSchema.paths[pathKey];

        // check each operation
        Object.keys(_.pick(path, constants.httpMethods)).forEach((operationKey) => {
          const operation = path[operationKey];

          if (operation.parameters) {
            operation.parameters.forEach((parameter, parameterIndex) => {
              this.checkSchemaObject(propertyFunction, parameter.schema, `paths.${pathKey}.${operationKey}.parameters[${parameterIndex}].schema`);
            });
          }

          if (operation.responses) {
            Object.keys(operation.responses).forEach((responseKey) => {
              const response = operation.responses[responseKey];

              this.checkSchemaObject(propertyFunction, response.schema, `paths.${pathKey}.${operationKey}.responses.${responseKey}.schema`);
            });
          }
        });
      });
    }
  }

  getVisitedRefs() {
    if (!this.visitedRefs) {
      // visit each node so that the visitedRefs get initialized.
      this.forEachProperty(() => {});
    }

    return this.visitedRefs;
  }
}

module.exports = PropertiesParser;
