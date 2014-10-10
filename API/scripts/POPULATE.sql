USE [ReportBuilder]
GO

/* REPORT COMPONENT */
INSERT INTO [dbo].[ReportComponents]([Title],[Type],[Data])
     VALUES ('ComponentOne',1,'asdasdasdasd')
GO
INSERT INTO [dbo].[ReportComponents]([Title],[Type],[Data])
     VALUES ('ComponentTwo',2,'asddghgahrh')
GO
/* METRIC */
INSERT INTO [dbo].[Metrics]([ID], [Mnemonic])
     VALUES(1, 'm_Impressions')
GO
INSERT INTO [dbo].[Metrics]([ID], [Mnemonic])
     VALUES(2, 'm_Clicks')
GO

/* METRIC GROUPS */
INSERT INTO [dbo].[MetricGroups] ([ID], [GroupName])
     VALUES(1, 'TIME')
GO
INSERT INTO [dbo].[MetricGroups] ([ID], [GroupName])
     VALUES(2, 'ADVENTURE')
GO

/* METRIC GROUPS MAP */
INSERT INTO [dbo].[MetricGroupMetric] ([ID], [GroupID], [MetricID])
     VALUES (1, 1, 1)
GO
INSERT INTO [dbo].[MetricGroupMetric] ([ID], [GroupID], [MetricID])
     VALUES (2, 2, 2)
GO

/* METRIC NAME */
INSERT INTO [dbo].[MetricName] ([ID], [MetricID], [Language], [DisplayName])
     VALUES (1,1,'EN','Impressions')
GO
INSERT INTO [dbo].[MetricName] ([ID], [MetricID], [Language], [DisplayName])
     VALUES (2,2,'US','Clicks')
GO
/* METRIC DISCRIPTION */
INSERT INTO [dbo].[MetricDescriptions] ([ID], [MetricID], [Description])
     VALUES (1,1,'Impresive Discription')
GO
INSERT INTO [dbo].[MetricDescriptions] ([ID], [MetricID], [Description])
     VALUES (2,2,'CLICkING Discription')
GO
