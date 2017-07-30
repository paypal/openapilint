'use strict';

const assert = require('chai').assert;
const operationPayloadPutRule = require('../../../lib/rules/operation-payload-put');

describe('operation-tags', () => {
  const options = true;

  it('should not report errors when the put request body parameter matches a get response', (done) => {
    const schema = {
      "paths": {
        "/pets": {
          "get": {
            "responses": {
              "200": {
                "description": "sample response",
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/definitions/pet"
                  }
                }
              }
            }
          },
          "put": {
            "parameters": [
              {
                "name": "limit",
                "description": "Sample param description",
                "in": "body",
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/definitions/pet"
                  }
                }
              }
            ]
          }
        }
      }
    };

    const failures = operationPayloadPutRule.validate(options, schema);

    assert.equal(failures.size, 0);
    done();
  });

  it('should report error when an operation\'s put request body parameter does not match its get response', (done) => {
    const schema = {
      "paths": {
        "/pets": {
          "get": {
            "responses": {
              "200": {
                "description": "sample response",
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/definitions/pet"
                  }
                }
              }
            }
          },
          "put": {
            "parameters": [
              {
                "name": "limit",
                "description": "Sample param description",
                "in": "body",
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/definitions/alligator"
                  }
                }
              }
            ]
          }
        }
      }
    };

    const failures = operationPayloadPutRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets.put.parameters[0].schema');
    assert.equal(failures.get(0).get('hint'), '');
    done();
  });
});
