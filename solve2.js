// assumption: input and output are flat dictionaries

function solve2(actualInput, transformation, targetOutput) { 
  // 1. find changes output values
  // 2. find corresponding input values;
  //    or: output is independent -> no solution
  // 3. solve!
  // 4. ???
  // 5. success / profit
}

function findDependencies(actualInput, transformation) {
  // finding dependencies
  var dependencies = {};
  var actualOutput = transformation(actualInput);
  for(var i in actualInput) {
    // modifying single variable
    var influenced = new Set();
    var tries = [];
    var diffInput = Object.assign({}, actualInput);
    switch(typeof(diffInput[i])) {
      case "boolean":
        tries = [!actualInput[i]];
        break;
      case "number":
        tries = [-1, 0, 1, actualInput[i]+1, actualInput[i]-1];
        break;
      case "string":
        tries = ["", "hello", "13", "\n", diffInput[i] + "1"];
        break;
      default:
        break;
    }
    
    tries.forEach(function(j) {
      diffInput[i] = j;
      var diffOutput = transformation(diffInput);
  
      // collecting keys
      var keys = new Set(Object.keys(diffOutput));
      Object.keys(actualOutput).forEach(function(key) { keys.add(key) });
  
      // searching for influenced variables
      keys.forEach(function(key) { 
        if(actualOutput[key] != diffOutput[key]) {
          influenced.add(key);
        }
      });
    });
  
    dependencies[i] = Array.from(influenced);
  }
  
  return dependencies;
}
