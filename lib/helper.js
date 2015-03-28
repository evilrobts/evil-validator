/* jshint node: true */
'use strict';

var _ = require('lodash');


var Validator = function() {
  this.errors = {};
};

Validator.prototype.add = function(key, msg) {
  if (this.errors[key]) {
    this.errors[key].push(msg);
  } else {
    this.errors[key] = [msg];
  }
};

Validator.prototype.isValid = function() {
  return _.isEmpty(this.errors);
};

module.exports = Validator;
