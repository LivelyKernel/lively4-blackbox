import {assert} from 'node_modules/chai/chai.js'
import {expect} from 'node_modules/chai/chai.js'
import '../solve-partial.js'
import '../numeric-1.2.6.min.js'

describe("Integers", function() {
  describe("1 to 1 relationship", function() {
    it("negation", function() {
      var f = function(x) { return -x[0]; };
      solveForNumberToNumber([1], f, 5).then(sol => { expect(f(sol)).to.equal(5) });
      solveForNumberToNumber([1], f, -5).then(sol => { expect(f(sol)).to.equal(-5) });
      solveForNumberToNumber([-1], f, 6).then(sol => { expect(f(sol)).to.equal(6) });
      solveForNumberToNumber([-1], f, -6).then(sol => { expect(f(sol)).to.equal(-6) });
    });
  
    it("increment", function() {
      var f = function(x) { return x[0]+1; };
      solveForNumberToNumber([1], f, 5).then(sol => { expect(f(sol)).to.equal(5) });
      solveForNumberToNumber([1], f, -5).then(sol => { expect(f(sol)).to.equal(-5) });
      solveForNumberToNumber([-1], f, 6).then(sol => { expect(f(sol)).to.equal(6) });
      solveForNumberToNumber([-1], f, -6).then(sol => { expect(f(sol)).to.equal(-6) });
    });
    
    it("double", function() {
      var f = function(x) { return x[0]*2; };
      solveForNumberToNumber([1], f, 5).then(sol => { expect(f(sol)).to.equal(5) });
      solveForNumberToNumber([1], f, -5).then(sol => { expect(f(sol)).to.equal(-5) });
      solveForNumberToNumber([-1], f, 6).then(sol => { expect(f(sol)).to.equal(6) });
      solveForNumberToNumber([-1], f, -6).then(sol => { expect(f(sol)).to.equal(-6) });
    });
  });
  
  describe("n to 1 relationship", function() {
    it("addition", function() {
      var f = function(x) { return x[0]+x[1]; };
      solveForManyNumbers([1,2], f, 5).then(sol => { expect(f(sol)).to.equal(5) });
      solveForManyNumbers([1,2], f, -5).then(sol => { expect(f(sol)).to.equal(-5) });
      solveForManyNumbers([-1,2], f, 6).then(sol => { expect(f(sol)).to.equal(6) });
      solveForManyNumbers([-1,2], f, -6).then(sol => { expect(f(sol)).to.equal(-6) });
    });
  });
});


/*
describe("Floats", function() {
  describe("1 to 1 relationship", function() {
    it("negation", function() {
      var transf = function(x) { return -x[0]; };
      var inputs = [ -1.0, 1.0, 20.0, 20.05,  1.0, -1.0, -20.0, -20.05];
      var target = [  2.5, 2.5,  2.5,   2.5, -6.2, -6.2,  -6.2,   -6.2];
      for(i=0;i<inputs.length;++i){
        var solution = solveForNumberToNumber([inputs[i]], transf, target[i]);
        var variance = Math.abs(transf(solution) - target[i]);
        expect(variance).to.be.at.most(0);
      }
    });

    
    it("increment", function() {
      var transf = function(x) { return x[0]+1; };
      var inputs = [ -1.0, 1.0, 6.0, 6.05,  1.0, -1.0, -6.0, -6.05];
      var target = [  4.5, 4.5, 4.5,  4.5, -2.2, -2.2, -2.2,  -2.2];
      for(i=0;i<inputs.length;++i){
        var solution = solveForNumberToNumber([inputs[i]], transf, target[i]);
        var variance = Math.abs(transf(solution) - target[i]);
        expect(variance).to.be.at.most(0);
      }
    });
    
    it("double", function() {
      var transf = function(x) { return x[0]*2; };
      var inputs = [ -5.0, 5.0, 10.0, 10.05, 5.0, -5.0, -10.0, -10.05];
      var target = [  4.5, 4.5,  4.5,   4.5,-2.2, -2.2,  -2.2,   -2.2]
      for(i=0;i<inputs.length;++i){
        var solution = solveForNumberToNumber([inputs[i]], transf, target[i]);
        var variance = Math.abs(transf(solution) - target[i]);
        expect(variance).to.be.at.most(0);
      }
    }); 
  });
  
  describe("n to 1 relationship", function() {  });
  
});
*/
/*
describe("String", function() {
  describe("1 to 1 relationship", function() {
    it("reverse -- input with correct length", function() {
      var reverse = function(x) {
        var result = "";
        for(var i=x.length-1; i>=0; i--) {
          result += x[i];
        }
        return result;
      };
      solveForStringToString("fuenf", reverse, "hallo").then(
        (result) => {
          expect(result).to.equal("ollah");
          done();
        },
        (error) => {
          done(error);
        }
      );
      solveForStringToString("catndog", reverse, "raccoon").then(
        (result) => {
          expect(result).to.equal("nooccar");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });
  
  describe("1 to 1 relationship", function() {  });
});
*/

