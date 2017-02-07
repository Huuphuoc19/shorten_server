var express = require('express');
var router = express.Router();
var statisticModel = require('../models/statistic.js');

router.get('/',function(req,res){
	statisticModel.test(function(err,data){
		if(err){
			console.log(err);
		}else{
			console.log(data);
		}
		var tempDate = {
			location: data[0],
			referer: data[1]
		}
		res.send(JSON.stringify(tempDate));
	})
})

module.exports = router;