'use strict';

angular.module('myApp.whattodofirst', ['ngRoute','nvd3'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/main', {
    templateUrl: 'modules/whattodofirst/main.html',
    controller: 'whattodofirstMainCtrl'
  })
  .when('/todo/:refKey', {
    templateUrl: 'modules/whattodofirst/todo.html',
    controller: 'whattodofirstTodoCtrl'
  });
}])

.controller('whattodofirstMainCtrl', ['$scope','$firebaseArray','$location',
	function($scope,$firebaseArray,$location) {
	// This controller creates a new list id
	var ref = firebase.database().ref();
	var firebaseObject = $firebaseArray(ref);
	$scope.data = firebaseObject;
	// TODO: Data needs to have an expiry date that gets refreshed when someone updates it
	$scope.createnewid = function(){
		firebaseObject.$add({}).then(function(newRef){
			console.log("Success: ",newRef.ref.key);
			// TODO: Show a success message
			$location.url('/todo/'+newRef.ref.key);
		}, function(error) {
			console.log("Error happened: ",error);
			// TODO: Need to show a message here telling them something went wrong
		});
	}
}])

.controller('whattodofirstTodoCtrl', ['$scope','$firebaseArray','$routeParams',
	function($scope,$firebaseArray,$routeParams) {

	var refKey = $routeParams.refKey;
	var ref = firebase.database().ref().child(refKey);
	$scope.tasks = $firebaseArray(ref);

	$scope.addTask = function() {
		$scope.tasks.$add({
			name: '',
			priority: 0,
			complexity: 0,
			x: 0,
			y: 0
		});
	};

	$scope.editTask = function(task){
		task.x = task.complexity / 100;
		task.y = task.priority / 100;
		$scope.tasks.$save(task);
	}

  	// Chart
	$scope.chart = [];
	$scope.chart.options = {
		chart: {
		    type: 'scatterChart',
		    height: 450,
		    scatter: {
		        onlyCircles: false
		    },
		    showDistX: false,
		    showDistY: false,
		    tooltip: {
		    	contentGenerator: function(obj){
		    		return '<h4>'+obj.point.name+'</h4>';
		    	}
		    },
		    duration: 350,
		    xAxis: {
		        axisLabel: 'Complexity/Risk'
		    },
		    yAxis: {
		        axisLabel: 'Priority/Value',
		        axisLabelDistance: -5
		    },
		    forceY: [-1, 1],
			forceX: [-1, 1],
		    zoom: {
		        //NOTE: All attributes below are optional
		        enabled: false,
		        scaleExtent: [1, 10],
		        useFixedDomain: false,
		        useNiceScale: false,
		        horizontalOff: false,
		        verticalOff: false,
		        unzoomEventType: 'dblclick.zoom'
		    }
		}
	};

	$scope.chart.data = [
		{
		  color:"#1f77b4",
		  values:[]
		}
	];

	$scope.chart.data[0].values = $scope.tasks;

}]);