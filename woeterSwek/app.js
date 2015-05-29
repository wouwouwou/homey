var App = new Object();
App.init = function() {
	
}

App.prototype.speech = function(speech) {
	
	// loop all triggers
	speech.triggers.forEach(function(trigger) {
		if (trigger.id == 'today') {
			s
			// speak the weather
			Homey.manager('speech-output').say(__("The weather today is amazing!"));
			
			// Obviously, you would get the real weather here
			// And in case you didn't know yet, __() is for translation
			
		} else if (trigger.id == 'tomorrow') {
			// ... etc.
		}
		
	});
}