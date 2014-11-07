USE [ReportBuilder]
GO

/* Dimension */
INSERT INTO [dbo].[Dimensions]([ID], [Mnemonic], [DataType])
     VALUES(1, 'd_Year','float')
GO

INSERT INTO [dbo].[Dimensions]([ID], [Mnemonic], [DataType])
     VALUES(2, 'd_Month','float')
GO

INSERT INTO [dbo].[Dimensions]([ID], [Mnemonic], [DataType])
     VALUES(3, 'd_Day','float')
GO

INSERT INTO [dbo].[Dimensions]([ID], [Mnemonic], [DataType])
     VALUES(4, 'd_Program','int')
GO

INSERT INTO [dbo].[Dimensions]([ID], [Mnemonic], [DataType])
     VALUES(5, 'd_ClientSite','int')
GO

INSERT INTO [dbo].[Dimensions]([ID], [Mnemonic], [DataType])
     VALUES(6, 'd_ClientDivision','int')
GO

INSERT INTO [dbo].[Dimensions]([ID], [Mnemonic], [DataType])
     VALUES(7, 'd_MasterTag','int')
GO

INSERT INTO [dbo].[Dimensions]([ID], [Mnemonic], [DataType])
     VALUES(8, 'd_Deal','int')
GO

INSERT INTO [dbo].[Dimensions]([ID], [Mnemonic], [DataType])
     VALUES(9, 'd_Package','int')
GO

INSERT INTO [dbo].[Dimensions]([ID], [Mnemonic], [DataType])
     VALUES(10, 'd_CreativeSettings','int')
GO

INSERT INTO [dbo].[Dimensions]([ID], [Mnemonic], [DataType])
     VALUES(11, 'd_InventorySource','int')
GO

INSERT INTO [dbo].[Dimensions]([ID], [Mnemonic], [DataType])
     VALUES(12, 'd_Currency','float')
GO

INSERT INTO [dbo].[Dimensions]([ID], [Mnemonic], [DataType])
     VALUES(13, 'd_Country','int')
GO

INSERT INTO [dbo].[Dimensions]([ID], [Mnemonic], [DataType])
     VALUES(14, 'd_MasterTagSize','float')
GO

INSERT INTO [dbo].[Dimensions]([ID], [Mnemonic], [DataType])
     VALUES(15, 'd_RtbDomains','float')
GO

INSERT INTO [dbo].[Dimensions]([ID], [Mnemonic], [DataType])
     VALUES(16, 'd_TestID','float')
GO

INSERT INTO [dbo].[Dimensions]([ID], [Mnemonic], [DataType])
     VALUES(17, 'd_AuctionType','int')
GO

/* Dimension GROUPS */
INSERT INTO [dbo].[DimensionGroups] ([ID], [GroupName])
     VALUES(1, 'TIME')
GO

INSERT INTO [dbo].[DimensionGroups] ([ID], [GroupName])
     VALUES(2, 'BUSINESS')
GO

INSERT INTO [dbo].[DimensionGroups] ([ID], [GroupName])
     VALUES(3, 'TECHNICAL')
GO


/* Dimension GROUPS MAP */
INSERT INTO [dbo].[DimensionGroupDimension] ([ID], [GroupID], [DimensionID])
     VALUES (1, 1, 1)
GO

INSERT INTO [dbo].[DimensionGroupDimension] ([ID], [GroupID], [DimensionID])
     VALUES (2, 1, 2)
GO

INSERT INTO [dbo].[DimensionGroupDimension] ([ID], [GroupID], [DimensionID])
     VALUES (3, 1, 3)
GO

INSERT INTO [dbo].[DimensionGroupDimension] ([ID], [GroupID], [DimensionID])
     VALUES (4, 2, 12)
GO

INSERT INTO [dbo].[DimensionGroupDimension] ([ID], [GroupID], [DimensionID])
     VALUES (5, 2, 13)
GO

INSERT INTO [dbo].[DimensionGroupDimension] ([ID], [GroupID], [DimensionID])
     VALUES (6, 2, 17)
GO

INSERT INTO [dbo].[DimensionGroupDimension] ([ID], [GroupID], [DimensionID])
     VALUES (7, 2, 8)
GO

INSERT INTO [dbo].[DimensionGroupDimension] ([ID], [GroupID], [DimensionID])
     VALUES (8, 2, 9)
GO

INSERT INTO [dbo].[DimensionGroupDimension] ([ID], [GroupID], [DimensionID])
     VALUES (9, 3, 4)
GO

INSERT INTO [dbo].[DimensionGroupDimension] ([ID], [GroupID], [DimensionID])
     VALUES (10, 3, 5)
GO

INSERT INTO [dbo].[DimensionGroupDimension] ([ID], [GroupID], [DimensionID])
     VALUES (11, 3, 6)
GO

INSERT INTO [dbo].[DimensionGroupDimension] ([ID], [GroupID], [DimensionID])
     VALUES (12, 3, 7)
GO

INSERT INTO [dbo].[DimensionGroupDimension] ([ID], [GroupID], [DimensionID])
     VALUES (13, 3, 10)
GO

INSERT INTO [dbo].[DimensionGroupDimension] ([ID], [GroupID], [DimensionID])
     VALUES (14, 3, 11)
GO

INSERT INTO [dbo].[DimensionGroupDimension] ([ID], [GroupID], [DimensionID])
     VALUES (15, 3, 14)
GO

INSERT INTO [dbo].[DimensionGroupDimension] ([ID], [GroupID], [DimensionID])
     VALUES (16, 3, 15)
GO

INSERT INTO [dbo].[DimensionGroupDimension] ([ID], [GroupID], [DimensionID])
     VALUES (17, 3, 16)
GO

/* Dimension NAME */
INSERT INTO [dbo].[DimensionName] ([ID], [DimensionID], [Language], [DisplayName])
     VALUES (1,1,'EN','Year')
GO

INSERT INTO [dbo].[DimensionName] ([ID], [DimensionID], [Language], [DisplayName])
     VALUES (2,2,'EN','Month')
GO

INSERT INTO [dbo].[DimensionName] ([ID], [DimensionID], [Language], [DisplayName])
     VALUES (3,3,'EN','Day')
GO

INSERT INTO [dbo].[DimensionName] ([ID], [DimensionID], [Language], [DisplayName])
     VALUES (4,4,'EN','Program')
GO

INSERT INTO [dbo].[DimensionName] ([ID], [DimensionID], [Language], [DisplayName])
     VALUES (5,5,'EN','Client Site')
GO

INSERT INTO [dbo].[DimensionName] ([ID], [DimensionID], [Language], [DisplayName])
     VALUES (6,6,'EN','Client Division')
GO

INSERT INTO [dbo].[DimensionName] ([ID], [DimensionID], [Language], [DisplayName])
     VALUES (7,7,'EN','Master Tag')
GO

INSERT INTO [dbo].[DimensionName] ([ID], [DimensionID], [Language], [DisplayName])
     VALUES (8,8,'EN','Deal')
GO

INSERT INTO [dbo].[DimensionName] ([ID], [DimensionID], [Language], [DisplayName])
     VALUES (9,9,'EN','Package')
GO

INSERT INTO [dbo].[DimensionName] ([ID], [DimensionID], [Language], [DisplayName])
     VALUES (10,10,'EN','Creative Settings')
GO

INSERT INTO [dbo].[DimensionName] ([ID], [DimensionID], [Language], [DisplayName])
     VALUES (11,11,'EN','Inventory Source')
GO

INSERT INTO [dbo].[DimensionName] ([ID], [DimensionID], [Language], [DisplayName])
     VALUES (12,12,'EN','Currency')
GO

INSERT INTO [dbo].[DimensionName] ([ID], [DimensionID], [Language], [DisplayName])
     VALUES (13,13,'EN','Country')
GO

INSERT INTO [dbo].[DimensionName] ([ID], [DimensionID], [Language], [DisplayName])
     VALUES (14,14,'EN','Master Tag Size')
GO

INSERT INTO [dbo].[DimensionName] ([ID], [DimensionID], [Language], [DisplayName])
     VALUES (15,15,'EN','RTB Domains')
GO

INSERT INTO [dbo].[DimensionName] ([ID], [DimensionID], [Language], [DisplayName])
     VALUES (16,16,'EN','Test ID')
GO

INSERT INTO [dbo].[DimensionName] ([ID], [DimensionID], [Language], [DisplayName])
     VALUES (17,17,'EN','Auction Type')
GO

/* Dimension DESCRIPTION */
INSERT INTO [dbo].[DimensionDescriptions] ([ID], [DimensionID], [Description])
     VALUES (1,1,'Year range')
GO

INSERT INTO [dbo].[DimensionDescriptions] ([ID], [DimensionID], [Description])
     VALUES (2,2,'Month range')
GO

INSERT INTO [dbo].[DimensionDescriptions] ([ID], [DimensionID], [Description])
     VALUES (3,3,'Day range')
GO

INSERT INTO [dbo].[DimensionDescriptions] ([ID], [DimensionID], [Description])
     VALUES (4,4,'Programmers are programming the program.')
GO

INSERT INTO [dbo].[DimensionDescriptions] ([ID], [DimensionID], [Description])
     VALUES (5,5,'Client Site yay.')
GO

INSERT INTO [dbo].[DimensionDescriptions] ([ID], [DimensionID], [Description])
     VALUES (6,6,'Client Division. Much add. So multiply! Very subtraction?')
GO

INSERT INTO [dbo].[DimensionDescriptions] ([ID], [DimensionID], [Description])
     VALUES (7,7,'The Grand Master of Tags.')
GO

INSERT INTO [dbo].[DimensionDescriptions] ([ID], [DimensionID], [Description])
     VALUES (8,8,'Double deal. Triple deal. Quadra deal! PENTADEAL!')
GO

INSERT INTO [dbo].[DimensionDescriptions] ([ID], [DimensionID], [Description])
     VALUES (9,9,'If theres Pizza in this Package, Im IN!')
GO

INSERT INTO [dbo].[DimensionDescriptions] ([ID], [DimensionID], [Description])
     VALUES (10,10,'So Creative!')
GO

INSERT INTO [dbo].[DimensionDescriptions] ([ID], [DimensionID], [Description])
     VALUES (11,11,'Your inventory is full.')
GO

INSERT INTO [dbo].[DimensionDescriptions] ([ID], [DimensionID], [Description])
     VALUES (12,12,'Gold coins? Anyone?')
GO

INSERT INTO [dbo].[DimensionDescriptions] ([ID], [DimensionID], [Description])
     VALUES (13,13,'Dont expect to find Middle-Earth here. Just dont.')
GO

INSERT INTO [dbo].[DimensionDescriptions] ([ID], [DimensionID], [Description])
     VALUES (14,14,'The size of GM is impossible to comprehend...')
GO

INSERT INTO [dbo].[DimensionDescriptions] ([ID], [DimensionID], [Description])
     VALUES (15,15,'RTB Domains, what could go wrong?')
GO

INSERT INTO [dbo].[DimensionDescriptions] ([ID], [DimensionID], [Description])
     VALUES (16,16,'01110100011001010111001101110100011010010110111001100111')
GO

INSERT INTO [dbo].[DimensionDescriptions] ([ID], [DimensionID], [Description])
     VALUES (17,17,'OMG they sold Kenny!')
GO