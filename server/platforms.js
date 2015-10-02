var platforms	= {}
  , sio
  , idPtf		= 0;

module.exports = {
	  getPlatforms			: function() {
		 var res = [];
		 for(var p in platforms) {
			 res.push( { id	: p, platform: platforms[p].descr} );
			}
		 return res;
		}
	, init					: function(ioRef, roomName) {
		 var self = this;
		 if(roomName) {sio	= ioRef.of( roomName );} else {sio = ioRef;}
		 sio.on	( 'connection'
				, function (socket) {
					 socket.on( 'disconnect'
							  , function() {self.removeSocketClient(socket);}
							  );
					 socket.on( 'register'
							  , function(descr, fctCB) {
									 self.appendSocketClient(socket, descr, fctCB);
									}
							  );
					 socket.on( "update"
							  , function(descr) {
									 self.updateSocketClient(socket, descr);
									}
							  );
					 socket.on( "broadcast"
							  , function(message) {
									 io.emit( message.title, message.body );
									}
							  );
					}
				);
		 return this;
		}
	, getPlatformFromSocket	: function(socket) {
		 for(var p in platforms) {
			 if(platforms[p].socket === socket) {
				 return { id		: p
						, platform	: platforms[p].descr
						};
				}
			}
		 return null;
		}
	, appendSocketClient	: function(socket, descr, fctCB) {
		 var id	= idPtf++;
		 platforms[id]	= { socket	: socket
						  , descr	: descr
						  };
		 if(fctCB) {
			 fctCB( id );
			}
		 socket.emit("platforms", this.getPlatforms());
		 sio.emit("append", this.getPlatformFromSocket(socket));
		 return id;
		}
	, removeSocketClient	: function(socket) {
		 for(var p in platforms) {
			 if(platforms[p].socket === socket) {
				 sio.emit("remove", {id: p});
				 delete platforms[p];
				 break;
				}
			}
		 return this;
		}
	, updateSocketClient	: function(socket, descr) {
		 var record	= this.getPlatformFromSocket(socket)
		 if(record) {
			 var platform	= record.platform;
			 for(var d in descr) {
				 platform.descr[d] = descr[d];
				}
			 sio.emit("update", {id: record.id, descr: descr});
			}
		 return this;
		}
};