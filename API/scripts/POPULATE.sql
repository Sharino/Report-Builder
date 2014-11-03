USE [ReportBuilder]
GO

/* DASHBOARD */

INSERT INTO [dbo].[Dashboards]([Title])
VALUES('DashboardTitle')

/* DASHBOARD COMPONENT */

INSERT INTO [dbo].[DashboardComponents]([DashboardId],[Title],[Type])
VALUES (1,'ComponentTitle',1) 


/* REPORT COMPONENT */

INSERT INTO [dbo].[ReportComponents]([Title],[Definition],[Type])
VALUES('ReportTitle','{"Metrics":[{"MetricId":7,"Mnemonic":null,"Group":null,"DisplayName":"Creative Settings Bid Count","Description":null,"DataType":null},{"MetricId":4,"Mnemonic":null,"Group":null,"DisplayName":"Bid Count","Description":null,"DataType":null}],"Dimensions":[],"Filters":[]}',1) 

/* METRIC */

INSERT INTO [dbo].[Metrics]([ID],[Mnemonic],[DataType])
     VALUES (1,'m_Impressions','float') 

INSERT INTO [dbo].[Metrics]([ID],[Mnemonic],[DataType])
     VALUES (2,'m_Clicks','int') 

INSERT INTO [dbo].[Metrics]([ID],[Mnemonic],[DataType])
     VALUES (3,'m_WinningCost','float') 

INSERT INTO [dbo].[Metrics]([ID],[Mnemonic],[DataType])
     VALUES (4,'m_BidCount','int') 

INSERT INTO [dbo].[Metrics]([ID],[Mnemonic],[DataType])
     VALUES (5,'m_DealBidCount','int') 

INSERT INTO [dbo].[Metrics]([ID],[Mnemonic],[DataType])
     VALUES (6,'m_PackageBidCount','float') 

INSERT INTO [dbo].[Metrics]([ID],[Mnemonic],[DataType])
     VALUES (7,'m_CreativeSettingsBidCount','int') 

INSERT INTO [dbo].[Metrics]([ID],[Mnemonic],[DataType])
     VALUES (8,'m_BuyRate','int') 

INSERT INTO [dbo].[Metrics]([ID],[Mnemonic],[DataType])
     VALUES (9,'m_eCPM','int') 

INSERT INTO [dbo].[Metrics]([ID],[Mnemonic],[DataType])
     VALUES (10,'m_eCPC','int') 

INSERT INTO [dbo].[Metrics]([ID],[Mnemonic],[DataType])
     VALUES (11,'m_CTR','int') 

INSERT INTO [dbo].[Metrics]([ID],[Mnemonic],[DataType])
     VALUES (12,'m_IncludedFee','int') 


/* METRIC GROUPS */

INSERT INTO [dbo].[MetricGroups]([ID],[GroupName])
VALUES   (1,'ADVENTURE') 
INSERT INTO [dbo].[MetricGroups]([ID],[GroupName])
VALUES   (2,'TIME') 
INSERT INTO [dbo].[MetricGroups]([ID],[GroupName])
VALUES   (3,'MATHEMATICAL') 

/* METRIC GROUPS MAP */

INSERT INTO [dbo].[MetricGroupMetric]([ID],[GroupID],[MetricID])
VALUES (1,1,1) 
INSERT INTO [dbo].[MetricGroupMetric]([ID],[GroupID],[MetricID])
VALUES (6,1,6) 
INSERT INTO [dbo].[MetricGroupMetric]([ID],[GroupID],[MetricID])
VALUES (7,1,7) 
INSERT INTO [dbo].[MetricGroupMetric]([ID],[GroupID],[MetricID])
VALUES (9,1,9)
INSERT INTO [dbo].[MetricGroupMetric]([ID],[GroupID],[MetricID])
VALUES (10,1,10) 
INSERT INTO [dbo].[MetricGroupMetric]([ID],[GroupID],[MetricID])
VALUES (2,2,2)
INSERT INTO [dbo].[MetricGroupMetric]([ID],[GroupID],[MetricID])
VALUES (8,2,8) 
INSERT INTO [dbo].[MetricGroupMetric]([ID],[GroupID],[MetricID])
VALUES (11,2,11) 
INSERT INTO [dbo].[MetricGroupMetric]([ID],[GroupID],[MetricID])
VALUES (3,3,3) 
INSERT INTO [dbo].[MetricGroupMetric]([ID],[GroupID],[MetricID])
VALUES (4,3,4) 
INSERT INTO [dbo].[MetricGroupMetric]([ID],[GroupID],[MetricID])
VALUES (5,3,5) 
INSERT INTO [dbo].[MetricGroupMetric]([ID],[GroupID],[MetricID])
VALUES (12,3,12) 



/* METRIC NAME */

INSERT INTO [dbo].[MetricName]([ID],[MetricID],[Language],[DisplayName])
VALUES (1,1,'EN','Impressions') 
INSERT INTO [dbo].[MetricName]([ID],[MetricID],[Language],[DisplayName])
VALUES (2,2,'EN','Clicks') 
INSERT INTO [dbo].[MetricName]([ID],[MetricID],[Language],[DisplayName])
VALUES (3,3,'EN','Winning Cost') 
INSERT INTO [dbo].[MetricName]([ID],[MetricID],[Language],[DisplayName])
VALUES (4,4,'EN','Bid Count') 
INSERT INTO [dbo].[MetricName]([ID],[MetricID],[Language],[DisplayName])
VALUES (5,5,'EN','Deal Bid Count') 
INSERT INTO [dbo].[MetricName]([ID],[MetricID],[Language],[DisplayName])
VALUES (6,6,'EN','Package Bid Count') 
INSERT INTO [dbo].[MetricName]([ID],[MetricID],[Language],[DisplayName])
VALUES (7,7,'EN','Creative Settings Bid Count') 
INSERT INTO [dbo].[MetricName]([ID],[MetricID],[Language],[DisplayName])
VALUES (8,8,'EN','Buy Rate') 
INSERT INTO [dbo].[MetricName]([ID],[MetricID],[Language],[DisplayName])
VALUES (9,9,'EN','eCPM') 
INSERT INTO [dbo].[MetricName]([ID],[MetricID],[Language],[DisplayName])
VALUES (10,10,'EN','eCPC') 
INSERT INTO [dbo].[MetricName]([ID],[MetricID],[Language],[DisplayName])
VALUES (11,11,'EN','CTR') 
INSERT INTO [dbo].[MetricName]([ID],[MetricID],[Language],[DisplayName])
VALUES (12,12,'EN','Included Fee') 

/* METRIC DISCRIPTIONS */

INSERT INTO [dbo].[MetricDescriptions]([ID],[MetricID],[Description])
VALUES(1,1,'')
INSERT INTO [dbo].[MetricDescriptions]([ID],[MetricID],[Description])
VALUES(2,2,'')
INSERT INTO [dbo].[MetricDescriptions]([ID],[MetricID],[Description])
VALUES(3,3,'')
INSERT INTO [dbo].[MetricDescriptions]([ID],[MetricID],[Description])
VALUES(4,4,'')
INSERT INTO [dbo].[MetricDescriptions]([ID],[MetricID],[Description])
VALUES(5,5,'')
INSERT INTO [dbo].[MetricDescriptions]([ID],[MetricID],[Description])
VALUES(6,6,'')
INSERT INTO [dbo].[MetricDescriptions]([ID],[MetricID],[Description])
VALUES(7,7,'')
INSERT INTO [dbo].[MetricDescriptions]([ID],[MetricID],[Description])
VALUES(8,8,'')
INSERT INTO [dbo].[MetricDescriptions]([ID],[MetricID],[Description])
VALUES(9,9,'')
INSERT INTO [dbo].[MetricDescriptions]([ID],[MetricID],[Description])
VALUES(10,10,'')
INSERT INTO [dbo].[MetricDescriptions]([ID],[MetricID],[Description])
VALUES(11,11,'')
INSERT INTO [dbo].[MetricDescriptions]([ID],[MetricID],[Description])
VALUES(12,12,'')
