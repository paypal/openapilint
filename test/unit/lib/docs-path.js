'use strict';

const assert = require('chai').assert;
const docsPathRule = require('../../../lib/rules/docs-path');

describe('docs-path', () => {
  const options = true;

  it('should not report errors when not enabled', () => {
    const schema = {};

    const result = docsPathRule.validate(false, schema);

    assert.isDefined(result.get('description'));
    assert.equal(result.get('failures').size, 0);
  });


  it('should not report errors when x-docPath is present', () => {
    const schema = {
      info: {
        'x-docPath': 'myApiPath'
      }
    };

    const result = docsPathRule.validate(options, schema);

    assert.isDefined(result.get('description'));
    assert.equal(result.get('failures').size, 0);
  });

  it('should report error when x-docPath is not present', () => {
    const schema = {
      info: {
      }
    };

    const result = docsPathRule.validate(options, schema);

    assert.isDefined(result.get('description'));
    assert.equal(result.get('failures').size, 1);

    assert.equal(result.get('failures').get(0).get('location'), 'info');
    assert.equal(result.get('failures').get(0).get('hint'), '');
  });

  it('should report error when x-docPath is not well formed', () => {
    const schema = {
      info: {
        'x-docPath': 'my invalid #path'
      }
    };

    const result = docsPathRule.validate(options, schema);

    assert.isDefined(result.get('description'));
    assert.equal(result.get('failures').size, 1);
    assert.equal(result.get('failures').get(0).get('location'), 'info.x-docPath');
    assert.equal(result.get('failures').get(0).get('hint'), '');
  });
});
