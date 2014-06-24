var zmq = require('zmq');
var getTokens = require('./tokenExtraktor');
var argv = require('optimist').default({
	bind: 'tcp://*:6003',
	connect: 'tcp://localhost:6001'
}).argv;

var subscriber = zmq.socket('sub');
subscriber.connect(argv.connect);
subscriber.subscribe('');
console.log("listening port: ", argv.connect);

subscriber.on('message', function(data) {
	var recivedData = JSON.parse(data.toString());
	console.log(recivedData);
	getTokens(recivedData.code, function(tokens) {
		var authData = {
			session: recivedData.session,
			tokens: tokens
		};
		
		sendAuthData(authData);
	});
});

var publisher = zmq.socket('pub');
publisher.bind(argv.bind, function(error) {
	if(error) {
		console.log(error);
	}
	console.log("binding on port: ", argv.bind);
});

var sendAuthData = function(authData) {
	publisher.send(JSON.stringify(authData));
};
