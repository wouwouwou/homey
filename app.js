"use strict";

var request = require('request');

function App(){
	var self = this;

	this.game = null;
	this.player = 0;

	this.speech = function( speech ) {
		speech.triggers.forEach(function(trigger){
			if (trigger.id == 'startTictactoe') {
				self.game = new Game();
				self.speak("Starting new game, X, go ahead!");
				self.player = 1;
			} else if (trigger.id == 'moveOne') {
				self.move(1);
			} else if (trigger.id == 'moveTwo') {
				self.move(2);
			} else if (trigger.id == 'moveThree') {
				self.move(3);
			} else if (trigger.id == 'moveFour') {
				self.move(4);
			} else if (trigger.id == 'moveFive') {
				self.move(5);
			} else if (trigger.id == 'moveSix') {
				self.move(6);
			} else if (trigger.id == 'moveSeven') {
				self.move(7);
			} else if (trigger.id == 'moveEight') {
				self.move(8);
			} else if (trigger.id == 'moveNine') {
				self.move(9);
			} else if( trigger.id == 'giveinfo' ) {
			var transcript = speech.transcript;
			getInformation(transcript.replace("give information about ", ""));
        } 
        
    });
}


	this.move = function(field) {
		if (self.game == null) {
			self.speak("You must construct additional pylons, or start a game first.");
			return;
		}
		if (self.game.doMove(self.game.convertField(field).x, self.game.convertField(field).y, self.player)) {
			self.speak("Affirmative");
			self.player = (self.player == 1) ? 2 : 1;
		} else {
			self.speak("I can't let you do that Dave!");
		}
		if (self.game.checkWin(1)) {
			self.speak("X wins");
			self.game = null;
		} else if (self.game.checkWin(2)) {
			self.speak("O wins");
			self.game = null;
		} else if (self.game.checkFull()) {
			self.speak("Tie. Game over.");
			self.game = null;
		} else {
			if (self.player == 1) {
				Homey.manager('ledring').animate({
					name: 'pulse',
					color: 'red'
				});
				self.speak("X, go ahead!");
			} else {
				Homey.manager('ledring').animate({
					name: 'pulse',
					color: 'green'
				});
				self.speak("O, go ahead!");
			}
		}
	}

	this.speak = function(text) {
		Homey.log(text);
		Homey.manager('speech-output').say(text);
	}
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
						speakAndLog("Some information about "+ name + ". \n" + extract, true);
					}
				} else {
					speakAndLog("No info found!", true);
				}				
				
			} else {
				speakAndLog("No info found!", true);
			}			
			
		} else {
			speakAndLog("No info found!", true);
		}
		
	});
	
}

function Game() {
	var self = this;
	this.field = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];

	this.convertField = function(field) {
		field -= 1;
		return { 'x': field % 3, 'y': Math.floor(field / 3) };
	}

	this.doMove = function(x, y, value) {
		var returnval = false;
		if (returnval = (self.field[x][y] == 0)) self.field[x][y] = value;
		return returnval;
	}

	this.checkWin = function(player) {
		var f = self.field;
		for (var y = 0; y < f.length; y++) {
			var row = true;
			for (var x = 0; x < f[y].length; x++) {
				row = row && (f[y][x] == player);
			}
			if (row) return true;
		}
		for (var x = 0; x < f.length; x++) {
			var col = true;
			for (var y = 0; y < f[x].length; y++) {
				col = col && (f[y][x] == player);
			}
			if (col) return true;
		}
		var diagltrb = true;
		var diagrtlb = true;
		for (var a = 0; a < f.length; a++) {
			diagltrb = diagltrb && (f[a][a] == player);
			diagrtlb = diagrtlb && (f[a][f.length - (a + 1)] == player);
		}
		if (diagltrb) return true;
		if (diagrtlb) return true;
		return false;
	}

	this.checkFull = function() {
		var f = self.field;
		for (var y = 0; y < f.length; y++) {
			for (var x = 0; x < f[y].length; x++) {
				if (f[y][x] == 0) return false;
			}
		}
		return true;
	}
}

module.exports = App;
