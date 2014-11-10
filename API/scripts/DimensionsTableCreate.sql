USE [ReportBuilder]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

/* Dimension */
SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[Dimensions](
	[ID] [int] NOT NULL,
	[Mnemonic] [varchar](50) NOT NULL,
	[DataType] [varchar](12) NOT NULL,
 CONSTRAINT [PK_Dimensions] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO

/* Dimension GROUPS */
SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[DimensionGroups](
	[ID] [int] NOT NULL,
	[GroupName] [varchar](50) NOT NULL,
 CONSTRAINT [PK_DimensionGroups] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO

/* Dimension GROUPS <MAP> Dimension */
CREATE TABLE [dbo].[DimensionGroupDimension](
	[ID] [int] NOT NULL,
	[GroupID] [int] NOT NULL,
	[DimensionID] [int] NOT NULL,
 CONSTRAINT [PK_DimensionGroupMap] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [DimensionUniqueCombos] UNIQUE NONCLUSTERED 
(
	[GroupID] ASC,
	[DimensionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[DimensionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

/* Dimension NAME */
SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[DimensionName](
	[ID] [int] NOT NULL,
	[DimensionID] [int] NOT NULL,
	[Language] [varchar](50) NOT NULL,
	[DisplayName] [varchar](50) NOT NULL,
 CONSTRAINT [PK_DimensionName] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO

/* Dimension DISCRIPTION */
CREATE TABLE [dbo].[DimensionDescriptions](
	[ID] [int] NOT NULL,
	[DimensionID] [int] NOT NULL,
	[Description] [nvarchar](300) NULL,
 CONSTRAINT [PK_DimensionDescriptions] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UNIQUE Dimension] UNIQUE NONCLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[DimensionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[DimensionDescriptions]  WITH CHECK ADD  CONSTRAINT [FK_DimensionDescriptions_Dimensions] FOREIGN KEY([DimensionID])
REFERENCES [dbo].[Dimensions] ([ID])
GO

ALTER TABLE [dbo].[DimensionDescriptions] CHECK CONSTRAINT [FK_DimensionDescriptions_Dimensions]
GO

ALTER TABLE [dbo].[DimensionName]  WITH CHECK ADD  CONSTRAINT [FK_Dimension_DimensionName] FOREIGN KEY([DimensionID])
REFERENCES [dbo].[Dimensions] ([ID])
GO

ALTER TABLE [dbo].[DimensionName] CHECK CONSTRAINT [FK_Dimension_DimensionName]
GO

ALTER TABLE [dbo].[DimensionGroupDimension]  WITH CHECK ADD  CONSTRAINT [FK_DimensionGroupMap_DimensionGroups] FOREIGN KEY([GroupID])
REFERENCES [dbo].[DimensionGroups] ([ID])
GO

ALTER TABLE [dbo].[DimensionGroupDimension] CHECK CONSTRAINT [FK_DimensionGroupMap_DimensionGroups]
GO

ALTER TABLE [dbo].[DimensionGroupDimension]  WITH CHECK ADD  CONSTRAINT [FK_DimensionGroupMap_Dimensions] FOREIGN KEY([DimensionID])
REFERENCES [dbo].[Dimensions] ([ID])
GO

ALTER TABLE [dbo].[DimensionGroupDimension] CHECK CONSTRAINT [FK_DimensionGroupMap_Dimensions]
GO

ALTER TABLE [dbo].[DimensionGroups]  WITH CHECK ADD  CONSTRAINT [FK_DimensionGroups_DimensionGroups] FOREIGN KEY([ID])
REFERENCES [dbo].[DimensionGroups] ([ID])
GO

ALTER TABLE [dbo].[DimensionGroups] CHECK CONSTRAINT [FK_DimensionGroups_DimensionGroups]
GO
