const chai = require('chai');
const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');

const rulesPath = 'lib/rules';

describe('all-rules', () => {
  it('should have a description', (done) => {
    fs.readdir(rulesPath, function(err, items) {
      assert.isNull(err);
      assert.isTrue(items.length > 0);
   
      items.forEach(function(element) {
        const requiredName = path.parse(element).name;
        rule = require(`../../${rulesPath}/${requiredName}`);
        assert.isDefined(rule.description);
      });

      done();
    });
  });
});
