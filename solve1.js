function solve1(actualInput, transformation, targetOutput) {
  // assumption: input and output are integers
  actualOutput = transformation(actualInput);
  if(actualOutput == targetOutput) {
    return actualInput;
  }
  
  var difference = Math.abs(actualOutput - targetOutput);
  var targetInput = actualInput;
  var stepWidth = 1.0;
  var direction = +1; // D = {-1, +1}
  var counter = 0;
  while(difference >= 0.001 && counter < 1000) {
    
    var newDifference = Math.abs(transformation(targetInput+(stepWidth*direction)) - targetOutput);
    
    // if we head in the wrong direction
    if(newDifference > difference) { 
      direction = direction * (-1);
      if(counter > 0) {
        // do not adjust stepWidth in first run
        stepWidth = stepWidth * 0.1;
      }
    }
    targetInput = targetInput + direction*stepWidth;
    difference = Math.abs(transformation(targetInput) - targetOutput);
    counter = counter+1;
  }
  return targetInput;
}
