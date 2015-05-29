var path = require('path');

app.controller("WidgetLedringController", function( $scope, $rootScope, $interval ){
	
	$scope.animation = [];
	$scope.currentFrame = 0;
	$scope.fps = 30;
		
	$interval(function(){
		$scope.currentFrame = ($scope.currentFrame+1) % 30;
	}, 1000 / $scope.fps);

	// animate on filechange
	$rootScope.$on('editor.saved.' + $scope.file_path, function(){
		$scope.animate();
	});
		
	$rootScope.$on('editor.focus.' + $scope.file_path, function(){
		$scope.animate();
	});
		
	$scope.animate = function(){
						
		if( $scope.file_path != $scope.$parent.active ) return;
		
		var oneColorPath = path.join(process.cwd(), 'app', 'components', 'widgets', 'ledring', 'one-color-all.js');
		
		// fucking windows: replace slashes \ -> \\	
		if( process.platform == 'win32' ) {
			oneColorPath = oneColorPath.replace(/\\/g, '\\\\')
		}
				
		var homeyCode = 'global.Homey = { color: require("' + oneColorPath + '") }; ';
				
		var code = homeyCode + $scope.file.code;
				
		var animation = requireFromString( code );
				
		try {
			animation = animation();	
			$scope.animation = animation;
		} catch( e ) {
			// TODO: display nicely
			alert(e.message)
		}
	}

	$scope.animate();
	
});

function requireFromString(src, filename) {	
	var Module = global.require('module');
	var m = new Module();
	m._compile(src, filename);
	return m.exports;
}