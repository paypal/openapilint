'use strict';

const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const rule = {
  description: 'enforce paths that conform to spec, and to a specified input style',
  validate(options, schema) {
    const styles = ['spine-case', 'cap-spine-case', 'snake-case', 'camel-case', 'proper-case'];
    if (!options || !options.style || styles.indexOf(options.style) === -1) {
      throw new Error('Invalid config to path-style specified');
    }

    const errorList = [];

    if (schema.paths) {
      Object.keys(schema.paths).forEach((pathKey) => {
        // const trimmedPath = pathKey;
        if (!pathKey.startsWith('/')) {
          errorList.push(new RuleFailure({ location: `paths.${pathKey}`, hint: 'Missing a leading slash' }));
          // trimmedPath = pathKey.// trim off first char.
        }

        if (pathKey.endsWith('/')) {
          errorList.push(new RuleFailure({ location: `paths.${pathKey}`, hint: 'Must not have a trailing slash' }));
          // trim off last char
        }

        // now check the trimmedPath for the other stuff.
      });
    }

    return new List(errorList);
  }
};

module.exports = rule;
