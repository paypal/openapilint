'use strict';

const Record = require('immutable').Record;

class RuleFailure extends Record({ location: '', hint: '' }) {

}

module.exports = RuleFailure;
