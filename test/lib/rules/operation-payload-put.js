'use strict';

const _ = require('lodash');
const assert = require('chai').assert;
const operationPayloadPutRule = require('../../../lib/rules/operation-payload-put');

describe('operation-payload-put', () => {
  const options = true;

  // validSchema is used as the base for all tests to make them easier to read.
  const validSchema = {
    paths: {
      '/pets': {
        get: {
          responses: {
            200: {
              schema: {
                $ref: '#/definitions/pet'
              }
            }
          }
        },
        put: {
          parameters: [
            {
              in: 'body',
              schema: {
                $ref: '#/definitions/pet'
              }
            }
          ]
        },
        parameters: []
      }
    }
  };

  it('should not report errors when the put request body parameter matches a get response', (done) => {
    const failures = operationPayloadPutRule.validate(options, validSchema);

    assert.equal(failures.size, 0);
    done();
  });

  it('should report error when valid put request body parameter does not match its valid get response', (done) => {
    const schema = _.cloneDeep(validSchema);

    schema.paths['/pets'].put.parameters[0].schema.$ref = '#/definitions/alligator';

    const failures = operationPayloadPutRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets.put.parameters[0].schema');
    assert.equal(failures.get(0).get('hint'), 'Does not match');
    done();
  });

  it('should report error when get 200 response is missing', (done) => {
    const schema = _.cloneDeep(validSchema);

    schema.paths['/pets'].get.responses['200'] = undefined;

    const failures = operationPayloadPutRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets.get.responses.200');
    assert.equal(failures.get(0).get('hint'), 'Missing 200 response');
    done();
  });

  it('should report error when get 200 schema is missing', (done) => {
    const schema = _.cloneDeep(validSchema);

    schema.paths['/pets'].get.responses['200'].schema = undefined;

    const failures = operationPayloadPutRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets.get.responses.200.schema');
    assert.equal(failures.get(0).get('hint'), 'Missing 200 response schema');
    done();
  });

  it('should report error when put parameters is missing', (done) => {
    const schema = _.cloneDeep(validSchema);

    schema.paths['/pets'].put.parameters = undefined;

    const failures = operationPayloadPutRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets.put.parameters');
    assert.equal(failures.get(0).get('hint'), 'Missing put parameters');
    done();
  });

  it('should report error when put parameters body is missing', (done) => {
    const schema = _.cloneDeep(validSchema);

    schema.paths['/pets'].put.parameters = [];

    const failures = operationPayloadPutRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets.put.parameters');
    assert.equal(failures.get(0).get('hint'), 'Missing put parameters body');
    done();
  });

  it('should report error when put parameters body schema is missing', (done) => {
    const schema = _.cloneDeep(validSchema);

    schema.paths['/pets'].put.parameters[0].schema = undefined;

    const failures = operationPayloadPutRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets.put.parameters[0].schema');
    assert.equal(failures.get(0).get('hint'), 'Missing put parameters body schema');
    done();
  });

  it('should report two errors when put and get are missing something', (done) => {
    const schema = _.cloneDeep(validSchema);

    schema.paths['/pets'].get.responses['200'] = undefined;
    schema.paths['/pets'].put.parameters[0].schema = undefined;

    const failures = operationPayloadPutRule.validate(options, schema);

    assert.equal(failures.size, 2);
    assert.equal(failures.get(0).get('location'), 'paths./pets.get.responses.200');
    assert.equal(failures.get(0).get('hint'), 'Missing 200 response');
    assert.equal(failures.get(1).get('location'), 'paths./pets.put.parameters[0].schema');
    assert.equal(failures.get(1).get('hint'), 'Missing put parameters body schema');
    done();
  });

  it('should report two errors when put and get are missing other things', (done) => {
    const schema = _.cloneDeep(validSchema);

    schema.paths['/pets'].get.responses['200'].schema = undefined;
    schema.paths['/pets'].put.parameters = [];

    const failures = operationPayloadPutRule.validate(options, schema);

    assert.equal(failures.size, 2);
    assert.equal(failures.get(0).get('location'), 'paths./pets.get.responses.200.schema');
    assert.equal(failures.get(0).get('hint'), 'Missing 200 response schema');
    assert.equal(failures.get(1).get('location'), 'paths./pets.put.parameters');
    assert.equal(failures.get(1).get('hint'), 'Missing put parameters body');
    done();
  });
});
