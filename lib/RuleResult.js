'use strict';

const Record = require('immutable').Record;

const RuleFailureList = require('./RuleFailureList');

class RuleResult extends Record({ description: '', failures: new RuleFailureList() }) {

}

module.exports = RuleResult;
