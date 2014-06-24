var zmq = require('zmq');
var express = require('express');
var app = express();

var googleapis = require('googleapis');
var OAuth2 = googleapis.auth.OAuth2;

var oauth2Client = new OAuth2(
	'88647090605-egvm4eu2ljl1icknrvvjstin26kd5ag9.apps.googleusercontent.com', 
	'sj_q4edzXZBUop0GVgJkD0Lk',
	'http://127.0.0.1:3033/oauth/google/callback');

app.get('/auth/google', function(req, res) {
	var scopes = [
		'https://www.googleapis.com/auth/calendar',
		'https://www.googleapis.com/auth/userinfo.profile'
	];

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
	var authData = {
		session: 'ghgf5hg5h4g5jh4hg5jhg56gf',
		code: code
	};
	publisher.send(JSON.stringify(authData));
};

app.listen(3033, function() {
	console.log("listening on port: 3033");
});
