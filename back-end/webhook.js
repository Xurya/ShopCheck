//This is a webhook auto-update script following the digitalocean webhook tutorial.
//This requires additional setup on the droplet that is not automated.

const secret = "ohlookitsanupdate";
const repo = "/root/ShopCheck";

const http = require("http");
const crypto = require("crypto");

const exec = require("child_process").exec;

http.createServer(function (req, res){
	req.on('data', function(chunk) {
		var sig = "sha1=" + crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex');
		
		if(req.headers['x-hub-signature'] == sig){
			exec("cd " + repo + " && git pull");
		}
	});
	res.end();
}).listen(8080);
