'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.whattodofirst',
  'myApp.version',
  'firebase',
  'nvd3'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/main'});

    // Initialize Firebase
	  var config = {
	    apiKey: "AIzaSyAmGv5YUVVznBUOOoX0G6qc0G8WKhNJrdA",
	    authDomain: "angularattack-whattodofirst.firebaseapp.com",
	    databaseURL: "https://angularattack-whattodofirst.firebaseio.com",
	    projectId: "angularattack-whattodofirst",
	    storageBucket: "angularattack-whattodofirst.appspot.com",
	    messagingSenderId: "562416859020"
	  };
	  firebase.initializeApp(config);
}]);
