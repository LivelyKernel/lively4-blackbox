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
