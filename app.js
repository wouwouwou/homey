"use strict";

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
			}
		});
	}

	this.move = function(field) {
		if (self.game.doMove(self.game.convertField(field).x, self.game.convertField(field).y, self.player)) {
			self.speak("Affirmative");
			self.player = (self.player == 1) ? 2 : 1;
		} else {
			self.speak("Permission denied");
		}
		if (self.game.checkWin(1)) {
			self.speak("X wins");
			self.game = null;
		} else if (self.game.checkWin(2)) {
			self.speak("O wins");
			self.game = null;
		} else {
			if (self.player == 1) {
				self.speak("X, go ahead!");
			} else {
				self.speak("O, go ahead!");
			}
		}
	}

	this.speak = function(text) {
		Homey.log(text);
	}
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
}

module.exports = App;
