const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');

const List = require('immutable').List;

const rulesPath = 'lib/rules';

describe('all-rules should have common attributes', () => {
  fs.readdir(rulesPath, (err, items) => {
    assert.isNull(err);
    assert.isTrue(items.length > 0);

    items.forEach((element) => {
      const requiredName = path.parse(element).name;
      const rule = require(`../../${rulesPath}/${requiredName}`);

      it(`${requiredName} should have common attributes`, () => {
        // rules should have a non-empty description
        assert.isDefined(rule.description);
        assert.isTrue(rule.description.length > 0);

        // validating a rule should return a failure list
        const result = rule.validate({}, {});
        assert.isTrue(result instanceof List, `${requiredName} returned a ${result} instead of a List`);
      });
    });
  });
});
