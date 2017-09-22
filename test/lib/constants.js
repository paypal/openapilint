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

  ['', '{', '}', '{pets', 'pets}', '{{pets}', '{pets}}', '{pe ts}', '}pets{'].forEach((pathElement) => {
    describe(`reValidPathTemplateParam ${pathElement}`, () => {
      it('should not match regex', () => {
        assert.isTrue(!pathElement.match(constants.reValidPathTemplateParam));
      });
    });
  });

  // -------- //

  ['word', 'some-words', 'a-b-c-word-d'].forEach((pathElement) => {
    describe(`style.spine-case ${pathElement}`, () => {
      it('should match regex', () => {
        assert.isTrue(!!pathElement.match(constants.styles['spine-case']));
      });
    });
  });

  ['PETS', 'peTS', 'PET_S', 'Pe_Ts', 'PE-ts'].forEach((pathElement) => {
    describe(`style.spine-case ${pathElement}`, () => {
      it('should not match regex', () => {
        assert.isTrue(!pathElement.match(constants.styles['spine-case']));
      });
    });
  });

  ['WORD', 'SOME-WORDS', 'A-B-C-WORD-D'].forEach((pathElement) => {
    describe(`style.cap-spine-case ${pathElement}`, () => {
      it('should match regex', () => {
        assert.isTrue(!!pathElement.match(constants.styles['cap-spine-case']));
      });
    });
  });

  ['word', 'some-words', 'a-b-c-word-d', 'peTS', 'PET_S'].forEach((pathElement) => {
    describe(`style.cap-spine-case ${pathElement}`, () => {
      it('should not match regex', () => {
        assert.isTrue(!pathElement.match(constants.styles['cap-spine-case']));
      });
    });
  });

  ['word', 'some_words', 'a_b_c_word_d'].forEach((pathElement) => {
    describe(`style.snake-case ${pathElement}`, () => {
      it('should match regex', () => {
        assert.isTrue(!!pathElement.match(constants.styles['snake-case']));
      });
    });
  });

  ['WORD', 'SOME-WORDS', 'some-words', 'PET_S'].forEach((pathElement) => {
    describe(`style.snake-case ${pathElement}`, () => {
      it('should not match regex', () => {
        assert.isTrue(!pathElement.match(constants.styles['snake-case']));
      });
    });
  });
});
