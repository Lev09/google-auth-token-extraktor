var googleapis = require('googleapis');
var OAuth2 = googleapis.auth.OAuth2;

var newOauth2Client = function() {
	var oauth2Client = new OAuth2(
		'38526860757-k32pm3d9v0c0lg0pgff9lfndfvlkae0h.apps.googleusercontent.com', 
		'd1NYp4UbZVMdxbMi9UjMu-8q',
		'http://127.0.0.1:3033/oauth/google/callback');
	return oauth2Client;
};

module.exports = function(code, done) {

	var oauth2Client = newOauth2Client();
	oauth2Client.getToken(code, function(error, tokens) {
		
		if(error) {
			console.log("error ", error);
		}
		else {
			oauth2Client.setCredentials(tokens);
			console.log(tokens);
			done(tokens);
		}
	});
	
};
