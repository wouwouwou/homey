var fs		= require('fs');
var path	= require('path');

var tmp 		= require('tmp');
var request		= require('request');
var archiver	= require('archiver');

var tar = require('tar-fs')

var HeaderPlayController = function($scope, $rootScope, $filter, $popup, $project)
{
	
	$scope.debugUrl		= '';
	
	$scope.project		= $project.getPath();	
	$scope.playing 		= false;
	$scope.uploading 	= false;
	$scope.stopping 	= false;
	$scope.status 		= false;
	
	$rootScope.$watch("user", function(){
		$scope.user = $rootScope.user;
	});
	
	$rootScope.$watch("activeHomey", function(){	
		$scope.updateActiveHomey();		
	});
	
	$scope.updateActiveHomey = function(){	
				
		if( typeof $rootScope.user == 'undefined' ) return;
		if( !Array.isArray($rootScope.user.homeys) ) return;
		
		$scope.homey = $filter('filter')( $rootScope.user.homeys, { _id: $rootScope.activeHomey }, true )[0];
		
		var debugUrl = 'http://' + $scope.homey.ip_internal + '/manager/devkit/?bearer_token=' + $scope.homey.token;
		$scope.debugUrl = debugUrl;
		
	}
	
	/*
	setInterval(function(){
		console.log('$scope.project', $scope.project);
		console.log('$scope.activeHomey', $scope.activeHomey);		
	}, 500);
	*/
	
	$rootScope.$on('menu.project-run', function(){
		$scope.playpause();
		
		// TODO
	});
	
	$rootScope.$on('service.project.ready', function(){
		$scope.project = $project.getPath();
	});
	
	$rootScope.$on('service.project.closed', function(){
		$scope.project = false;
	});
	
	$scope.popup = function(){
		$popup.open('debug', $scope);
	}
	
	$scope.popupOpen = false;
	
	$rootScope.$on('service.popup.open', function(){
		$scope.popupOpen = true;
	});
	
	$rootScope.$on('service.popup.close', function(){
		$scope.popupOpen = false;
	});
	
	$scope.playpause = function(){
			
		$scope.updateActiveHomey();
			
		if( typeof $scope.homey == 'undefined' ) {
			//alert('Please select a Homey first!');
			return;
		}
		
		if( $scope.stopping ) return;
		//if( $scope.uploading ) return;
			
		if( $scope.playing ) {
			$scope.stop( $scope.homey.ip_internal, $scope.homey.token );
		} else {
			$scope.play( $scope.homey.ip_internal, $scope.homey.token, false );
		}
	}
	
	$scope.play = function( address, token, brk ) {
		
		address = address || '127.0.0.1';
		brk = brk || false;
						
		// create archive
		$scope.status = 'Creating archive...';
		$scope.statusCode = 'zipping';
		
		$scope.pack( window.localStorage.project_dir, function( tmppath ){
									
			// send to homey
			$scope.$apply(function(){
				$scope.status = 'Uploading to Homey...';
				$scope.uploading = true;
			});
			
			$scope.upload( tmppath, address, token, brk, function( err, response ){
				
				console.log('response', response)
				
				$scope.$apply(function(){
					
					$scope.uploading = false;
								
					if( err ) {
						$scope.statusCode = 'error';
						$scope.status = err.toString();
						return;
					}
					
					if( response.status != 200 ) {
						$scope.statusCode = 'error';
						$scope.status = response.result.toString();
						return;					
					}
									
					if( response instanceof Error ) {
						$scope.statusCode = 'error';
						$scope.status = response.message;
						return;
					}
						
					$scope.status = 'Running';
					$scope.playing = true;
					$scope.running_app = response.result.app_id;
	
					// show logs
					$popup.open('debug', $scope);
			    });				
			});
		});
	}
	
	$scope.stop = function( address, token ){
		
		$scope.stopping = true;
		$scope.playing = false;
		$scope.status = 'Stopping ' + $scope.running_app + '...';
		
		// hide logs
		$popup.close();
		
		$scope.request = request.del({
			url: 'http://' + address + '/api/manager/devkit/' + $scope.running_app,
			headers: {
	    		'Authorization': 'Bearer ' + token
			}
		}, function( err, data, response ){
			if( err ) return callback(err);
			
			$scope.$apply(function(){
				$scope.status = false;
				$scope.stopping = false;
			});
		});
	}
	
	// functions for packing & uploading
	$scope.pack = function( app_path, callback ){
	
		// create a temporary file
		tmp.file(function(err, tmppath, fd, cleanupCallback) {

			tar
				.pack(app_path, {
					ignore: function(name) {
						// ignore dotfiles (.git, .gitignore, .mysecretporncollection etc.)
						return path.basename(name).charAt(0) === '.'
					}
				})
				.pipe(
					fs
						.createWriteStream(tmppath)
						.on('close', function(){
							callback( tmppath );
						})
					);
				
		});
	}
	
	$scope.upload = function( tmppath, address, token, brk, callback ) {
							
		// POST the tmp file to Homey
		$scope.request = request.post({
			url: 'http://' + address + '/api/manager/devkit/',
			headers: {
	    		'Authorization': 'Bearer ' + token
			}
		}, function( err, data, response ){
			if( err ) return callback(err);
			callback( null, JSON.parse(response) );
			fs.unlink( tmppath );
		});
		
		var form = $scope.request.form();
		form.append('app', fs.createReadStream(tmppath));
		form.append('brk', brk.toString());
		
	}
    
}

HeaderPlayController.$inject = ['$scope', '$rootScope', '$filter', '$popup', '$project'];

app.controller("HeaderPlayController", HeaderPlayController);