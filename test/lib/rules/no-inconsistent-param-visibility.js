'use strict';

const assert = require('chai').assert;
const noInconsistentParamVisibilityRule = require('../../../lib/rules/no-inconsistent-param-visibility');

describe('no-inconsistent-param-visibility', () => {
  const options = {
    orderedOptions: [
      'INTERNAL',
      'LIMITED_RELEASE',
      'EXTERNAL'
    ],
    selector: [
      'x-visibility',
      'extent'
    ],
    default: 'INTERNAL'
  };

  it('should not report errors when all parameters have consistent parameter visibility', (done) => {
    const schema = {
      paths: {
        '/pets': {
          get: {
            'x-visibility': {
              extent: 'LIMITED_RELEASE'
            },
            parameters: [
              {
                name: 'id',
                'x-visibility': {
                  extent: 'LIMITED_RELEASE'
                }
              },
              {
                name: 'secret_code1',
                'x-visibility': {
                  extent: 'INTERNAL'
                }
              },
              {
                name: 'secret_code2'
              }
            ]
          }
        }
      }
    };

    const failures = noInconsistentParamVisibilityRule.validate(options, schema);

    assert.equal(failures.size, 0);
    done();
  });

  it('should report two errors when two paths have parameters', (done) => {
    const schema = {
      paths: {
        '/pets': {
          get: {
            parameters: [
              {
                name: 'id',
                'x-visibility': {
                  extent: 'EXTERNAL'
                }
              }
            ]
          }
        }
      }
    };

    const failures = noInconsistentParamVisibilityRule.validate(options, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets.parameters[0]');
    assert.equal(failures.get(0).get('hint'), 'EXTERNAL more visible than parent INTERNAL');
    done();
  });
});
