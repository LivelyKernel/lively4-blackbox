/* Ressources on Genetic.js:
 * https://github.com/subprotocol/genetic-js/blob/master/examples/string-solver.html
 * http://subprotocol.com/system/genetic-js.html
 */

function solveForNumberToNumber(actualInput, transformation, targetOutput) {
  var actualOutput = transformation(actualInput);
  if(actualOutput == targetOutput) {
    return actualInput;
  }

  var difference = Math.abs(actualOutput - targetOutput);
  var targetInput = actualInput[0]; //extract the only element of the input array
  var stepWidth = 1.0;
  var direction = +1; // D = {-1, +1}
  var counter = 0;
  while(difference >= 0.001 && counter < 1000) {

    var newDifference = Math.abs(transformation([targetInput+(stepWidth*direction)]) - targetOutput);
    newDifference = rectifyFloat(newDifference, stepWidth);

    // if we head in the wrong direction
    if(newDifference > difference) {
      direction = direction * (-1);
      if(counter > 0) {
        // do not adjust stepWidth in first run
        stepWidth = stepWidth * 0.1;
      }
    }
    targetInput = targetInput + direction*stepWidth;
    targetInput = rectifyFloat(targetInput, stepWidth);
    difference = Math.abs(transformation([targetInput]) - targetOutput);
    difference = rectifyFloat(difference, stepWidth);
    counter = counter+1;
  }
  return new Promise((resolve, reject) => {
    resolve([targetInput]);
  });
}

function solveForManyNumbers(actualInputArray, transformation, targetOutput) {

  var functionToMinimize = function(inputConfiguration){
    return Math.abs(transformation(inputConfiguration) - targetOutput);
  };


  var solution = numeric.uncmin(functionToMinimize,actualInputArray).solution;
  //console.log(solution);
  // return solution;
  return new Promise((resolve, reject) => {
    resolve(solution);
  });

}

function solveForAny(actualInput, transformation, targetOutput) {
  var genetic = Genetic.create();

  var config = {
		"iterations": 4000,
		"size": 250,
		"crossover": 0,
		"mutation":1,
		"skip": 20,
		"webWorkers": false,
	};

  var userData = {
    "actualInput": actualInput,
    "transformation": transformation,
    "targetOutput": targetOutput
  };

  genetic.optimize = Genetic.Optimize.Maximize;
  genetic.select1 = Genetic.Select1.Tournament2;
  genetic.select2 = Genetic.Select2.Tournament2;

  genetic.seed = function() {
    // evolution starts off with given input
    return this.userData["actualInput"];
  };

  genetic.mutate = function(entity) {
  	function replaceAt(str, index, character) {
		  return str.substr(0, index) + character + str.substr(index+character.length);
	  }

	  // randomly choose value to mutate
	  var idx = Math.floor(Math.random() * entity.length);

	  if(typeof(entity[idx]) === "boolean") {
	    entity[idx] = !entity[idx];
	  } else if(typeof(entity[idx]) === "number") {
	    var rand = Math.random();
  	  if(rand < 0.5 ){
    	  ++entity[idx];
  	  } else {
  	    --entity[idx];
  	  }
	  } else if(typeof(entity[idx]) === "string") {
  	  // lengthening, shortening, or character replacement
  	  var rand = Math.random();
  	  if(rand < 0.1 ){
  	    //shorten
  	    entity[idx] = entity[idx].substr(0, entity[idx].length - 1);
	    } else if(rand < 0.2){
	      //lengthen
	      entity[idx] += 'e';
	    } else {
	      // chromosomal drift
	      var i = Math.floor(Math.random()*entity[idx].length);
	      entity[idx] = replaceAt(entity[idx], i, String.fromCharCode(entity[idx].charCodeAt(i) +   (Math.floor(Math.random()*2) ? 1 : -1)));
	    }
	  }
    
	  return entity;
  };

  genetic.crossover = function(mother, father) {
	  return [father, mother];
  };

  genetic.fitness = function(entity) {

    if(typeof(this.userData["targetOutput"]) === "boolean") {
      var opt = this.userData["targetOutput"];
      var act = (this.userData["transformation"](entity));
      return opt === act ? 1 : 0;
    }

    if(typeof(this.userData["targetOutput"]) === "number") {
      var opt = this.userData["targetOutput"];
      var act = (this.userData["transformation"](entity));
      return -(Math.abs(opt - act));
    }

    if(typeof(this.userData["targetOutput"]) === "string") {
      var opt = this.userData["targetOutput"];
      var act = (this.userData["transformation"](entity)).toString();
      return chirs(opt, act);
    }
  };

  genetic.generation = function(pop, generation, stats) {
	  // stop running once we've reached the solution OR after 1000 generations
	  return this.userData["transformation"](pop[0].entity) != this.userData["targetOutput"];
  };

  var prom = new Promise((resolve, reject) => {
    genetic.notification = function(pop, generation, stats, isFinished) {
      if(isFinished) {
        resolve(pop[0].entity);
      }
    };
  });

  genetic.evolve(config, userData);

  return prom;

}
/* HELPERS */

function rectifyFloat(number, stepWidth) {
  return parseFloat(number.toFixed(((1/stepWidth) % 10) + 1));
}

/* DISTANCE FUNCTIONS */

function chirs(optimal, actual) {
  var numChars = 127;
  var maxLength = Math.max(optimal.length, actual.length);
  var fitness = optimal.length * 127;

  for(var i=1; i<= maxLength; ++i){
    if(optimal.length < i || actual.length < i){
      fitness -= 127;
    } else {
      fitness -= Math.abs(actual.charCodeAt(i-1) - optimal.charCodeAt(i-1));
    }
  }

  return fitness;
}

function levenshtein(a, b) {
  var i = a.length;
  var j = b.length;
  if(Math.min(i,j) == 0) {
    return Math.max(i,j);
  }
  return Math.min(
    ( levenshtein(a.slice(0,-1), b) + 1 ),
    ( levenshtein(a, b.slice(0,-1)) + 1 ),
    ( levenshtein(a.slice(0,-1), b.slice(0,-1)) + (a[a.length-1] != b[b.length-1]) )
  );
}
