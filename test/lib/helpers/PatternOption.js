const chai = require('chai');

const PatternOption = require('../../../lib/helpers/PatternOption');

const assert = chai.assert;

describe('PatternOption', () => {
  describe('isValidPatternOption', () => {
    it('Returns true for valid options', () => {
      assert.isTrue(PatternOption.isValidPatternOption('testPrefix', { testPrefixPattern: 'pattern' }));
      assert.isTrue(PatternOption.isValidPatternOption('testPrefix', { testPrefixPatternIgnoreCase: 'pattern' }));
    });

    it('Returns false for invalid options', () => {
      assert.isFalse(PatternOption.isValidPatternOption('testPrefix', { }));
      assert.isFalse(PatternOption.isValidPatternOption('testPrefix', { testPrefixPattern: 'pattern', testPrefixPatternIgnoreCase: 'pattern' }));
    });
  });

  describe('constructor', () => {
    it('Creates a new PatternOption that does not ignore case', () => {
      const option = new PatternOption('testPrefix', { testPrefixPattern: 'testPattern' });
      assert.equal('testPattern', option.pattern);
      assert.isFalse(option.ignoreCase);
    });

    it('Creates a new PatternOption that ignores case', () => {
      const option = new PatternOption('testPrefix', { testPrefixPatternIgnoreCase: 'testPattern' });
      assert.equal('testPattern', option.pattern);
      assert.isTrue(option.ignoreCase);
    });
  });
});
