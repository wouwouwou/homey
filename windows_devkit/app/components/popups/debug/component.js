var PopupDebugController = function($scope, $rootScope) {	
	$scope.debugUrl = $scope.$parent.debugUrl;
};

PopupDebugController.$inject = ['$scope', '$rootScope'];

app.controller("PopupDebugController", PopupDebugController);