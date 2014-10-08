USE [TestDB]
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
INSERT INTO [dbo].[MetricGroupMap] ([ID], [GroupID], [MetricID])
     VALUES (1, 1, 1)
GO
INSERT INTO [dbo].[MetricGroupMap] ([ID], [GroupID], [MetricID])
     VALUES (2, 2, 2)
GO

/* METRIC NAME */
INSERT INTO [dbo].[MetricName] ([ID], [NameID], [DisplayName])
     VALUES (1,1,'Impressions')
GO
INSERT INTO [dbo].[MetricName] ([ID], [NameID], [DisplayName])
     VALUES (2,2,'Clicks')
GO
/* METRIC DISCRIPTION */
INSERT INTO [dbo].[MetricDescriptions] ([ID], [MetricID], [Description])
     VALUES (1,1,'Impresive Discription')
GO
INSERT INTO [dbo].[MetricDescriptions] ([ID], [MetricID], [Description])
     VALUES (2,2,'CLICkING Discription')
GO
