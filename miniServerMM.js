var express		= require('express')
  , bodyParser	= require("body-parser")
  , multer		= require('multer')
  , https		= require("https")
  , platforms	= require('./server/platforms.js')
  , fs			= require("fs-extra")
  , path		= require( 'path' )
  ;

var app, server
  , TLS_SSL =	{ key	: fs.readFileSync( path.join('MM.pem'		 ) )
				, cert	: fs.readFileSync( path.join('certificat.pem') )
				};	

function init(port, https_port) {
	// HTTP server
	 var upload = multer({ dest: 'uploads/' })
	 app	  	= express();
	 server		= app.use( express.static(__dirname) )
					 .use( upload.single('tempFile') )
					 .use( bodyParser.urlencoded({ extended: false }) )
					 .use( bodyParser.json() )
					 .listen(port) ;
	 console.log("HTTP server listening on port " + port);
	 
	 app.get ( "/platforms"
			 , function(req, res) {
				 res.json( platforms.getPlatforms() );
				}
			 );
					 
	// load key and certificate for HTTPS
	 if(https) {
		 https.createServer(TLS_SSL, app).listen(https_port);
		 console.log("HTTPS server listening on port " + https_port);
		}
	 
	// Socket.io server
	 var io = require('socket.io')(server,  { log: false }); //.listen( server, { log: false } );
				
	// Initialize platforms
	 platforms.init(io, "/MM");
	}


var params = {}, p;
for(var i=2; i<process.argv.length; i++) {
	p = process.argv[i].split(':');
	params[p[0]] = p[1];
}

var default_port	= 8090, default_https_port = 8443
  , port			= process.env.PORT  || params.port || default_port
  , https_port		= params.https_port || default_https_port;
console.log("Usage :\n\tnode MMserver.js [port:PORT]\n\tDefault port is", default_port);

init(port, https_port);
