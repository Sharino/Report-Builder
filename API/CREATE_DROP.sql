IF EXISTS (SELECT name FROM master.sys.databases WHERE name = N'TestDB')
BEGIN
	PRINT 'Database exists > DROP DATABASE'
	alter database TestDB set single_user with rollback immediate
	DROP DATABASE TestDB
END
ELSE
BEGIN
	PRINT 'Database does not exist > CREATE DATABASE'
	CREATE DATABASE TestDB;
END;