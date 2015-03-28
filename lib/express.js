/* jshint node: true */
'use strict';

var _ = require('lodash');
var Validator = require('./helper');


module.exports = function(options) {
  options = _.assign({'name': 'validate'}, options);

  return function(req, res, next) {
    if (typeof req.validationErrors !== 'function') {
      throw new Error(
        'express-validator is not installed. \n' +
        '\tMake sure that you include `express-validator` middleware before `expressValidatorHelper.express`\n' +
        '\thttps://github.com/ctavan/express-validator');
    }
    req[options.name] = function() {
      var errors = req.validationErrors();
      var validator = new Validator();

      _.each(errors, function(err) {
        validator.add(err.param, err.msg);
      });

      return validator;
    };
    return next();
  };
};
