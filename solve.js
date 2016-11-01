function solve(actualInput, transformation, targetOutput) {
  // assumption: input and output are integers
  actualOutput = transformation(actualInput);
  if(actualOutput == targetOutput) {
    return actualInput;
  }
  
  var difference = Math.abs(actualOutput - targetOutput);
  var targetInput = actualInput;
  while(difference >= 0.1) {
    var newDifference = Math.abs(transformation(targetInput+1) - targetOutput);
    if(newDifference < difference) {
      targetInput++;
    } else {
      targetInput--;
    }
    difference = Math.abs(transformation(targetInput) - targetOutput);
  }
  return targetInput;
}
