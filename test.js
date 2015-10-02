var platforms = require("./js/platformsClient.js");

angular	.module('testMM', [])
		.controller	( 'testMMController', function ($scope) {
						 var testMMController	= this;
						 this.platforms			= platforms.array;
						 console.log(testMMController);
						 platforms.init		( "/MM" );
						 platforms.subscribe( function() {$scope.$apply()}
											)
						}
					);

