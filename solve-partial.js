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

function solveForStringToString(actualInput, transformation, targetOutput) {
  
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
    "actualInput": actualInput[0],
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
	  
	  
	  //lengthening and shortening
	  var rand = Math.random();
	  if(rand < 0.1 ){ //shorten
	    return entity.substr(0, entity.length - 1);
	  }
	  if(rand < 0.2){ //lengthen
	    return entity + 'e';
	  }
	  
	
  	// chromosomal drift
	  var i = Math.floor(Math.random()*entity.length)		
	  return replaceAt(entity, i, String.fromCharCode(entity.charCodeAt(i) + (Math.floor(Math.random()*2) ? 1 : -1)));
  };

  genetic.crossover = function(mother, father) {
	  /* two-point crossover
	  var len = mother.length;
	  var ca = Math.floor(Math.random()*len);
	  var cb = Math.floor(Math.random()*len);		
	  if (ca > cb) {
	  	var tmp = cb;
	  	cb = ca;
	  	ca = tmp;
	  }
	  	
	  var son = father.substr(0,ca) + mother.substr(ca, cb-ca) + father.substr(cb);
  	var daughter = mother.substr(0,ca) + father.substr(ca, cb-ca) + mother.substr(cb);
  	
  	*/
	  return [father, mother];
  };
  
  genetic.fitness = function(entity) {
    var opt = this.userData["targetOutput"];
    var act = (this.userData["transformation"](entity)).toString();
    var maxLength = Math.max(opt.length, act.length);
    var fitness = opt.length * 127;
    
    for(var i=1; i<= maxLength; ++i){
      if(opt.length < i || act.length < i){
        fitness = fitness - 127;
      } else {
        fitness = fitness - Math.abs(act.charCodeAt(i-1) - opt.charCodeAt(i-1));
      }
    }
    
    return fitness;
  };
  
  
  genetic.generation = function(pop, generation, stats) {
	  // stop running once we've reached the solution OR after 1000 generations
	  return this.userData["transformation"](pop[0].entity) != this.userData["targetOutput"];
  };
  
  var prom = new Promise((resolve, reject) => {
    genetic.notification = function(pop, generation, stats, isFinished) {
      if(isFinished) {
        resolve(pop[0].entity);
        //console.log(stats);
        //console.log(generation);
      }
    };
  });
  
  genetic.evolve(config, userData);

  return prom;
  
}

function solveForStringToNumber(actualInput, transformation, targetOutput) {
  
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
    "actualInput": actualInput[0],
    "transformation": transformation,
    "targetOutput": targetOutput
  };
  
  genetic.optimize = Genetic.Optimize.Minimize;
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
	  
	  
	  //lengthening and shortening
	  var rand = Math.random();
	  if(rand < 0.1 ){ //shorten
	    return entity.substr(0, entity.length - 1);
	  }
	  if(rand < 0.2){ //lengthen
	    return entity + 'e';
	  }
	  
	
  	// chromosomal drift
	  var i = Math.floor(Math.random()*entity.length)		
	  return replaceAt(entity, i, String.fromCharCode(entity.charCodeAt(i) + (Math.floor(Math.random()*2) ? 1 : -1)));
  };
  
  genetic.crossover = function(mother, father) {
	  /* two-point crossover
	  var len = mother.length;
	  var ca = Math.floor(Math.random()*len);
	  var cb = Math.floor(Math.random()*len);		
	  if (ca > cb) {
	  	var tmp = cb;
	  	cb = ca;
	  	ca = tmp;
	  }
	  	
	  var son = father.substr(0,ca) + mother.substr(ca, cb-ca) + father.substr(cb);
  	var daughter = mother.substr(0,ca) + father.substr(ca, cb-ca) + mother.substr(cb);
  	
  	*/
	  return [father, mother];
  };
  
  genetic.fitness = function(entity) {
    var opt = this.userData["targetOutput"];
    var act = (this.userData["transformation"](entity));
    
    var fitness = Math.abs(opt - act);
    
    return fitness;
  };
  
  
  genetic.generation = function(pop, generation, stats) {
	  // stop running once we've reached the solution OR after 1000 generations
	  return this.userData["transformation"](pop[0].entity) != this.userData["targetOutput"];
  };
  
  var prom = new Promise((resolve, reject) => {
    genetic.notification = function(pop, generation, stats, isFinished) {
      if(isFinished) {
        resolve(pop[0].entity);
        //console.log(stats);
        //console.log(generation);
      }
    };
  });
  
  genetic.evolve(config, userData);

  return prom;

}



//test for some numeric stuff
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

/* HELPERS */

function rectifyFloat(number, stepWidth) {
  return parseFloat(number.toFixed(((1/stepWidth) % 10) + 1));
}