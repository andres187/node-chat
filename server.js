var mongo = require('mongodb').MongoClient,
    client = require('socket.io').listen(8080).sockets;

	mongo.connect('mongodb://127.0.0.1/node-chat', function(err, db){
		if(err) throw err;
		
		 
		client.on('connection', function(socket){
				
			var col = db.collection('messages');
			
			    sendStatus = function(s) {
				socket.emit('status', s);
				};

		


			socket.on('input', function(data){
				
				var name = data.name,
				    message = data.message;
				    whitespacePattern = /^\s*$/;
	if(whitespacePattern.test(name) || whitespacePattern.test(message)){ 
			sendStatus('Nombre y mensaje son requeridos!');

	}else{
		col.insert({name: name, message: message}, function() {
			sendStatus({					
					message: "Mesaje enviado",
					clear: true
				});	
			});		
		    }
		});		
	});
});

