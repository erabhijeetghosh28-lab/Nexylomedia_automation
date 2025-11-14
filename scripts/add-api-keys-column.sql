-- Manual SQL script to add apiKeys column to tenant_quotas table
-- Run this directly in SQL Server Management Studio or Azure Data Studio
-- if the migration times out

USE Nexyloautomation;
GO

-- Check if column exists, then add it
IF NOT EXISTS (
    SELECT 1 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'dbo'
    AND TABLE_NAME = 'tenant_quotas' 
    AND COLUMN_NAME = 'apiKeys'
)
BEGIN
    ALTER TABLE [dbo].[tenant_quotas]
    ADD [apiKeys] nvarchar(MAX) NULL;
    
    PRINT 'Column apiKeys added successfully to tenant_quotas table';
END
ELSE
BEGIN
    PRINT 'Column apiKeys already exists in tenant_quotas table';
END
GO


