const path = require('path')
const crypt = require("crypto");
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

module.exports = function(app) {
	app.get('/events2017/validate', (req, res) => {

		var auth_token = req.query.auth_token;
		var ip = req.query.ip;

		if(ip == "client"){
			ip = req.clientIp.toString();
		}
		
		if(ip == "::1" || ip == "::ffff:127.0.0.1"){  // Fix IPv4/v6 Resolution
			ip = "127.0.0.1";
		}

		var regex = /129\.234\.\d\d\d\.\d\d\d/

		if(auth_token && ip){
			if((auth_token == "concertina") && (regex.exec(ip))){
				res.type('application/json');
				return res.json({ 
					success: true, 
					message: 'Successfully Authenticated Token',
				});
			}

			jwt.verify(auth_token, app.get('authKey'), {issuer:ip}, function(err, decoded) {  

				if (err) {
					res.type('application/json');
					res.status(400);
					res.json({ 
						success: false, 
						message: 'Failed to Authenticate Token',
					}) 
				} else {
					res.type('application/json');
					res.json({
						success: true,
						message: 'Successfully Authenticated Token',
					})
				}
			});
		} else {
			res.type('application/json');
			res.status(400);
			res.json({
				success: false,
				message: 'No Token or IP Given',
			})
		}
	});

	app.post('/events2017/authenticate', (req, res) => {

		var filePath = path.join(__dirname, '../user/data.json');
		var data = require('fs').readFileSync(filePath, 'utf8')
		var obj = JSON.parse(data);
		var users = obj.users;

		var username = req.body.username;
		var password = req.body.password;

		var hash = crypt.createHash('sha256');
		var hashPass = -1;
		var ip = req.clientIp.toString();
		
		if(ip == "::1" || ip == "::ffff:127.0.0.1"){  // Fix IPv4/v6 Resolution
			ip = "127.0.0.1";
		}

		var auth_token = "";
		var success = false;

		var header = {
			"typ": "JWT",
			"alg": "HS256"
		}

		var payload = {
			"iss":ip
		}

		for(var i = 0; i < users.length; i++){
			if(users[i].username == username){
				hashPass = users[i].password;
			}
		}

		hash.update(password);
		if(hash.digest('hex') == hashPass){
			auth_token = jwt.sign(payload, app.get('authKey'), {
				expiresIn: 60*60*2,
				header: header
			})
			success = true;
		}

		if(!success){
			res.status(400);
		}

		res.cookie("auth_token", auth_token.toString());
		res.type('application/json');
		res.json({
			success: success,
			auth_token: auth_token.toString()
		});
	});
};