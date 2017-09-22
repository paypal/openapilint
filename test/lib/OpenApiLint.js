const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const OpenApiLint = require('../../lib/OpenApiLint');
const Map = require('immutable').Map;

const expect = chai.expect;
const assert = chai.assert;

chai.use(chaiAsPromised);

describe('OpenApiLint', () => {
  it('should return no errors for empty config', () => {
    const config = {};
    const schema = {};

    const result = new OpenApiLint(config).lint(schema);

    return result.then((lintResult) => {
      assert.isTrue(lintResult instanceof Map);
      assert.equal(lintResult.size, 0);
    });
  });

  it('should return a single key with no failures for a basic no-restricted-words test', () => {
    const config = {
      rules: {
        'no-restricted-words': { words: ['blah'] }
      }
    };
    const schema = {
      info: {
        description: 'handy description'
      }
    };

    const result = new OpenApiLint(config).lint(schema);

    return result.then((lintResult) => {
      assert.isTrue(lintResult instanceof Map);
      assert.equal(lintResult.size, 1);
      assert.isDefined(lintResult.get('no-restricted-words').get('description'));
      assert.equal(lintResult.get('no-restricted-words').get('failures').size, 0);
    });
  });


  it('should return a single key with one failure for a basic no-restricted-words test', () => {
    const config = {
      rules: {
        'no-restricted-words': { words: ['bl'] }
      }
    };
    const schema = {
      info: {
        description: 'blah'
      }
    };

    const result = new OpenApiLint(config).lint(schema);

    return result.then((lintResult) => {
      assert.isTrue(lintResult instanceof Map);
      assert.equal(lintResult.size, 1);
      assert.isDefined(lintResult.get('no-restricted-words').get('description'));

      assert.equal(lintResult.get('no-restricted-words').get('failures').size, 1);
      assert.equal(lintResult.get('no-restricted-words').get('failures').get(0).get('location'), 'info.description');
    });
  });

  it('should have a failure if a bad key is provided in the config', () => {
    const config = {
      rules: {
        'fake-rule': 'blah'
      }
    };

    const result = new OpenApiLint(config).lint({});

    return expect(result).to.be.rejectedWith(Error);
  });
});
