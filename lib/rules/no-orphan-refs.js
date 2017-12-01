'use strict';

const _ = require('lodash');

const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const SchemaObjectParser = require('../helpers/SchemaObjectParser');

const rule = {
  description: 'enforce all refs are reachable',
  validate(options, schema) {
    const errorList = [];
    const mySchemaObjectParser = new SchemaObjectParser(schema, errorList);

    const visitedRefsList = mySchemaObjectParser.getVisitedRefs();

    if (schema.definitions) {
      Object.keys(schema.definitions).forEach((definition) => {
        const definitionPath = `#/definitions/${definition}`;

        if (!_.include(visitedRefsList, definitionPath)) {
          errorList.push(new RuleFailure({
            location: `definitions.${definition}`,
            hint: 'Definition is not reachable'
          }));
        }
      });
    }

    // TODO check other referenced fields once this project supports them.

    return new List(errorList);
  }
};

module.exports = rule;
