const chai = require('chai');
const spies = require('chai-spies');
const expect = chai.expect;
const assert = chai.assert;

chai.use(spies);

const TextParser = require('../../../lib/helpers/TextParser');

describe('TextParser', () => {
  describe('forEachTextField', () => {
    const schema = {
      definitions: {
        Pet: {
          "description": "Definition description",
          "type": "object",
          "properties": {
            "name": {
              "description": "Properties.name description"
            },
          }
        }
      },
      info: {
        title: 'info.title'
      },
      paths: {
        '/pets': {
          get: {
            summary: 'operation summary',
            parameters: [
              {
                description: 'parameter description'
              }
            ],
            responses: {
              200: {
                schema: {
                  title: 'title ref-override',
                  description: 'description ref-override',
                  $ref: '#/definitions/Pet'
                }
              }
            }
          }
        }
      }
    };

    const textFunc = () => {};
    const parser = new TextParser(schema);

    it('Calls function for each description', () => {
      const spy = chai.spy(textFunc);

      parser.forEachTextField(['description'], spy);

      expect(spy).to.have.been.called.exactly(3);
    });

    it('Calls function for each description-ref-override', () => {
      const spy = chai.spy(textFunc);

      parser.forEachTextField(['description-ref-override'], spy);

      expect(spy).to.have.been.called.exactly(1);
    });

    it('Calls function for each title', () => {
      const spy = chai.spy(textFunc);

      parser.forEachTextField(['title'], spy);

      expect(spy).to.have.been.called.exactly(1);
    });

    it('Calls function for each title-ref-override', () => {
      const spy = chai.spy(textFunc);

      parser.forEachTextField(['title-ref-override'], spy);

      expect(spy).to.have.been.called.exactly(1);
    });

    it('Calls function for each summary', () => {         
      const spy = chai.spy(textFunc);

      parser.forEachTextField(['summary'], spy);

      expect(spy).to.have.been.called.exactly(1);

    });
  });
});
