var conn = require('./dao.js');

module.exports = {
	// get a link by short code
	getShortLinkByUniqueCode: function(uniqueCode,done){
		conn.query({
			sql : 'select * from shortlink where shortcode = ?',
			values: [uniqueCode]
		},function(error,results,fields){
			if(error){
		 		done(error,null);
		 	}else{
		 		var data = (results[0] == undefined) ? null : results[0];
		 		done(null, data);
		 	}
		});
	},

	// insert short link to database with transaction
	insertShortLink: function(dataObject,done){

		conn.beginTransaction(function(err) {
			if(err){
				done(err, null);
				return;
			}
			conn.query({
				sql : 'insert into `shortlink` set ?',
				values: [dataObject]
			},function (error, results, fields){
				if(error){
					return conn.rollback(function(){
						done(error,null);
						return;
					})
				}else{
					conn.commit(function(err){
						if(err){
							return conn.rollback(function(){
								done(error,null);
								return;
							})
						}else{
							done(null, results.insertId);
						}
					})
				} // end else 
			}) // end query
		}) // end transaction
	},

	updateHitById: function(id,done){
		conn.beginTransaction(function(err) {
			if(err){
				done(err, null);
				return;
			}
			conn.query({
				sql : 'update `shortlink` set `hits` = `hits` + 1 where `id` = ?',
				values: [id]
			},function (error, results, fields){
				if(error){
					return conn.rollback(function(){
						done(error,null);
						return;
					})
				}else{
					conn.commit(function(err){
						if(err){
							return conn.rollback(function(){
								done(error,null);
								return;
							})
						}else{
							done(null, results.affectedRows);
						}
					})
				} // end else 
			}) // end query
		}) // end transaction
	}, // end function

	updateLinkTotal: function(done){
		conn.beginTransaction(function(err) {
			if(err){
				done(err, null);
				return;
			}
			conn.query({
				sql : 'update `total` set `total_links` = `total_links` + 1'
			},function (error, results, fields){
				if(error){
					return conn.rollback(function(){
						done(error,null);
						return;
					})
				}else{
					conn.commit(function(err){
						if(err){
							return conn.rollback(function(){
								done(error,null);
								return;
							})
						}else{
							done(null, results.affectedRows);
						}
					})
				} // end else 
			}) // end query
		}) // end transaction
	}, // end function,

	insertHitToLink: function(dataObject,done){
		conn.beginTransaction(function(err) {
			if(err){
				done(err, null);
				return;
			}
			conn.query({
				sql : 'insert `hits` set ?',
				values: [dataObject]
			},function (error, results, fields){
				if(error){
					return conn.rollback(function(){
						done(error,null);
						return;
					})
				}else{
					conn.commit(function(err){
						if(err){
							return conn.rollback(function(){
								done(error,null);
								return;
							})
						}else{
							done(null, results.insertId);
						}
					})
				} // end else 
			}) // end query
		}) // end transaction
	} // end function
}

