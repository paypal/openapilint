const chai = require('chai');
const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');

const RuleFailureList = require('../../lib/RuleFailureList');
const List = require('immutable').List

const rulesPath = 'lib/rules';

describe('all-rules', () => {
  it('should have common attributes', (done) => {
    fs.readdir(rulesPath, function(err, items) {
      assert.isNull(err);
      assert.isTrue(items.length > 0);
   
      items.forEach(function(element) {
        const requiredName = path.parse(element).name;
        rule = require(`../../${rulesPath}/${requiredName}`);

        // rules should have a non-empty description
        assert.isDefined(rule.description);
        assert.isTrue(rule.description.length > 0);

        // validating a rule should return a failure list
        result = rule.validate({}, {});
        assert.isTrue(result instanceof List, `${requiredName} returned a ${result}`);
      });

      done();
    });
  });
});
