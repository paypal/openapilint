'use strict';

const _ = require('lodash');

const RuleFailure = require('../RuleFailure');
const constants = require('../constants');

class SchemaObjectParser {
  constructor(rootSchema, errorList) {
    this.rootSchema = rootSchema;
    this.errorList = errorList;
  }

  /**
   * Validates the schemaObject (not the global schema).
   *
   * @param {Function} schemaFunction The function that checks schema objects. Can be undefined.
   * @param {Function} propertyFunction The function that checks properties. Can be undefined.
   * @param {Function} refFunction The function that checks schemas pointing to a $ref.
  *                               Can be undefined.
   * @param {Object} schemaObject The schema object being checked.
   * @param {Object} pathToSchema The path to the schema used for error messages.
   */
  checkSchemaObject(schemaFunction, propertyFunction, refFunction, schemaObject, pathToSchema) {
    if (!schemaObject) {
      return;
    }

    if (schemaObject.$ref) {
      if (_.includes(this.visitedRefs, schemaObject.$ref)) {
        // found a ref that's already been visited. Skip it.
        return;
      }
      this.visitedRefs.push(schemaObject.$ref);

      if (refFunction) {
        refFunction(schemaObject, pathToSchema);
      }

      if (schemaObject.$ref.startsWith('#/definitions/')) {
        const trimmedRef = schemaObject.$ref.substr(2);
        const splitRef = trimmedRef.split('/');

        const referencedSchema = this.rootSchema.definitions[splitRef[1]];

        this.checkSchemaObject(
          schemaFunction, propertyFunction, refFunction, referencedSchema, pathToSchema);
      } else {
        this.errorList.push(new RuleFailure({
          location: `${pathToSchema}`,
          hint: 'Found a non-internal reference'
        }));
      }
    } else {
      // found a schema, not a ref.
      if (schemaFunction) {
        schemaFunction(schemaObject, pathToSchema);
      }

      if (schemaObject.type === 'object' || schemaObject.openapilintType === 'allOf') {
        if (schemaObject.properties) {
          Object.keys(schemaObject.properties).forEach((propertyKey) => {
            const propertyObject = schemaObject.properties[propertyKey];
            const pathToProperty = `${pathToSchema}.properties.${propertyKey}`;

            if (propertyFunction) {
              propertyFunction(propertyKey, propertyObject, pathToProperty);
            }

            this.checkSchemaObject(
              schemaFunction, propertyFunction, refFunction, propertyObject, pathToProperty);
          });
        }
      } else if (schemaObject.type === 'array' && schemaObject.items) {
        this.checkSchemaObject(schemaFunction, propertyFunction, refFunction, schemaObject.items, `${pathToSchema}.items`);
      }
    }

    if (schemaObject.allOf) {
      schemaObject.allOf.forEach((allOfValue, allOfIndex) => {
        const implicitAllOfValue = allOfValue;

        // allOfs can include pieces that aren't defined within a full object type.
        // Therefore, assign it a special flag for the purposes of checking all properties.
        implicitAllOfValue.openapilintType = 'allOf';
        this.checkSchemaObject(schemaFunction, propertyFunction, refFunction, implicitAllOfValue, `${pathToSchema}.allOf[${allOfIndex}]`);
      });
    }
  }

  /**
   * Runs the propertyFunction for each property found.
   *
   * @param {Function} schemaFunction The function that checks schema objects. Can be undefined.
   * @param {Function} propertyFunction The function that checks properties. Can be undefined.
   * @param {Function} refFunction The function that checks schemas pointing to a $ref.
   *                               Can be undefined.
   */
  forEachSchema(schemaFunction, propertyFunction, refFunction) {
    this.visitedRefs = [];
    if (this.rootSchema.paths) {
      Object.keys(this.rootSchema.paths).forEach((pathKey) => {
        const path = this.rootSchema.paths[pathKey];

        // check each operation
        Object.keys(_.pick(path, constants.httpMethods)).forEach((operationKey) => {
          const operation = path[operationKey];

          if (operation.parameters) {
            operation.parameters.forEach((parameter, parameterIndex) => {
              this.checkSchemaObject(schemaFunction, propertyFunction, refFunction, parameter.schema, `paths.${pathKey}.${operationKey}.parameters[${parameterIndex}].schema`);
            });
          }

          if (operation.responses) {
            Object.keys(operation.responses).forEach((responseKey) => {
              const response = operation.responses[responseKey];

              this.checkSchemaObject(schemaFunction, propertyFunction, refFunction, response.schema, `paths.${pathKey}.${operationKey}.responses.${responseKey}.schema`);
            });
          }
        });
      });
    }
  }

  /**
   * Runs the propertyFunction for each property found.
   *
   * @param {Function} propertyFunction The function that checks properties.
   */
  forEachProperty(propertyFunction) {
    this.forEachSchema(undefined, propertyFunction);
  }

  /**
   * Returns the list of all visited refs. Useful for checking orphans.
   *
   * @returns {array} the array of all visited refs.
   */
  getVisitedRefs() {
    if (!this.visitedRefs) {
      // visit each node so that the visitedRefs get initialized.
      this.forEachProperty();
    }

    return this.visitedRefs;
  }
}

module.exports = SchemaObjectParser;
