DROP DATABASE IF EXISTS historydb;
CREATE DATABASE historydb;
USE historydb;
CREATE TABLE events(
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
	description VARCHAR(255) DEFAULT " ",
	startyear INT NOT NULL DEFAULT "0",
	startera ENUM('BCE','CE') NOT NULL,
	type ENUM('political', 'natural', 'war', 'sci-tech', 'economic', 'cultural', 'other') NOT NULL,
	endyear INT NOT NULL DEFAULT "0",
	endera ENUM('BCE','CE') NOT NULL
);
CREATE TABLE past_connections(
	event_id INT,
	past_id INT,
	PRIMARY KEY(event_id, past_id),
	FOREIGN KEY(event_id) REFERENCES events(id),
	FOREIGN KEY(past_id) REFERENCES events(id)
);
CREATE TABLE future_connections(
	event_id INT,
	fut_id INT,
	PRIMARY KEY(event_id, fut_id),
	FOREIGN KEY(event_id) REFERENCES events(id),
	FOREIGN KEY(fut_id) REFERENCES events(id)
);
CREATE TABLE timeline(
	timeline_id INT PRIMARY KEY AUTO_INCREMENT,
	title VARCHAR(255) NOT NULL,
	start INT NOT NULL,
	end INT NOT NULL,
	intervals INT,
	era_start ENUM('BCE','CE') NOT NULL,
	era_end ENUM('BCE','CE') NOT NULL,
	length INT	
);
CREATE TABLE trend(
	trend_id INT PRIMARY KEY AUTO_INCREMENT,
	type ENUM('political', 'natural', 'war', 'sci-tech', 'economic', 'cultural', 'other') NOT NULL,
	startyear INT NOT NULL,
	endyear INT NOT NULL,
	name VARCHAR(255) NOT NULL,
	description TEXT
);