var conn = require('./dao.js');


/**
 * lay thong tin short link
 * 1. thongLocationTheoNgay
 * nhap vao ngay thng, tra ve nhung location cua ngay hom do {location: soluong}
 * -------------------------------- referer cua ngay hom do
 * lay tong so lan lick
 */	

module.exports = {
	// get all short link from database
	getAllShortLink: function (limit,done) {
		limit = (limit == -1) ? "" : ('LIMIT ' + limit);
		conn.query({
			sql: 'SELECT * FROM `shortlink` ' + limit
		}, function (error, results, fields) {
		 	if(error){
		 		done(error,null);
		 	}else{
		 		done(null, results);
		 	}
		})
	},
	// get all short link from database
	getTotalShortLink: function (done) {
		conn.query({
			sql: 'SELECT * FROM `total` where `id` = 1'
		}, function (error, results, fields) {
		 	if(error){
		 		done(error,null);
		 	}else{
		 		done(null, results);
		 	}
		})
	},

	getHitsLastDays: function(id,days,done) {
		conn.query({
			sql: 'call spGetHitLastDay(?,?)',
			values: [id,days]
		}, function (error, results, fields) {
		 	if(error){
		 		done(error,null);
		 	}else{
		 		done(null, results);
		 	}
		})
	},

	getHitsByLocation: function(id,done) {
		conn.query({
			sql: 'call spGetHitByLocation(?)',
			values: [id]
		}, function (error, results, fields) {
		 	if(error){
		 		done(error,null);
		 	}else{
		 		done(null, results);
		 	}
		})
	},

	getHitsByReferer: function(id,done) {
		conn.query({
			sql: 'call spGetHitByReferer(?)',
			values: [id]
		}, function (error, results, fields) {
		 	if(error){
		 		done(error,null);
		 	}else{
		 		done(null, results);
		 	}
		})
	}
}