// assumption: input and output are flat dictionaries


function solve2(actualInput, transformation, targetOutput) { 
  // 1. find changes output values
  var actualOutput = transformation(actualInput);
  var varyingKeys = findVaryingKeys(actualOutput, targetOutput);
  var dependencies = findDependencies(actualInput, transformation);
  var targetInput = Object.assign({}, actualInput);
  
  varyingKeys.forEach(function(variedOutputKey){
    // 2. find corresponding input values;
    //    or: output is independent -> no solution
    var affectingInputKeys = new Set();
    
    for (var inputKey in dependencies) {
      var dependantOutputKeys = dependencies[inputKey];
      if(dependantOutputKeys.includes(variedOutputKey)) {
        affectingInputKeys.add(inputKey);
        if(dependantOutputKeys.length > 1) {
          throw "Error: Function is not surjective."
        }
      }
    }
    
    var solutions = solveForSingleOutput(actualInput, transformation, targetOutput, affectingInputKeys, variedOutputKey);
    for (var solvedInputKey in solutions) {
      targetInput[solvedInputKey] = solutions[solvedInputKey];
    }
  });
  
  return targetInput;
  
  // 3. solve!
  // 4. ???
  // 5. success / profit
}

function solveForSingleOutput(actualInput, transformation, targetOutput, affectingInputKeys, variedOutputKey) {
  if(affectingInputKeys.size == 1) {
    if(typeof(actualInput[Array.from(affectingInputKeys)[0]]) == "number" && typeof(targetOutput[variedOutputKey]) == "number") {
      var newTranformation = function(singleIntegerInput) {
        var inputJSON = Object.assign({}, actualInput);
        inputJSON[Array.from(affectingInputKeys)[0]] = singleIntegerInput;
        return transformation(inputJSON)[variedOutputKey];
      };
      var resultKeyName = Array.from(affectingInputKeys)[0];
      var resultValue = solveForIntegerToInteger(actualInput[Array.from(affectingInputKeys)[0]], newTranformation, targetOutput[variedOutputKey]);
      var result = {};
      result[resultKeyName] = resultValue;
      return result;
    }
  }
  
  return {};
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
  
      findVaryingKeys(actualOutput, diffOutput).forEach(function(element) {
        influenced.add(element);
      });
    });
  
    dependencies[i] = Array.from(influenced);
  }
  
  return dependencies;
}

function findVaryingKeys(json1, json2) {
  var result = new Set();

  // collecting keys
  var keys = new Set(Object.keys(json1));
  Object.keys(json2).forEach(function(key) { keys.add(key) });
  
  // searching for influenced variables
  keys.forEach(function(key) {
    if(json1[key] != json2[key]) {
      result.add(key);
    }
  });
  
  return result;
}