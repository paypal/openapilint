'use strict';

const _ = require('lodash');

const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

/**
 * Returns true if get is valid enough to compare.  Inserts errors and returns false if not.
 */
function validateGet(pathKey, get, errorList) {
  let isValid = false;

  const get200Response = get.responses['200'];
  if (!get200Response) {
    errorList.push(new RuleFailure({ location: `paths.${pathKey}.get.responses.200`, hint: 'Missing 200 response' }));
  } else if (!get200Response.schema) {
    errorList.push(new RuleFailure({ location: `paths.${pathKey}.get.responses.200.schema`, hint: 'Missing 200 response schema' }));
  } else {
    isValid = true;
  }

  return isValid;
}

/**
 * Returns an object with info about the put parameter.  Inserts errors and sets isValid to false if not valid.
 */
function validatePut(pathKey, put, errorList) {
  let isValid = false;
  let putBodyLocation;
  let putBodyParamIndex;

  if (!put.parameters) {
    errorList.push(new RuleFailure({ location: `paths.${pathKey}.put.parameters`, hint: 'Missing put parameters' }));
  } else {
    const putBodyParameter = _.find(put.parameters, (param, paramIndex) => {
      putBodyParamIndex = paramIndex;
      return param.in === 'body';
    });

    putBodyLocation = `paths.${pathKey}.put.parameters[${putBodyParamIndex}].schema`;
    if (!putBodyParameter) {
      errorList.push(new RuleFailure({ location: `paths.${pathKey}.put.parameters`, hint: 'Missing put parameters body' }));
    } else if (!putBodyParameter.schema) {
      errorList.push(new RuleFailure({ location: putBodyLocation, hint: 'Missing put parameters body schema' }));
    } else {
      isValid = true;
    }
  }

  // return complex object as a cache of fields that have already been fetched
  return {
    isValid,
    putBodyLocation,
    putBodyParamIndex
  };
}

const rule = {
  description: 'enforce the PUT request payload matches the GET 200 response',
  validate(options, schema) {
    const errorList = [];

    if (schema.paths) {
      Object.keys(schema.paths).forEach((pathKey) => {
        const path = schema.paths[pathKey];

        // Path must have get and put to be considered
        if (path.get && path.put) {
          const validGet = validateGet(pathKey, path.get, errorList);
          const validatePutResponse = validatePut(pathKey, path.put, errorList);

          if (validGet && validatePutResponse.isValid) {
            const getSchema = path.get.responses['200'].schema;
            const putSchema = path.put.parameters[validatePutResponse.putBodyParamIndex].schema;
            if (getSchema.$ref && putSchema.$ref) {
              if (getSchema.$ref !== putSchema.$ref) {
                errorList.push(new RuleFailure({ location: validatePutResponse.putBodyLocation, hint: 'Does not match' }));
              } else {
                // $refs successfully match
              }
            } else if (!_.isEqual(getSchema, putSchema)) {
              errorList.push(new RuleFailure({ location: validatePutResponse.putBodyLocation, hint: 'Does not match' }));
            } else {
              // non-$refs successfully match
            }
          } else {
            // errors are already inserted for invalid cases in validate*() methods above.
          }
        } else {
          // Ignore operations without both put/get
        }
      });
    }

    return new List(errorList);
  }
};

module.exports = rule;
