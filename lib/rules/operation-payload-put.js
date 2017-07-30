'use strict';

const _ = require('lodash');

const RuleFailure = require('../RuleFailure');
const List = require('immutable').List;

const rule = {
  description: 'enforce the PUT request payload matches the GET 200 response',
  validate(options, schema) {
    const errorList = [];

    if (schema.paths) {
      Object.keys(schema.paths).forEach((pathKey) => {
        const path = schema.paths[pathKey];

        // Path must have get and put to be considered
        if (path.get && path.put) {
          const get200Response = path.get.responses["200"];

          if (!path.put.parameters) {
            errorList.push(new RuleFailure({ location: `paths.${pathKey}.put.parameters`, hint: '' }));
          } else {
            let putBodyParamIndex;
            const putBodyParameter =  _.find(path.put.parameters, (param, paramIndex) => {
              putBodyParamIndex = paramIndex;
              return param.in === 'body';
            });

            const putBodyLocation = `paths.${pathKey}.put.parameters[${putBodyParamIndex}].schema`;

            // report two errors if there are two problems for better usability
            if (!get200Response || !putBodyParameter) {
              if (!get200Response) {
                errorList.push(new RuleFailure({ location: `paths.${pathKey}.get.responses.200`, hint: '' }));
              }

              if (!putBodyParameter) {
                errorList.push(new RuleFailure({ location: `paths.${pathKey}.put.parameters`, hint: '' }));
              }
            } else if (!get200Response.schema || !putBodyParameter.schema) {
              if (!get200Response.schema) {
                errorList.push(new RuleFailure({ location: `paths.${pathKey}.get.responses.200.schema`, hint: '' }));
              }

              if (!putBodyParameter.schema) {
                errorList.push(new RuleFailure({ location: putBodyLocation, hint: '' }));
              }
            } else {
              if (get200Response.schema.$ref && putBodyParameter.schema.$ref) {
                if (get200Response.schema.$ref !== putBodyParameter.schema.$ref) {
                  errorList.push(new RuleFailure({ location: putBodyLocation, hint: '' }));
                } else {
                  // $refs successfully match
                }
              } else if (!_.isEqual(get200Response.schema, putBodyParameter.schema)) {
                errorList.push(new RuleFailure({ location: putBodyLocation, hint: '' }));
              } else {
                // non-$refs successfully match
              }
            }
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
