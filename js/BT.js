var serialPort	= require("serialport")
  , SerialPort	= serialPort.SerialPort
  , reArduino	= /arduino/i
  ;

serialPort.list(function (err, ports) {
  console.log("Serial ports list:");
  ports.forEach(function(port) {
    console.log("\t", port.comName, ":", port.pnpId, ":", port.manufacturer);
	if(reArduino.test(port.manufacturer)) {
		 var sp = new SerialPort( port.comName//port.pnpId
								, { parser					: serialPort.parsers.readline("\n")
								  , baudRate				: 9600
								  , disconnectedCallback	: function() {console.log("disconnectedCallback");}
								  }
								);
		 sp.on("open", function () {
			 sp.on	( "data"
					, function(data) {
						 try {
							  var json = JSON.parse(data);
							 } catch(err) {}
						}
					);
			 sp.on	( "error"
					, function(err) {console.error(port.comName, ":", "error:", err);}
					);
			 sp.on	( "close"
					, function(data) {console.error(port.comName, ":", "close:", data);}
					);
			});
		}
  });
});

module.exports = serialPort;
/*
var noble		= require('noble')

// BLE noble
noble.on( 'scanStart'
		, function() {
			 console.log("scanStart:", arguments);
			}
		);
noble.on( 'scanStop'
		, function() {
			 console.log("scanStop:", arguments);
			}
		);
noble.on( 'discover'
		, function(peripheral) {
			 console.log("discover:", peripheral);
			}
		);
noble.startScanning();

*/