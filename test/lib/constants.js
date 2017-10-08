const chai = require('chai');

const constants = require('../../lib/constants');

const assert = chai.assert;

describe('constants', () => {
  ['{MY_TEMPLATE}', '{template}', '{tempalteVar}'].forEach((pathElement) => {
    describe(`reValidPathTemplateParam ${pathElement}`, () => {
      it('should match regex', () => {
        assert.isTrue(!!pathElement.match(constants.reValidPathTemplateParam));
      });
    });
  });

  ['', '{', '}', '{}', '}{', '{pets', 'pets}', '{{pets}', '{pets}}', '{pe ts}', '}pets{'].forEach((pathElement) => {
    describe(`reValidPathTemplateParam ${pathElement}`, () => {
      it('should not match regex', () => {
        assert.isTrue(!pathElement.match(constants.reValidPathTemplateParam));
      });
    });
  });

  // -------- //

  ['word', 'some-words', 'a-b-c-word-d'].forEach((pathElement) => {
    describe(`style.spine ${pathElement}`, () => {
      it('should match regex', () => {
        assert.isTrue(!!pathElement.match(constants.caseStyles.spine));
      });
    });
  });

  ['PETS', 'peTS', 'PET_S', 'Pe_Ts', 'PE-ts'].forEach((pathElement) => {
    describe(`style.spine ${pathElement}`, () => {
      it('should not match regex', () => {
        assert.isTrue(!pathElement.match(constants.caseStyles.spine));
      });
    });
  });

  ['WORD', 'SOME-WORDS', 'A-B-C-WORD-D'].forEach((pathElement) => {
    describe(`style.cap-spine ${pathElement}`, () => {
      it('should match regex', () => {
        assert.isTrue(!!pathElement.match(constants.caseStyles['cap-spine']));
      });
    });
  });

  ['word', 'some-words', 'a-b-c-word-d', 'peTS', 'PET_S'].forEach((pathElement) => {
    describe(`style.cap-spine ${pathElement}`, () => {
      it('should not match regex', () => {
        assert.isTrue(!pathElement.match(constants.caseStyles['cap-spine']));
      });
    });
  });

  ['word', 'some_words', 'a_b_c_word_d'].forEach((pathElement) => {
    describe(`style.snake ${pathElement}`, () => {
      it('should match regex', () => {
        assert.isTrue(!!pathElement.match(constants.caseStyles.snake));
      });
    });
  });

  ['WORD', 'SOME-WORDS', 'some-words', 'PET_S'].forEach((pathElement) => {
    describe(`style.snake ${pathElement}`, () => {
      it('should not match regex', () => {
        assert.isTrue(!pathElement.match(constants.caseStyles.snake));
      });
    });
  });
});
