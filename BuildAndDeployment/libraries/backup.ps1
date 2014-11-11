function Get-Backup-File([string]$backupFileNameTemplate, [string]$dateAndReleaseId)
{
    return ($backupFileNameTemplate -f $dateAndReleaseId)
}

function Backup-Folder([string]$folderPath, [string]$backupFileNameTemplate, [string]$dateAndReleaseId)
{
    if (Test-Path -PathType Container $folderPath)
    {
        $backupFilePath = Get-Backup-File $backupFileNameTemplate $dateAndReleaseId

        if (Test-Path $backupFilePath)
        {
            Write-Host `n:: Existing backup file `($backupFilePath`) was found, skipping backup creation`n
        }
        else
        {
            $backupFilePattern = ($backupFileNameTemplate -f "*")
            $numFilesToDelete = (Get-ChildItem $backupFilePattern -ErrorAction SilentlyContinue).Count - 20
            
            $backupFolder = (Split-Path -Parent $backupFilePath)
            mkdir $backupFolder -Force | Out-Null

            if ($numFilesToDelete -ge 1)
            {
                Write-Host `n:: Deleting $numFilesToDelete old backup file`(s`)`n

                Get-ChildItem $backupFilePattern | Sort-Object LastWriteTime | Select-Object -First $numFilesToDelete | Remove-Item -Force
            }

            Write-Host `n:: Making backup zip file `($backupFilePath`)`n
            Zip-Folder "$folderPath" $backupFilePath
        }
    }
    else
    {
        Write-Host `n:: Folder $folderPath does not exist - no backups will be made`n
    }
}

function Restore-Backup([string]$zipFilePath, [string]$extractionPath)
{
    UnZip-File $zipFilePath $extractionPath
}
