var PopupLoginController = function($scope, $rootScope) {
	
	$scope.loginUrl = window.CONFIG.paths.login;
};

PopupLoginController.$inject = ['$scope', '$rootScope'];

app.controller("PopupLoginController", PopupLoginController);