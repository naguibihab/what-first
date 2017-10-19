'use strict';

angular.module('myApp.view1', ['ngRoute','nvd3'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope',function($scope) {
	 $scope.options = {
        chart: {
            type: 'scatterChart',
            height: 450,
            scatter: {
                onlyCircles: false
            },
            showDistX: false,
            showDistY: false,
            tooltipContent: function(key) {
                return '<h3>' + key + '</h3>';
            },
            duration: 350,
            xAxis: {
                axisLabel: 'Complexity/Risk',
                tickFormat: function(d){
                    return d3.format('.02f')(d);
                }
            },
            yAxis: {
                axisLabel: 'Priority/Value',
                tickFormat: function(d){
                    return d3.format('.02f')(d);
                },
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
   $scope.data = [
	   {
	      "key":"Group 0",
	      "color":"#1f77b4",
	      "values":[
	         {
	            "x":-0.5,
	            "y":-0.5,
	            "size":0.5,
	            "shape":"circle",
	            "series":0
	         }
	      ]
	   },
	   {
	      "key":"Group 1",
	      "color":"#ff7f0e",
	      "values":[
	         {
	            "x":-0.5,
	            "y":0.5,
	            "size":0.5,
	            "shape":"circle",
	            "series":0
	         }
	      ]
	   },
	   {
	      "key":"Group 2",
	      "color":"#2ca02c",
	      "values":[
	         {
	            "x":0.5,
	            "y":-0.5,
	            "size":0.5,
	            "shape":"circle",
	            "series":0
	         }
	      ]
	   },
	   {
	      "key":"Group 3",
	      "color":"#d62728",
	      "values":[
	         {
	            "x":0.5,
	            "y":0.5,
	            "size":0.5,
	            "shape":"circle",
	            "series":0
	         }
	      ]
	   }
	];
}]);