const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const OpenApiLint = require('../../lib/OpenApiLint');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('OpenApiLint', () => {
  it('should return no errors for empty config', () => {
    const config = {};
    const schema = {};

    const result = new OpenApiLint(config).lint(schema);

    return result.then((lintResult) => {
      expect(lintResult.size).to.equal(0);
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
      expect(lintResult.size).to.equal(1);
      expect(lintResult.get('no-restricted-words').get('description')).to.be.not.undefined;
      expect(lintResult.get('no-restricted-words').get('failures').size).to.equal(0);
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
      expect(lintResult.size).to.equal(1);
      expect(lintResult.get('no-restricted-words').get('description')).to.be.not.undefined;
      expect(lintResult.get('no-restricted-words').get('failures').size).to.equal(1);
      expect(lintResult.get('no-restricted-words').get('failures').get(0).get('location')).to.equal('info.description');
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
