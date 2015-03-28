/* jshint -W030 */
var path = require('path');
var _ = require('lodash');
var should = require('should');

var expressValidatorHelper = require('..');


describe('helper', function() {
  beforeEach(function() {
    this.validator = new expressValidatorHelper.Validator();
  });

  it('should have `add` method', function() {
    this.validator.add.should.be.a.Function;
  });
  it('should have `isValid` method', function() {
    this.validator.isValid.should.be.a.Function;
  });
  it('should have `errors` property', function() {
    this.validator.errors.should.be.a.Object;
  });
  it('should add new error to `errors` property', function() {
    this.validator.add('email', 'is not valid email address');
    this.validator.errors.email.should.have.length(1);
  });
  it('should collect multiple errors for same key', function() {
    this.validator.add('email', 'required');
    this.validator.add('email', 'is not valid email address');
    this.validator.errors.email.should.have.length(2);
  });
  it('should respect ordering for errors', function() {
    this.validator.add('email', 'required');
    this.validator.add('email', 'is not valid email address');
    _.first(this.validator.errors.email).should.be.equal('required');
  });
  it('should return `true` for `isValid` call by default', function() {
    this.validator.isValid().should.be.true;
  });
  it('should not pass validation with any errors', function() {
    this.validator.add('email', 'required');
    this.validator.isValid().should.not.be.true;
  });
});

describe('express middleware', function() {
  beforeEach(function() {
    this.validator = new expressValidatorHelper.Validator();
    this.express = expressValidatorHelper.express();
  });
  it('should return function', function() {
    this.express.should.be.a.Function;
  });
  it('should throw an error if express-validator middleware is not installed', function() {
    (function() {
      this.express({}, {}, _.noop);
    }).should.throw();
  });
  it('should add validator function to request', function() {
    var req = {
      validationErrors: _.noop
    };
    this.express(req, {}, _.noop);
    req.validate.should.be.a.Function;
  });
  it('should return validator from validate function', function() {
    var req = {
      validationErrors: _.noop
    };
    this.express(req, {}, _.noop);
    req.validate().should.be.an.instanceof(expressValidatorHelper.Validator);
  });
  it('should add errors to validator object from validate function', function() {
    var req = {
      validationErrors: function() {
        return [
          {param: 'email', msg: 'required', value: '<received input>'},
          {param: 'email', msg: 'valid email required', value: '<received input>'},
          {param: 'password', msg: '6 to 20 characters required', value: '<received input>'}
        ];
      }
    };
    this.express(req, {}, _.noop);
    req.validate().errors.should.have.property('email').with.length(2);
    req.validate().errors.should.have.property('password').with.length(1);
  });
  it('should respect `name` option', function() {
    var req = {
      validationErrors: _.noop
    };
    expressValidatorHelper.express({
      name: 'customName'
    })(req, {}, _.noop);
    req.customName.should.be.a.Function;
  });
});
