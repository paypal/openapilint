'use strict';

const assert = require('chai').assert;
const noRefOverridesRule = require('../../../lib/rules/no-ref-overrides');

describe('no-ref-overrides', () => {
  const options = { allowProperties: ['description'] };

  it('should not report errors when all refs are reachable', () => {
    const schema = {
      definitions: {
        Pet: {}
      },
      paths: {
        '/pets/{id}': {
          get: {
            responses: {
              200: {
                schema: {
                  description: 'A description override.',
                  $ref: '#/definitions/Pet'
                }
              }
            }
          }
        }
      }
    };

    const failures = noRefOverridesRule.validate(options, schema);

    assert.equal(failures.size, 0);
  });

  it('should report an error when a definition ref is not reachable', () => {
    const schema = {
      definitions: {
        Pet: {}
      },
      paths: {
        '/pets/{id}': {
          get: {
            responses: {
              200: {
                schema: {
                  type: 'object',
                  description: 'A description override.',
                  $ref: '#/definitions/Pet'
                }
              }
            }
          }
        }
      }
    };

    const failures = noRefOverridesRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets/{id}.get.responses.200.schema.type');
    assert.equal(failures.get(0).get('hint'), 'Found $ref object override');
  });
});
