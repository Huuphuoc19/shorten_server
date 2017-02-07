var conn = require('./dao.js');


/**
 * lay thong tin short link
 * 1. thongLocationTheoNgay
 * nhap vao ngay thng, tra ve nhung location cua ngay hom do {location: soluong}
 * -------------------------------- referer cua ngay hom do
 * lay tong so lan lick
 */

module.exports = {
	test: function(done) {
		conn.query({
			sql: 'call spTotalHitPerWeek(?,?)',
			values: [16,5]
		}, function (error, results, fields) {
		 	if(error){
		 		done(error,null);
		 	}else{
		 		done(null, results);
		 	}
		})
	},
}