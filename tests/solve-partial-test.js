import {expect} from '../node_modules/chai/chai.js'
import {..} from '../solve-partial.js'

describe("Numbers 1 to 1 relationship", function() {
  it("negation", function() {
    var negate = function(x) { return -x; };
    expect(solveForNumberToNumber(1, negate, 5)).to.equal(-5);
  });

  it("increment", function() {
    expect("failing").to.equal("not failing");
  });
});
