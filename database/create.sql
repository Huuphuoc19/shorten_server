-- shorten
create table shortlink
(
	id int not null primary key auto_increment,
	longlink varchar(1000) not null,
	domain varchar(300) not null,
	shortcode varchar(14) not null,
	create_time datetime not null,
	hits bigint not null default 0
)


-- hits
create table hits 
(
	id int not null primary key auto_increment,
	ip_address varchar(15) null,
	location varchar(50) null,
	referer varchar(40) null,
	hit_time datetime null default CURRENT_TIMESTAMP,
	id_shorten int not null
)

ALTER TABLE hits
	ADD CONSTRAINT fk_hits_shorten
		FOREIGN KEY (id_shorten)
			REFERENCES shortlink(id)

create table total
(
	id int not null primary key,
	total bigint DEFAULT 0 null
)

-- CREATE PROCEDURE 

-- hits last 30 days per for a particular link

delimiter ;;

drop procedure if exists spGetHitLastDay;;

CREATE PROCEDURE spGetHitLastDay
(IN id INT,IN days INT)
BEGIN

	DECLARE x INT;
	DECLARE day DATE;
	-- temp for count
	DECLARE temp INT;

	SET x = 0;
	SET day = CURRENT_TIMESTAMP;

	-- loop through 30 days
	WHILE x < days DO
		SELECT COUNT(*) INTO temp
        	FROM hits as h 
            	WHERE DATE(h.hit_time) = DATE(day) AND h.id_shorten = id
            		GROUP BY DATE(h.hit_time);

        SELECT DATE(day) as "date", temp as "hits";

        SET x = x + 1;
        SET day = SUBDATE(day, INTERVAL 1 DAY);
        SET temp = 0;
	END WHILE;


END

;;

-- end 

-- hits by loaction for link

delimiter ;;

drop procedure if exists spGetHitByLocation;;

CREATE PROCEDURE spGetHitByLocation
(IN id INT)
BEGIN

	SELECT h.location,COUNT(h.id) as "hits" 
		FROM hits as h 
			WHERE h.id_shorten = id 
				GROUP BY h.location;

END

;;

-- end 

-- hits by referer for link

delimiter ;;

drop procedure if exists spGetHitByReferer;;

CREATE PROCEDURE spGetHitByReferer
(IN id INT)
BEGIN

	SELECT h.referer,COUNT(h.id) as "hits" 
		FROM hits as h 
			WHERE h.id_shorten = id 
				GROUP BY h.referer;

END

;;

-- end 