'use strict';

const assert = require('chai').assert;
const noPathItemParametersRule = require('../../../lib/rules/no-path-item-parameters');

describe('no-path-item-parameters', () => {
  const options = true;

  it('should not report errors when all paths do not have parameters', () => {
    const schema = {
      paths: {
        '/pets': {
          get: {
          },
          put: {
          }
        },
        '/people': {
          get: {
          }
        }
      }
    };

    const failures = noPathItemParametersRule.validate(options, schema);

    assert.equal(failures.size, 0);
  });

  it('should report two errors when two paths have parameters', () => {
    const schema = {
      paths: {
        '/pets': {
          get: {
          },
          put: {
          },
          parameters: []
        },
        '/people': {
          parameters: []
        }
      }
    };

    const failures = noPathItemParametersRule.validate(options, schema);

    assert.equal(failures.size, 2);
    assert.equal(failures.get(0).get('location'), 'paths./pets.parameters');
    assert.equal(failures.get(0).get('hint'), 'Found parameters');
    assert.equal(failures.get(1).get('location'), 'paths./people.parameters');
    assert.equal(failures.get(1).get('hint'), 'Found parameters');
  });
});
