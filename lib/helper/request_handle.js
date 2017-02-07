var request = require('request');


var getIpRequest =  function(req){
	var ip = req.headers['x-forwarded-for'] || 
	req.connection.remoteAddress || 
	req.socket.remoteAddress ||
	req.connection.socket.remoteAddress;
	return ip;
}

var getLocationByIpAddress = function(ip,done){
	request('http://freegeoip.net/json/' + ip, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			var dataResult = {}
			dataResult.ip = ip
			dataResult.location = null;
			if(info && info.country_name){
				dataResult.location = info.country_name.toLowerCase();
			}			
			done(dataResult);
		}else{
			done(null);
		}
	})
}

module.exports = {
	getLocationByIp: function(req,done){
		var ip = getIpRequest(req);
		getLocationByIpAddress(ip,done);
	},

	getReferer: function(req){
		return req.headers.referer ? (req.headers.referer) : null;
	}
}