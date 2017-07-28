'use strict';

const Record = require('immutable').Record;
const List = require('immutable').List;

class RuleResult extends Record({ description: '', failures: new List() }) {

}

module.exports = RuleResult;
