import {expect} from 'node_modules/chai/chai.js'
import {solveForNumberToNumber} from '../solve-partial.js'

describe("Integers", function() {
  describe("1 to 1 relationship", function() {
    it("negation", function() {
      var negate = function(x) { return -x[0]; };
      expect(solveForNumberToNumber(-1, negate, 5)).to.equal(-5);
      expect(solveForNumberToNumber(1, negate, 5)).to.equal(-5);
      expect(solveForNumberToNumber(20, negate, 5)).to.equal(-5);
      expect(solveForNumberToNumber(1, negate,-6)).to.equal(6);
      expect(solveForNumberToNumber(-1, negate, -6)).to.equal(6);
      expect(solveForNumberToNumber(-20, negate,-6)).to.equal(6);
    });
  
    it("increment", function() {
      var increment = function(x) { return x[0]+1; };
      expect(solveForNumberToNumber(-1, increment, 4)).to.equal(3);
      expect(solveForNumberToNumber(1, increment, 4)).to.equal(3);
      expect(solveForNumberToNumber(6, increment, 4)).to.equal(3);
      expect(solveForNumberToNumber(1, increment, -2)).to.equal(-3);
      expect(solveForNumberToNumber(-1, increment, -2)).to.equal(-3);
      expect(solveForNumberToNumber(-6, increment, -2)).to.equal(-3);
    });
    
    it("double", function() {
      var double = function(x) { return x[0]*2; };
      expect(solveForNumberToNumber(-5, double, 4)).to.equal(2);
      expect(solveForNumberToNumber(5, double, 4)).to.equal(2);
      expect(solveForNumberToNumber(10, double, 4)).to.equal(2);
      expect(solveForNumberToNumber(5, double, -2)).to.equal(-1);
      expect(solveForNumberToNumber(-5, double, -2)).to.equal(-1);
      expect(solveForNumberToNumber(-10, double, -2)).to.equal(-1);
    });
  });
  
  describe("n to 1 relationship", function() { /* not yet implemented */ });
});

describe("Floats", function() {
  describe("1 to 1 relationship", function() {
    it("negation", function() {
      var negate = function(x) { return -x[0]; };
      expect(solveForNumberToNumber(-1.0, negate, 2.5)).to.equal(-2.5);
      expect(solveForNumberToNumber(1.0, negate, 2.5)).to.equal(-2.5);
      expect(solveForNumberToNumber(20.0, negate, 5)).to.equal(-2.5);
      expect(solveForNumberToNumber(20.05, negate, 5)).to.equal(-2.5);
      expect(solveForNumberToNumber(1.0, negate,-6.2)).to.equal(6.2);
      expect(solveForNumberToNumber(-1.0, negate, -6.2)).to.equal(6.2);
      expect(solveForNumberToNumber(-20.0, negate,-6.2)).to.equal(6.2);
      expect(solveForNumberToNumber(-20.05, negate,-6.2)).to.equal(6.2);
    });
  
    it("increment", function() {
      var increment = function(x) { return x[0]+1; };
      expect(solveForNumberToNumber(-1.0, increment, 4.5)).to.equal(3.5);
      expect(solveForNumberToNumber(1.0, increment, 4.5)).to.equal(3.5);
      expect(solveForNumberToNumber(6.0, increment, 4.5)).to.equal(3.5);
      expect(solveForNumberToNumber(6.05, increment, 4.5)).to.equal(3.5);
      expect(solveForNumberToNumber(1.0, increment, -2.2)).to.equal(-3.2);
      expect(solveForNumberToNumber(-1.0, increment, -2.2)).to.equal(-3.2);
      expect(solveForNumberToNumber(-6.0, increment, -2.2)).to.equal(-3.2);
      expect(solveForNumberToNumber(-6.05, increment, -2.2)).to.equal(-3.2);
    });
    
    it("double", function() {
      var double = function(x) { return x[0]*2; };
      expect(solveForNumberToNumber(-5.0, double, 4.5)).to.equal(2.25);
      expect(solveForNumberToNumber(5.0, double, 4.5)).to.equal(2.25);
      expect(solveForNumberToNumber(10.0, double, 4.5)).to.equal(2.25);
      expect(solveForNumberToNumber(10.05, double, 4.5)).to.equal(2.25);
      expect(solveForNumberToNumber(5.0, double, -2.2)).to.equal(-1.1);
      expect(solveForNumberToNumber(-5.0, double, -2.2)).to.equal(-1.1);
      expect(solveForNumberToNumber(-10.0, double, -2.2)).to.equal(-1.1);
      expect(solveForNumberToNumber(-10.05, double, -2.2)).to.equal(-1.1);
    });
  });
  
  describe("n to 1 relationship", function() { /* not yet implemented */ });
});

describe("String", function() { });