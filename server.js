var mongo = require('mongodb').MongoClient,
    client = require('socket.io').listen(8080).sockets;

	mongo.connect('mongodb://127.0.0.1/node-chat', function(err, db){
		if(err) throw err;
		
		 
		client.on('connection', function(socket){
				
			var col = db.collection('messages');
			
			    sendStatus = function(s) {
				socket.emit('status', s);
				};
			
			col.find().limit(100).sort({_id: -1}).toArray(function(err, res){
				if(err) throw err;
				socket.emit('output', res);
			});		


			socket.on('input', function(data){
				
				var name = data.name,
				    message = data.message;
				    whitespacePattern = /^\s*$/;
					if(whitespacePattern.test(name) || whitespacePattern.test(message)){ 
						sendStatus('Nombre y mensaje son requeridos!');

					}else{
						col.insert({name: name, message: message}, function() {
						
						client.emit('output', [data]);
						
						sendStatus({					
							message: "Mesaje enviado",
							clear: true
						});	
						});		
		    			     }
			});		
		});
	});

