"use strict";

function App(){


}

function speakAndLog(text, log){
	Homey.manager('speech-output').say(text);
	if (log){
		Homey.log(text);	
	}
	
}

module.exports = App;

App.prototype.init = function(){
	
	Homey.manager('ledring').animate({
		name: 'pulse'
	});
  
};

App.prototype.speech = function( speech ) {
		var log = true;
	
	    speech.triggers.forEach(function(trigger){
        if( trigger.id == 'generated6' ) {
            
            // speak the weather
			speakAndLog("I rolled the number " + Math.floor(Math.random()*6 + 1, 0), log);
            // Obviously, you would get the real weather here
            // And in case you didn't know yet, __() is for translation
            
        } else if( trigger.id == 'tomorrow' ) {
            // ...	
        } else {
				
		}
        
    });
}