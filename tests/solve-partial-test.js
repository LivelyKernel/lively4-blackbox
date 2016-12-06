import {expect} from 'node_modules/chai/chai.js'
import {solveForNumberToNumber} from '../solve-partial.js'

describe("Numbers 1 to 1 relationship", function() {
  it("negation", function() {
    var negate = function(x) { return -x; };
    expect(solveForNumberToNumber(1, negate, 5)).to.equal(-5);
    expect(solveForNumberToNumber(20, negate, 5)).to.equal(-5);
    expect(solveForNumberToNumber(1, negate, -6)).to.equal(6);
    expect(solveForNumberToNumber(-1, negate,-6)).to.equal(6);
    // TODO: Does not work accurately for floats.
  });

  it("increment", function() {
    var increment = function(x) { return x+1; };
    expect(solveForNumberToNumber(1, increment, 4)).to.equal(3);
    expect(solveForNumberToNumber(4, increment, 4)).to.equal(3);
    expect(solveForNumberToNumber(1, increment, -2)).to.equal(-3);
    expect(solveForNumberToNumber(-1, increment, -2)).to.equal(-3);
  });
});
