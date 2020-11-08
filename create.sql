
create database short_url;

/*drop table url_mapping;*/
create table url_mapping(
   idx BIGINT(8) UNSIGNED NOT NULL, 
   short_url varchar(255) NOT NULL,
   origin_url varchar(2048) NOT NULL,
   unique(short_url),
   PRIMARY KEY ( idx )
)ENGINE=InnoDB DEFAULT CHARSET utf8 collate utf8_bin;
