'use strict';

const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const styles = {
  'spine-case': /^[a-z0-9-]*$/,
  'cap-spine-case': /^[A-Z0-9-]*$/,
  'snake-case': /^[a-z0-9_]*$/
};

function checkPathElement(pathElement, style, pathKey, errorList) {
  if (pathElement === '') {
    errorList.push(new RuleFailure({ location: `paths.${pathKey}`, hint: 'Must not have empty path elements' }));
  } else if (pathElement.indexOf('{') > -1 || pathElement.indexOf('}') > -1) {
    // pathElement must be surrounded by braces with no other braces present.
    if (pathElement.charAt(0) !== '{'
      || pathElement.charAt(pathElement.length - 1) !== '}'
      || pathElement.substr(1).slice(0, 1).indexOf('}') > -1
      || pathElement.substr(1).slice(0, 1).indexOf('{') > -1) {
      errorList.push(new RuleFailure({ location: `paths.${pathKey}`, hint: 'Invalid path param' }));
    } else {
      // found an id. Stop checking.
    }
  } else if (!pathElement.match(styles[style])) {
    errorList.push(new RuleFailure({ location: `paths.${pathKey}`, hint: `"${pathElement}" does not comply with style: "${style}"` }));
  }
}

const rule = {
  description: 'enforce paths that conform to spec, and to a specified input style',
  validate(options, schema) {
    if (!options || !options.style || Object.keys(styles).indexOf(options.style) === -1) {
      throw new Error('Invalid config to path-style specified');
    }

    const errorList = [];

    if (schema.paths) {
      Object.keys(schema.paths).forEach((pathKey) => {
        if (pathKey !== '/') {
          let trimmedPath = pathKey;
          if (!pathKey.startsWith('/')) {
            errorList.push(new RuleFailure({ location: `paths.${pathKey}`, hint: 'Missing a leading slash' }));
          } else {
            trimmedPath = trimmedPath.substr(1);// trim off first slash.
          }

          if (pathKey.endsWith('/')) {
            errorList.push(new RuleFailure({ location: `paths.${pathKey}`, hint: 'Must not have a trailing slash' }));
            trimmedPath = trimmedPath.slice(0, -1); // trim off last slash
          }

          // now check the trimmedPath for the other problems.
          const splitPath = trimmedPath.split('/');
          splitPath.forEach((pathElement) => {
            checkPathElement(pathElement, options.style, pathKey, errorList);
          });
        } else {
          // a path of "/" is ok.
        }
      });
    }

    return new List(errorList);
  }
};

module.exports = rule;
