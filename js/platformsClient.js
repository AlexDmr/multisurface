require( "./objectPolyfill.js" );
var sio = io; //require( "socket.io-client" );
var PTF = require("../bower_components/platform.js/platform.js")
  , orientation = require( "./orientation.js" )
  , platforms	= []
  , socket		
  , description	= Object.assign( PTF )
  ;
var L_CB = [];
function publish() {
	L_CB.forEach( function(cb) {cb(platforms);} );
}
  
description.screen 			= { width		: window.screen.width
							  , height		: window.screen.height
							  , orientation	: orientation.orientation
							  };
description.window			= { width		: window.innerWidth
							  , height		: window.innerHeight
							  };

orientation.subscribe( function(o) {
							 description.screen.orientation = o;
							 if(socket) {
								 socket.emit( "update"
											, {screen: description.screen}
											);
								}
							} 
					 );

function init_SIO(roomName) {
	socket = sio( window.location.origin + "/MM" );
	socket.emit	( "register"
				, description
				, function(res) {
					 console.log("register =>", res);
					}
				);

	socket.on	( "platforms"
				, function(data) {
					 console.log("platforms", data);
					 while(platforms.length) {platforms.pop();}
					 for(var i=0; i<data.length; i++) {
						 platforms.push( data[i] );
						}
					 publish();
					}
				);

	socket.on	( "append"
				, function(data) {
					 console.log("append", data);
					 for(var i=0; i<platforms.length; i++) {
						 if(platforms[i].id === data.id) {return;}
						}
					 platforms.push( data );
					 publish();
					}
				);
				
	socket.on	( "update"
				, function(data) {
					 console.log("update", data);
					 publish();
					}
				);
				
	socket.on	( "remove"
				, function(data) {
					 console.log("remove", data);
					 for(var i=0; i<platforms.length; i++) {
						 if(platforms[i].id === data.id) {
							 platforms.splice(i, 1) ;
							 break;
							}
						}				 
					 publish();
					}
				);
}

module.exports = { array	: platforms
				 , subscribe: function(cb)		 {L_CB.push(cb);}
				 , init		: init_SIO
				 };
				 
				 
				 
