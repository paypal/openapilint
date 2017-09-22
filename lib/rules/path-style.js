'use strict';

const constants = require('../constants');
const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;


function checkPathElement(pathElement, style, pathKey, errorList) {
  if (pathElement === '') {
    errorList.push(new RuleFailure({ location: `paths.${pathKey}`, hint: 'Must not have empty path elements' }));
  } else if (pathElement.match(constants.reValidPathTemplateParam)) {
    // found a valid template id. Stop checking.
  } else if (!pathElement.match(constants.styles[style])) {
    errorList.push(new RuleFailure({ location: `paths.${pathKey}`, hint: `"${pathElement}" does not comply with style: "${style}"` }));
  }
}

const rule = {
  description: 'enforce paths that conform to spec, and to a specified input style',
  validate(options, schema) {
    if (!options || !options.style || Object.keys(constants.styles).indexOf(options.style) === -1) {
      throw new Error('Invalid config to path-style specified');
    }

    const errorList = [];

    if (schema.paths) {
      Object.keys(schema.paths).forEach((pathKey) => {
        if (pathKey === '/') {
          // a path of "/" is ok.
          return;
        }

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
      });
    }

    return new List(errorList);
  }
};

module.exports = rule;
