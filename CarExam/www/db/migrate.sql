﻿CREATE TABLE IF NOT EXISTS 'User' (
	'UserId'	INTEGER NOT NULL,
	'UserName' TEXT,
	'Password' TEXT NOT NULL,
	'Status' TEXT NOT NULL,
	PRIMARY KEY(UserId)
);