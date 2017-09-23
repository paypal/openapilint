'use strict';

const constants = require('../constants');
const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

/**
 * Checks the path element for compliance.  A path element is anything between the forward slashes.
 *
 * @param {Object} pathElement The path element being checked.
 * @param {Object} caseOption The expected case of the path element.
 * @param {Object} pathKey The entire path key used for logging errors.
 * @param {Object} errorList The local list of errors.
 */
function checkPathElement(pathElement, caseOption, pathKey, errorList) {
  if (pathElement === '') {
    errorList.push(new RuleFailure({ location: `paths.${pathKey}`, hint: 'Must not have empty path elements' }));
  } else if (pathElement.match(constants.reValidPathTemplateParam)) {
    // found a valid template id. Stop checking.
  } else if (!pathElement.match(constants.caseStyles[caseOption])) {
    errorList.push(new RuleFailure({ location: `paths.${pathKey}`, hint: `"${pathElement}" does not comply with case: "${caseOption}"` }));
  }
}

const rule = {
  description: 'enforce paths that conform to spec, and to a specified input case style',
  validate(options, schema) {
    if (!options
      || !options.case
      || Object.keys(constants.caseStyles).indexOf(options.case) === -1) {
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
          checkPathElement(pathElement, options.case, pathKey, errorList);
        });
      });
    }

    return new List(errorList);
  }
};

module.exports = rule;
