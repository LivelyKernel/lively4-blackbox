import {assert} from 'node_modules/chai/chai.js'
import {expect} from 'node_modules/chai/chai.js'
import '../solve-partial.js'

describe("Integers", function() {
  describe("1 to 1 relationship", function() {
    it("negation", function() {
      var transf = function(x) { return -x[0]; };
      var inputs = [-1, 1,20, 1,-1];
      var target = [ 5, 5, 5,-6,-6];
      for(i=0;i<inputs.length;++i){
        //var solution = solveForNumberToNumber([inputs[i]], transf, target[i]);
        //var variance = Math.abs(transf(solution) - target[i]);
        //expect(variance).to.be.at.most(0);
        solveForNumberToNumber([inputs[i]], transf, target[i]).then((solution) => {
          transf(solution).should.equal(target[i]);
          done();
        },
        (err) => {
          done(err);
        });
      }
    });
  
    it("increment", function() {
      var transf = function(x) { return x[0]+1; };
      var inputs = [-1, 1, 6, 1,-1];
      var target = [ 4, 4, 4,-2,-2];
      for(i=0;i<inputs.length;++i){
        var solution = solveForNumberToNumber([inputs[i]], transf, target[i]);
        var variance = Math.abs(transf(solution) - target[i]);
        expect(variance).to.be.at.most(0);
      }
    });
    
    it("double", function() {
      var transf = function(x) { return x[0]*2; };
      var inputs = [-5, 5,10, 5,-5];
      var target = [ 4, 4, 4,-2,-2];
      for(i=0;i<inputs.length;++i){
        var solution = solveForNumberToNumber([inputs[i]], transf, target[i]);
        var variance = Math.abs(transf(solution) - target[i]);
        expect(variance).to.be.at.most(0);
      }
    });
  });
  
  //describe("n to 1 relationship", function() { /* not yet implemented */ });
});



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

