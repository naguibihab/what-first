'use strict';

angular.module('myApp.whattodofirst', ['ngRoute','nvd3','tableSort'])

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

	// Fetch old URLs from Projects (saved on localstorage)
	if(localStorage.getItem("projectIds") != null)
	{
		$scope.allProjectIds = JSON.parse(localStorage.getItem("projectIds"));
	}
	$scope.createnewid = function(){
		firebaseObject.$add({}).then(function(newRef){
			console.log("Success: ",newRef.ref.key);
			$location.url('/todo/'+newRef.ref.key);
		}, function(error) {
			console.log("Error happened: ",error);
		});
	}
}])

.controller('whattodofirstTodoCtrl', ['$scope','$firebaseArray','$routeParams','$filter','$location',
	function($scope,$firebaseArray,$routeParams,$filter,$location) {

	// Variables
	var allProjectIds = [];
	var project = {};
	var shapes = ['circle','square','triangle-up','cross'];
	$scope.chartData=false;
	$scope.loader=true;

	var refKey = $routeParams.refKey;
	var ref = firebase.database().ref().child(refKey);
	$scope.tasks = $firebaseArray(ref);

	$scope.tasks.$loaded(
	    function(data) {
	    	$scope.chartData=true;
			$scope.loader=false;
			$scope.tasks.length == 0 ? $scope.addTask() : '';
	    }
	);

	/*Localstorage save attempted project part*/
	var flag = false;
	if(localStorage.getItem("projectIds") != null)
	{
		allProjectIds = JSON.parse(localStorage.getItem("projectIds"));
	
		angular.forEach(JSON.parse(localStorage.getItem("projectIds")), function(value, key) {
		        if (value.id==refKey) {
		            flag = true;
		            $scope.project = value;
		        }

		    });
	}

	if(flag==false){
		project.id = refKey;
		project.title = "";
		allProjectIds.push(project);
		localStorage.setItem("projectIds", JSON.stringify(allProjectIds));
	}
	/*END OF Localstorage end attempted project*/

	// Triggered functions
	$scope.addTask = function() {
		$scope.tasks.$add({
			name: 'new task',
			priority: 0,
			complexity: 0,
			x: 0,
			y: 0,
			category: 1
		});
		$("#tickets").animate({ scrollTop: $('#tickets').prop("scrollHeight")}, 500);
	};

	$scope.backToHome = function() {
		$location.url('/main');
	}

	$scope.updateProject = function(project) {
		var allProjectIds = [];
		angular.forEach(JSON.parse(localStorage.getItem("projectIds")), function(value, key) {
				
		        if (value.id==refKey) {
		            value.title = project.title;
		        }

		        allProjectIds.push(value);

		    });
		localStorage.setItem("projectIds", JSON.stringify(allProjectIds));
	};

	$scope.editTask = function(task){

		console.info('Editing task',angular.copy(task));

		if(task.complexity <= 5 && task.priority >= 5){
			// Category 1
			task.shape = shapes[0];
			task.category = 1;
		} else if(task.complexity >= 5 && task.priority >= 5){
			// Category 2
			task.shape = shapes[1];
			task.category = 2;
		} else if(task.complexity <= 5 && task.priority <= 5) {
			// Category 3
			task.shape = shapes[2];
			task.category = 3;
		} else {
			// Category 4
			task.shape = shapes[3];
			task.category = 4;
		}

		task.x = task.complexity;
		task.y = task.priority;
		$scope.tasks.$save(task);
	}

  	// Chart related variables
	$scope.chart = [];
	$scope.chart.options = {
		chart: {
		    type: 'scatterChart',
		    showLegend: false,
		    height: 450,
		    scatter: {
		        onlyCircles: false
		    },
		    showDistX: false,
		    showDistY: false,
		    tooltip: {
		    	contentGenerator: function(obj){
		    		return '<span>'+obj.point.name+'</span>';
		    	}
		    },
		    margin:{
		    	left: 100,
		    	right: 100
		    },
		    duration: 350,
		    xAxis: {
		        axisLabel: 'Complexity / Risk',
		        ticks: 2
		    },
		    yAxis: {
		        axisLabel: 'Priority / Value',
		        axisLabelDistance: -5,
		        ticks: 2
		    },
		    pointRange: [200, 200],
		    forceY: [0, 10],
			forceX: [0, 10],
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
			key: 'cat 1',
			color: '#41AC49',
			values:[]
		},
		{
			key: 'cat 2',
			color: '#25408F',
			values:[]
		},
		{
			key: 'cat 3',
			color: '#FDF200',
			values:[]
		},
		{
			key: 'cat 4',
			color: '#D2232A',
			values:[]
		}
	];

	$scope.chart.data[0].values = $firebaseArray(ref.orderByChild('category').equalTo(1));
	$scope.chart.data[1].values = $firebaseArray(ref.orderByChild('category').equalTo(2));
	$scope.chart.data[2].values = $firebaseArray(ref.orderByChild('category').equalTo(3));
	$scope.chart.data[3].values = $firebaseArray(ref.orderByChild('category').equalTo(4));

}]);