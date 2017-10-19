'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope','$firebaseArray',function($scope,$firebaseArray) {
	// This controller creates a new list id
	var ref = firebase.database().ref();
	var firebaseObject = $firebaseArray(ref);
	$scope.data = firebaseObject;
	// TODO: Data needs to have an expiry date that gets refreshed when someone updates it
	$scope.createnewid = function(){
		firebaseObject.$add({title: 'My ToDo List'}).then(function(newRef){
			console.log("Success: ",newRef)
			// TODO: Show a success message
		}, function(error) {
			console.log("Error happened: ",error);
			// TODO: Need to show a message here telling them something went wrong
		});
	}
}]);