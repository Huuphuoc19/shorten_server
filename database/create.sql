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
	total bigint null
)

-- thong ke theo ngay, theo short link va theo location

create procedure spTotalHitPerDay
(in id int,in inDay date)
begin 
	select h.location,COUNT(h.id) as "hits"
		from hits as h
			where h.id_shorten = id and DATE(h.hit_time) = inDay
				group by h.location;
	select h.referer,COUNT(h.id) as "hits"
		from hits as h
			where h.id_shorten = id and DATE(h.hit_time) = inDay
				group by h.referer;
end


-- thong ke theo tuan, theo short link va theo location
create procedure spTotalHitPerWeek
(in id int, in inWeek int)
begin 
select h.location,COUNT(h.id) as "hits"
	from hits as h
		where h.id_shorten = 16 and WEEK(h.hit_time) = inWeek
			group by h.location;

select h.referer,COUNT(h.id) as "hits"
	from hits as h
		where h.id_shorten = 16 and WEEK(h.hit_time) = inWeek
			group by h.referer;

end

delimiter ;;

drop procedure if exists test2;;

create procedure test2()

begin

select ‘Hello World’;

end

;;