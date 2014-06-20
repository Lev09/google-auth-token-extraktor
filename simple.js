var zmq = require('zmq');
var express = require('express');
var app = express();

var googleapis = require('googleapis');
var OAuth2 = googleapis.auth.OAuth2;

var oauth2Client = new OAuth2(
	'38526860757-k32pm3d9v0c0lg0pgff9lfndfvlkae0h.apps.googleusercontent.com', 
	'd1NYp4UbZVMdxbMi9UjMu-8q',
	'http://127.0.0.1:3033/oauth/google/callback');

app.get('/auth/google', function(req, res) {

	var scopes = ['https://www.googleapis.com/auth/calendar'];

	var url = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: scopes.join(" ")
	});

  res.redirect(url);
});

app.get('/oauth/google/callback', function(req, res) {
	var code = req.query.code;
	res.send(code);
	if(code) {
		sendCode(code);
		console.log(typeof(code));
	}
});

var publisher = zmq.socket('pub');
publisher.bind('tcp://*:6001', function(error) {
	if(error) {
		console.log(error);
	}
	console.log("binding on port: 6100");
});

var sendCode = function(code) {
	publisher.send(code);
};

app.listen(3033, function() {
	console.log("listening on port: 3033");
});
