'use strict';

const assert = require('chai').assert;
const operationTagsRule = require('../../../lib/rules/operation-tags');

describe('operation-tags', () => {
  const options = true;

  it('should not report errors when all operations have non-empty tags', (done) => {
    const schema = {
      paths: {
        '/pets': {
          get: {
            tags: ['pet']
          },
          put: {
            tags: ['pet']
          },
          parameters: []
        },
        '/people': {
          parameters: [],
          get: {
            tags: ['person']
          }
        }
      }
    };

    const failures = operationTagsRule.validate(options, schema);

    assert.equal(failures.size, 0);
    done();
  });

  it('should report error when one operation tags is not present', (done) => {
    const schema = {
      paths: {
        '/pets': {
          get: {
          }
        }
      }
    };

    const failures = operationTagsRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets.get');
    assert.equal(failures.get(0).get('hint'), '');
    done();
  });

  it('should report error when one operation tags is empty', (done) => {
    const schema = {
      paths: {
        '/pets': {
          get: {
            tags: []
          }
        }
      }
    };

    const failures = operationTagsRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets.get.tags');
    assert.equal(failures.get(0).get('hint'), '');
    done();
  });
});
