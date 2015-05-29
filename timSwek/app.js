"use strict";

function App() {

}

// Lets the Homey speak 'text' and logs if true
function speakAndLog(text, log) {
	Homey.manager('speech-output').say(text);
	if (log) {
		Homey.log(text);
	}
}

module.exports = App;

App.prototype.init = function() {
		Homey.manager('ledring').animate({
		name: 'pulse'
	});
}


// Rolls a single die with of the type (sides) given
function rollDie(sides) {
	return 1 + Math.floor(Math.random() * sides);	
}



// Rolls multiple dice specified by amount and of type sides; Uses rollDie()
function rollDice(sides, amount, log) {
	speakAndLog("Rolling a virtual {0}d{1}".format(amount, sides), log); //TODO String formatting
	
	var rolls = [];
	var total = 0;
	while (amount-- > 0) {
		var resultOfThrow = rollDie(sides);
		rolls.push(resultOfThrow);
		total += resultOfThrow;
	}
	
	return rolls;
}


App.prototype.speech = function( speech ) {
	var log = true
	
	// loop all triggers
	speech.triggers.forEach(function(trigger) {
		if (trigger.id == 'throw a d6') {
			rollDice(6, 1, log);
			
			
			// Obviously, you would get the real weather here
			// And in case you didn't know yet, __() is for translation
			
		} else if (trigger.id == 'throw a dSTRING FORMATTING') {
			// ... etc.
		}
		
	});
}