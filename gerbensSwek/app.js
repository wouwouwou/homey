"use strict";

var request = require('request');

function App(){


}

function speakAndLog(text, log){
	Homey.manager('speech-output').say(text);
	if (log){
		Homey.log(text);	
	}
	
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function rollDie(numberOfSides){
	return Math.floor(Math.random()*numberOfSides + 1, 0)
}

function getInformation(name){
	
	name = toTitleCase(name);
	request.get("https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles="+name
				, function(error, response, body){
		
		var object = JSON.parse(body);
		if(object.query != undefined){
			if(object.query.pages != undefined){
				if(Object.keys(object.query.pages).length > 0){
					var extract = object.query.pages[Object.keys(object.query.pages)[0]].extract;
					if(extract != undefined){
						speakAndLog("Some information about "+ name + ". \n" + extract.split("\n")[0], true);
					} else {
						speakAndLog(extract, true);
					}
				} else {
					speakAndLog("No info found!", true);
				}
			}
		}
		
	});

	
	
	
}

module.exports = App;

App.prototype.init = function(){
	
  
};

App.prototype.speech = function( speech ) {
		var log = true;
		Homey.log(speech);
	    speech.triggers.forEach(function(trigger){
        if( trigger.id == 'giveinfo' ) {
			var transcript = speech.transcript;
			getInformation(transcript.replace("give information about ", ""));
			
            // ...	
        } else {
			getInformation("Google");
		}
        
    });
}