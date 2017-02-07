var express = require('express');
var router = express.Router();
var sh = require("shorthash");
var domain = "http://localhost:3000/";
// parse url
var parse = require('url-parse');

// ip from lib/helper
var requestHandle = require('../lib/helper/request_handle.js');

// shorten model from models dir
var shortenModel = require('../models/shorten.js');


router.get('/',function(req,res){

	res.end();
})

// make shorten link
// post {"link":"a long link"}
router.post('/makeshorten',function(req,res){
	var longLink;
	if(req.body.link){
		longLink = req.body.link
	}else{
		res.end();
		return;
	}
	var url = parse(longLink);
	var shortCode = sh.unique(longLink);
	// check if link have in database
	shortenModel.getShortLinkByUniqueCode(shortCode,function(err,data){
		if(err){
			console.log(err);
			res.end();
			return;
		}else{
			var dataResult = {}
			dataResult.link = shortCode;
			// link have existed
			if(data){
				// set state = 1 if link have existed
				dataResult.state = 1;	
				res.send(JSON.stringify(dataResult));			
			}else{
				// state = 0 for new link
				dataResult.state = 0;
				shortenModel.insertShortLink({
					longlink: longLink,
					domain: url.origin,
					shortcode: shortCode,
				},function(err,data){
					if(err){
						console.log(err);
						res.status(500).send(err);
					}else{
						dataResult.state = 0;
						res.send(JSON.stringify(dataResult));
					}
				})
			}

		}
	})
})

// return link
// post {link: "shortlink"} 
router.post('/redirect',function(req,res){
	var shortCode;
	var referer = req.body.referrer;
	if(req.body.link){
		//var url = parse(req.body.link);
		shortCode = req.body.link;
	}else{
		res.end();
		return;
	}
	// get link from database to redirect
	shortenModel.getShortLinkByUniqueCode(shortCode,function(err,data){
		if(err){
			console.log(err);
			res.end();
			return;
		}else{
			var dataResult = {}
			console.log(data);
			// if have link 
			if(data){
				dataResult.longlink = (data.longlink);
				var id = data.id;
				// update hit for link + 1
				shortenModel.updateHitById(id,function(err,dataHitLink){
					if(err){
						console.log(err);
					}else{
						console.log("Rows effect: " + dataHitLink);
					}
				})

				// update hit for total + 1
				shortenModel.updateHitTotal(function(err,dataHitAll){
					if(err){
						console.log(err);
					}else{
						console.log("Rows effect: " + dataHitAll);
					}
				})

				// get location for update to hits table
				requestHandle.getLocationByIp(req,function(address){
					
					var dataToUpdateHits = {
							ip_address: (address) ? address.ip : null,
							location: (address) ? address.location : null,
							referer: referer,
							id_shorten: id
						}
					// insert to hits for redirect link
					shortenModel.insertHitToLink(dataToUpdateHits,function(errInsert,dataInsert){
						if(err){
							console.log(errInsert);
						}else{
							console.log("Id insert hits: " + dataInsert);
						}
					})
				})

			}else{
				dataResult.longlink = -1;
			}
			res.send(JSON.stringify(dataResult));
		}
	})
})


module.exports = router;