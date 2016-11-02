// assumption: input and output are flat dictionaries

function solve2(actualInput, transformation, targetOutput) {
  // finding dependencies
  var dependencies = {};
  var actualOutput = transformation(actualInput);
  for(var i in actualInput) {
    // modifying single variable
    var influenced = new Set();
    var 
    var diffInput = Object.assign({}, actualInput);
    switch(typeof(diffInput[i])) {
      case "boolean":
        diffInput[i] = !diffInput[i];
        break;
      case "number":
        [-1, 0, 1, actualInput[i]+1, actualInput[i]-1].forEach(function(j) {
          diffInput[i] = j;
          findInfluencedVariables(actualOutput, diffInput, transformation).forEach(function(k) {
            influenced.add(k);
          });
        });
        diffInput[i] = diffInput[i] + 1;
        break;
      case "string":
        diffInput[i] = diffInput[i] + "1";
        break;
      default:
        break;
    }
  
    dependencies[i] = findInfluencedVariables(actualOutput, diffInput, transformation);
  }
  
  console.log(dependencies);
}

function findInfluencedVariables(actualOutput, diffInput, transformation) {
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
  
  return influenced;
}