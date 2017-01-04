// assumption: input and output are flat dictionaries


function solve2(actualInput, transformation, targetOutput) { 
  
  var dependencies = findDependencies(actualInput, transformation);
  var targetInput = Object.assign({}, actualInput);
  // 1. find changes output values
  var actualOutput = transformation(actualInput);
  var modifiedOutputKeys = findVaryingKeys(actualOutput, targetOutput);
  
  modifiedOutputKeys.forEach(function(modifiedOutputKey){
    // 2. find corresponding input values;
    //    or: output is independent -> no solution
    var affectingInputKeys = new Set();
    
    for (var inputKey in dependencies) {
      var dependantOutputKeys = dependencies[inputKey];
      if(dependantOutputKeys.includes(modifiedOutputKey)) {
        affectingInputKeys.add(inputKey);
        
        if(dependantOutputKeys.length > 1) {
          throw "Error: Function is not surjective.";
        }
        
        if(dependantOutputKeys.length === 0) {
          throw "Error: Modified output variable seems to be independent from input variables.";
        }
      }
    }
    
    // 3. solving: for each modified output variable, find solution by modifying affecting input keys
    affectingInputKeys = Array.from(affectingInputKeys);
    var solutions = solveForSingleOutput(actualInput, transformation, targetOutput, affectingInputKeys, modifiedOutputKey);
    for (var solvedInputKey in solutions) {
      targetInput[solvedInputKey] = solutions[solvedInputKey];
    }
  });
  
  return targetInput;
}

function solveForSingleOutput(actualInput, transformation, targetOutput, affectingInputKeys, modifiedOutputKey) {
  
  // wrap transformation function
  //function takes an array of values representing the affectingInputKeys
  //returns the value of the output key we are currently solving for
  var strippedTransformation = function(inputValues) {
    var modifiedInput = Object.assign({}, actualInput);
    var i=0;
    affectingInputKeys.forEach(function(key){
      modifiedInput[key] = inputValues[i++];
    });
    return transformation(modifiedInput)[modifiedOutputKey];
  };
    
  //create an array containing just the values of the affectingInputKeys ie. the seed to start solving from
  var strippedInputArray = [];
  var i=0;
  affectingInputKeys.forEach(function(key){
    strippedInputArray[i] = actualInput[key];
  });
  
  //object to store all the solved input key-value pairs in
  var result = {};
  
  // assumption for now: function is not only surjective but also injective and therefore bijective
  if(affectingInputKeys.length == 1) {
    
    // case 0: number -> number
    if(typeof(actualInput[affectingInputKeys[0]]) == "number" && typeof(targetOutput[modifiedOutputKey]) == "number") {
      //just call int int solver and assign the result to the right key
      result[affectingInputKeys[0]] = solveForNumberToNumber(strippedInputArray, strippedTransformation, targetOutput[modifiedOutputKey])[0];
    }
    
    // case 1: string -> string or string -> number
    if(typeof(actualInput[affectingInputKeys[0]]) == "string" && 
      (typeof(targetOutput[modifiedOutputKey]) == "string" || 
       typeof(targetOutput[modifiedOutputKey]) == "number" )) {
      
      var resultValue = solveForStringToString(strippedInputArray, strippedTransformation, targetOutput[modifiedOutputKey]);
      result[affectingInputKeys[0]] = resultValue;
    }

  }
  
  return result;
}

function findDependencies(actualInput, transformation) {
  // finding dependencies
  var dependencies = {};
  var actualOutput = transformation(Object.assign({}, actualInput));
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
      var diffOutput = transformation(Object.assign({}, diffInput));
  
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