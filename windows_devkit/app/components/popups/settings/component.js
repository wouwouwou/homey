var SettingsController = function($scope, $rootScope) {
	
	if(window.localStorage.sdk_settings) {
		$scope.settings = JSON.parse(window.localStorage.sdk_settings);
	}
	else {
		$scope.settings = {};
	}
	
	$scope.$watch('settings', function(newVal, oldVal){
	    window.localStorage.sdk_settings = JSON.stringify($scope.settings);
		$scope.applyTheme();
	    // hook.call('onSettingsChange', $scope.settings);
	}, true);
	
};

SettingsController.$inject = ['$scope', '$rootScope'];

app.controller("SettingsController", SettingsController);