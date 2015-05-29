"use strict";

function App(){

}

module.exports = App;

App.prototype.init = function(){
	
  	setInterval(function(){
		Homey.log('Hoi Mick!');
	}, 1000);
	
	Homey.manager('ledring').animate({
		name: 'pulse'
	});
  
};

App.prototype.speech = function( speech ) {
	    speech.triggers.forEach(function(trigger){
        if( trigger.id == 'count' ) {
            
            // speak the weather
            Homey.manager('speech-output').say(("The weather today is amazing!") );
            
            // Obviously, you would get the real weather here
            // And in case you didn't know yet, __() is for translation
            
        } else if( trigger.id == 'tomorrow' ) {
            // ...	
        }
        
    });
}