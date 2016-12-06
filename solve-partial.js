// assumption: input and output are integers

function solveForNumberToNumber(actualInput, transformation, targetOutput) {
  actualOutput = transformation([actualInput]);
  if(actualOutput == targetOutput) {
    return actualInput;
  }
  
  var difference = Math.abs(actualOutput - targetOutput);
  var targetInput = actualInput;
  var stepWidth = 1.0;
  var direction = +1; // D = {-1, +1}
  var counter = 0;
  while(difference >= 0.001 && counter < 1000) {
    
    var newDifference = Math.abs(transformation([targetInput+(stepWidth*direction)]) - targetOutput);
    
    // if we head in the wrong direction
    if(newDifference > difference) { 
      direction = direction * (-1);
      if(counter > 0) {
        // do not adjust stepWidth in first run
        stepWidth = stepWidth * 0.1;
      }
    }
    targetInput = targetInput + direction*stepWidth;
    difference = Math.abs(transformation([targetInput]) - targetOutput);
    counter = counter+1;
  }
  return targetInput;
}

function solveForStringToString(actualInput, transformation, targetOutput) {
  
  var genetic = Genetic.create();
  
  var config = {
		"iterations": 4000,
		"size": 250,
		"crossover": 0.3,
		"mutation": 0.3,
		"skip": 20
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
	
  	// chromosomal drift
	  var i = Math.floor(Math.random()*entity.length)		
	  return replaceAt(entity, i, String.fromCharCode(entity.charCodeAt(i) + (Math.floor(Math.random()*2) ? 1 : -1)));
  };

  genetic.crossover = function(mother, father) {
	  // two-point crossover
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
  	
	  return [son, daughter];
  };
  
  genetic.fitness = function(entity) {
    var opt = this.userData["targetOutput"];
    var act = this.userData["transformation"](entity);
    var maxLength = max(opt.length, act.length);
    var fitness = maxLength * 127;
    
    for(var i=0; i< maxLength; ++i){
      if(opt.length < i || act.length < i){
        fitness = fitness - 127;
      } else {
        fitness = fitness - Math.abs(act.charCodeAt(i) - opt.charCodeAt(i));
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
      }
    };
  });
  
  genetic.evolve(config, userData);
  
  return prom;
  
  /* Ressources:
   * https://github.com/subprotocol/genetic-js/blob/master/examples/string-solver.html
   * http://subprotocol.com/system/genetic-js.html
   */
}