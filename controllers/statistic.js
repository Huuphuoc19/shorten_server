var express = require('express');
var router = express.Router();
var statisticModel = require('../models/statistic.js');

// parse url
var parse = require('url-parse');

router.get('/',function(req,res){

})

// get all short link
router.post('/allshortlink',function(req,res){
	var limit = req.body.limit;
	statisticModel.getAllShortLink(limit,function(err,data){
		if(err){
			console.log(err);
		}else{
			res.send(JSON.stringify(data));
		}
	})
})

// get all short link
router.post('/totallastdays',function(req,res){
	var days = req.body.days;
	var id = req.body.id;
	statisticModel.getHitsLastDays(id,days,function(err,data){
		if(err){
			console.log(err);
		}else{
			// remove last elements, that isn'a a row of result set
			var length = data.length - 1;
			var dataResultAPI = {
				date: [],
				hits: []
			}
			// create object API
			for(var i = 0 ; i < length ; i++){
				var item = data[i];
				if(item.length > 0){
					item = item[0];
					var tempDate = new Date(item.date);
					var dateString = tempDate.getDate() + "/" + (tempDate.getMonth() + 1);
					dataResultAPI.date.push(dateString);
					dataResultAPI.hits.push(item.hits);
				}
			}
			res.send(JSON.stringify(dataResultAPI));
		}
	})
})

// get all short link
router.post('/hitsbylocaiton',function(req,res){
	var id = req.body.id;
	statisticModel.getHitsByLocation(id,function(err,data){
		if(err){
			console.log(err);
		}else{
			var items = data[0]; // cause return only 1 result set
			var length = items.length;
			var dataResultAPI = {
				location: [],
				hits: []
			}

			for(var i = 0 ; i < length ; i++){
				dataResultAPI.location.push((items[i].location == null) ? "None" : items[i].location);
				dataResultAPI.hits.push(items[i].hits);
			}			
			res.send(JSON.stringify(dataResultAPI));
		}
	})
})

// get all short link
router.post('/hitsbyreferer',function(req,res){
	var id = req.body.id;
	statisticModel.getHitsByReferer(id,function(err,data){
		if(err){
			console.log(err);
		}else{
			var items = data[0]; // cause return only 1 result set
			var length = items.length;
			var dataResultAPI = {
				referer: [],
				hits: []
			}
			console.log("----------------");
			console.log(data);
			console.log(length);
			for(var i = 0 ; i < length ; i++){
				if(items[i].referer != null){
					var url = parse(items[i].referer);

					dataResultAPI.referer.push(url.hostname);
				}else{
					dataResultAPI.referer.push("None")
				}

				dataResultAPI.hits.push(items[i].hits);
			}	
			console.log(dataResultAPI);
			res.send(JSON.stringify(dataResultAPI));	
		}
	})
})


module.exports = router;