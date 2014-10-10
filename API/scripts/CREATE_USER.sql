﻿	PRINT 'CREATING LOGIN AND USER'
	PRINT 'LOGIN: TestLogin, PASS: Katuciai13'

	CREATE LOGIN [TestLogin] WITH PASSWORD=N'Katuciai13',
		DEFAULT_LANGUAGE=[us_english], 
		CHECK_EXPIRATION=OFF, 
		CHECK_POLICY=OFF	

	CREATE USER TestUser FOR LOGIN TestLogin

	ALTER USER TestUser WITH DEFAULT_SCHEMA=[dbo]

	EXEC sp_addrolemember N'db_owner', N'TestUser'