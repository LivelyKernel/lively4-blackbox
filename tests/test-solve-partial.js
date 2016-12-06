<<<<<<< HEAD
suite('Array', function() {
  setup(function() {
    // ...
  });

  suite('#indexOf()', function() {
    test('should return -1 when not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
=======
var expect = chai.expect;

describe("Blub", function() {
  describe("test", function() {
    it("passing", function() {
      expect("cow.name").to.equal("cow.name");
    });

    it("failing", function() {
      expect("cow.name").to.equal("Kate");
    });
  });
});
>>>>>>> 3b14ebff3fe954693741ce47cb68f7ffc0dc623f
