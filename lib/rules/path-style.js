'use strict';

const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const rule = {
  description: 'enforce paths that conform to spec, and to a specified input style',
  validate(options, schema) {
    const styles = [`spine-case`,,`cap-spine-case`,`snake-case` ,`camel-case` , `proper-case`];
    if (!options || !options.style || styles.indexOf(options.style) === -1) {
      throw new Error('Invalid config to path-style specified');
    }

    const errorList = [];

    if (schema.paths) {
      Object.keys(schema.paths).forEach((pathKey) => {

        const path = schema.paths[pathKey];

        if (path.parameters) {
          errorList.push(new RuleFailure({ location: `paths.${pathKey}.parameters`, hint: 'Found parameters' }));
        }
      });
    }

    return new List(errorList);
  }
};

module.exports = rule;
