// assumption: input and output are flat dictionaries

function solve2(actualInput, transformation, targetOutput) {
  // finding dependencies
  var dependencies = {};
  var actualOutput = transformation(actualInput);
  for(var i in actualInput) {
    // modifying single variable
    var diffInput = Object.assign({}, actualInput);
    diffInput[i] = diffInput[i] + 1;
    var diffOutput = transformation(diffInput);
    
    // collecting keys
    var keys = new Set(Object.keys(diffOutput));
    Object.keys(actualOutput).forEach(function(key) { keys.add(key) });
    
    // searching for influenced variables
    var influenced = [];
    keys.forEach(function(key) { 
      if(actualOutput[key] != diffOutput[key]) {
        influenced.push(key);
      }
    });
    
    dependencies[i] = influenced;
  }
  
  console.log(dependencies);
}