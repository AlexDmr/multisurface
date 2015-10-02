var L_CB = [];
var screen = window.screen;
var previousOrientation = screen.orientation || screen.mozOrientation || screen.msOrientation || "unknown";

function emitOrientation(cb) {cb(previousOrientation);}

var checkOrientation = function(){
    var orientation = screen.orientation || screen.mozOrientation || screen.msOrientation || "unknown";
	if(orientation !== previousOrientation){
		 previousOrientation = orientation;
		 L_CB.forEach( emitOrientation );
		}
};

window.addEventListener("resize", checkOrientation, false);
window.addEventListener("orientationchange", checkOrientation, false);

module.exports = { orientation	: previousOrientation
				 , subscribe	: function(cb) {L_CB.push(cb);}
				 };
				 
module.exports.subscribe( function(o) {module.exports.orientation = o;}
						);