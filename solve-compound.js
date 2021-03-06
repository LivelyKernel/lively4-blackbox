// assumption: input and output are flat dictionaries

async function solve(actualInput, transformation, targetOutput) { 
  console.log("solve2 entered");
  var dependencies = findDependencies(actualInput, transformation);
  var targetInput = Object.assign({}, actualInput);
  // 1. find changes output values
  var actualOutput = transformation(actualInput);
  var modifiedOutputKeys = Array.from(findVaryingKeys(actualOutput, targetOutput));
  
  for(let modifiedOutputKey of modifiedOutputKeys){
    // 2. find corresponding input values;
    //    or: output is independent -> no solution
    var affectingInputKeys = new Set();
    
    for (var inputKey in dependencies) {
      var dependantOutputKeys = dependencies[inputKey];
      if(dependantOutputKeys.includes(modifiedOutputKey)) {
        affectingInputKeys.add(inputKey);
      }
    }
    
    // 3. solving: for each modified output variable, find solution by modifying affecting input keys
    affectingInputKeys = Array.from(affectingInputKeys);
    var solutions = await solveForSingleOutput(actualInput, transformation, targetOutput, affectingInputKeys, modifiedOutputKey);
    for (var solvedInputKey in solutions) {
      targetInput[solvedInputKey] = solutions[solvedInputKey];
    }
  }
  
  return targetInput;
}

async function solveForSingleOutput(actualInput, transformation, targetOutput, affectingInputKeys, modifiedOutputKey) {
  
  // wrap transformation function
  //function takes an array of values representing the affectingInputKeys
  //returns the value of the output key we are currently solving for
  window.actualInput = actualInput;
  window.affectingInputKeys = affectingInputKeys;
  window.transformation = transformation;
  window.modifiedOutputKey = modifiedOutputKey;
  function strippedTransformation(inputValues) {
    var modifiedInput = Object.assign({}, window.actualInput);
    var i=0;
    window.affectingInputKeys.forEach(function(key){
      modifiedInput[key] = inputValues[i++];
    });
    return window.transformation(modifiedInput)[window.modifiedOutputKey];
  };
    
  //create an array containing just the values of the affectingInputKeys ie. the seed to start solving from
  var strippedInputArray = [];
  var i=0;
  for(let i=0; i<affectingInputKeys.length; ++i) {
    strippedInputArray[i] = actualInput[affectingInputKeys[i]];
  }
  
  //object to store all the solved input key-value pairs in
  var result = {};
  
  var allAffectingInputKeysAreNumbers = true;
  for(let affectingInputKey of affectingInputKeys) {
    if(typeof(actualInput[affectingInputKey]) != "number") {
      allAffectingInputKeysAreNumbers = false;
    }
  }
  
  if(allAffectingInputKeysAreNumbers && typeof(targetOutput[modifiedOutputKey]) == "number") {
    var resultValues = await solveForManyNumbers(strippedInputArray, strippedTransformation, targetOutput[modifiedOutputKey]);
    for(let i=0; i<affectingInputKeys.length; ++i) {
      result[affectingInputKeys[i]] = resultValues[i];
    }
  } else {
    var resultValues = await solveForAny(strippedInputArray, strippedTransformation, targetOutput[modifiedOutputKey]);
    for(let i=0; i<affectingInputKeys.length; ++i) {
      result[affectingInputKeys[i]] = resultValues[i];
    }
  }
  
  return result;
}


async function solve2(actualInput, transformation, targetOutput) { 
  console.log("solve2 entered");
  var dependencies = findDependencies(actualInput, transformation);
  var targetInput = Object.assign({}, actualInput);
  // 1. find changes output values
  var actualOutput = transformation(actualInput);
  var modifiedOutputKeys = Array.from(findVaryingKeys(actualOutput, targetOutput));
  
  for(let modifiedOutputKey of modifiedOutputKeys){
    // 2. find corresponding input values;
    //    or: output is independent -> no solution
    var affectingInputKeys = new Set();
    
    for (var inputKey in dependencies) {
      var dependantOutputKeys = dependencies[inputKey];
      if(dependantOutputKeys.includes(modifiedOutputKey)) {
        affectingInputKeys.add(inputKey);
      }
    }
    
    // 3. solving: for each modified output variable, find solution by modifying affecting input keys
    affectingInputKeys = Array.from(affectingInputKeys);
    var solutions = await solveForSingleOutput2(actualInput, transformation, targetOutput, affectingInputKeys, modifiedOutputKey);
    console.log("solveForSingleOutput returned");
    for (var solvedInputKey in solutions) {
      targetInput[solvedInputKey] = solutions[solvedInputKey];
    }
  }
  
  return targetInput;
}

async function solveForSingleOutput2(actualInput, transformation, targetOutput, affectingInputKeys, modifiedOutputKey) {
  console.log("solveForSingleOutput entered");
  
  // wrap transformation function
  //function takes an array of values representing the affectingInputKeys
  //returns the value of the output key we are currently solving for
  window.actualInput = actualInput;
  window.affectingInputKeys = affectingInputKeys;
  window.transformation = transformation;
  window.modifiedOutputKey = modifiedOutputKey;
  function strippedTransformation(inputValues) {
    var modifiedInput = Object.assign({}, window.actualInput);
    var i=0;
    window.affectingInputKeys.forEach(function(key){
      modifiedInput[key] = inputValues[i++];
    });
    return window.transformation(modifiedInput)[window.modifiedOutputKey];
  };
    
  //create an array containing just the values of the affectingInputKeys ie. the seed to start solving from
  var strippedInputArray = [];
  var i=0;
  for(let i=0; i<affectingInputKeys.length; ++i) {
    strippedInputArray[i] = actualInput[affectingInputKeys[i]];
  }
  
  //object to store all the solved input key-value pairs in
  var result = {};
  
  // case 0: output keys with no dependency (trivial case, potentially unsolvable)
  if(affectingInputKeys.length == 0) {
    // do nothing
  }
  
  // case 1: output keys with only one dependency (easy case)
  if(affectingInputKeys.length == 1) {
    
    // case 1.0: number -> number
    if(typeof(actualInput[affectingInputKeys[0]]) == "number" &&
       typeof(targetOutput[modifiedOutputKey]) == "number") {
      console.log("int int case entered");
      //just call int int solver and assign the result to the right key
      result[affectingInputKeys[0]] = (await solveForNumberToNumber(strippedInputArray, strippedTransformation, targetOutput[modifiedOutputKey]))[0];
      console.log("solveForNumberToNumber returned");
    }
    
    // case 1.1: string -> string
    if(typeof(actualInput[affectingInputKeys[0]]) == "string" && 
       typeof(targetOutput[modifiedOutputKey]) == "string") {
      
      var resultValue = await solveForStringToString(strippedInputArray, strippedTransformation, targetOutput[modifiedOutputKey]);
      result[affectingInputKeys[0]] = resultValue;
    }
    
    // case 1.2: string -> number
    if(typeof(actualInput[affectingInputKeys[0]]) == "string" && 
       typeof(targetOutput[modifiedOutputKey]) == "number" ) {
      
      var resultValue = await solveForStringToNumber(strippedInputArray, strippedTransformation, targetOutput[modifiedOutputKey]);
      result[affectingInputKeys[0]] = resultValue;
    }
  }
    
  // case 2: output keys with more than one dependency (hard case)
  if(affectingInputKeys.length > 1) {
    // case 2.0: numbers -> number
    var allAffectingInputKeysAreNumbers = true;
    for(let affectingInputKey of affectingInputKeys) {
      if(typeof(actualInput[affectingInputKey]) != "number") {
        allAffectingInputKeysAreNumbers = false;
      }
    }
    if(allAffectingInputKeysAreNumbers && typeof(targetOutput[modifiedOutputKey]) == "number") {
      var resultValues = await solveForManyNumbers(strippedInputArray, strippedTransformation, targetOutput[modifiedOutputKey]);
      for(let i=0; i<affectingInputKeys.length; ++i) {
        result[affectingInputKeys[i]] = resultValues[i];
      }
    } else {
      var resultValues = await solveForAny(strippedInputArray, strippedTransformation, targetOutput[modifiedOutputKey]);
      for(let i=0; i<affectingInputKeys.length; ++i) {
        result[affectingInputKeys[i]] = resultValues[i];
      }
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