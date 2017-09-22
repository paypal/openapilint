'use strict';

const assert = require('chai').assert;
const rootTagsRule = require('../../../lib/rules/tags-ref');

describe('tags-ref', () => {
  const options = true;

  it('should not report errors when all operations tags are in the root tags', () => {
    const schema = {
      tags: [
        {
          name: 'pet'
        }
      ],
      paths: {
        '/pets': {
          get: {
            tags: ['pet']
          }
        }
      }
    };

    const failures = rootTagsRule.validate(options, schema);

    assert.equal(failures.size, 0);
  });

  it('should report errors when some operation tags are not present in root tags', () => {
    const schema = {
      tags: [
        {
          name: 'alligator'
        },
        {
          name: 'fishbowl'
        }
      ],
      paths: {
        '/pets': {
          get: {
            tags: ['fishbowl', 'alligator', 'pet']
          },
          put: {
            tags: ['lion']
          }
        }
      }
    };

    const failures = rootTagsRule.validate(options, schema);

    assert.equal(failures.size, 2);
    assert.equal(failures.get(0).get('location'), 'paths./pets.get.tags[2]');
    assert.equal(failures.get(0).get('hint'), 'Tag not found');
    assert.equal(failures.get(1).get('location'), 'paths./pets.put.tags[0]');
    assert.equal(failures.get(1).get('hint'), 'Tag not found');
  });
});
