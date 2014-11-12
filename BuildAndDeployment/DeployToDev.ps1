param( # !! 'param' must be on first line !! parameters sample:  "-Configuration 'DEV3' -Repo01Ip '172.22.3.10'"
    [string]$Configuration = $(throw "argument -Configuration is required"),
    [string]$Repo01Ip = $(throw "argument -Repo01Ip is required")
)

#*************************************************************************
# Powershell settings
#*************************************************************************
Set-StrictMode -Version 2.0
$ErrorActionPreference = "Stop"

$_currentDirectory = Split-Path $MyInvocation.MyCommand.Path
.(Join-Path $_currentDirectory "libraries\Common.ps1")
.(Join-Path $_currentDirectory "libraries\WmiRemoteRun.ps1")
.(Join-Path $_currentDirectory "libraries\7-Zip.ps1")

#*************************************************************************
# Execute release
#*************************************************************************


$serviceName = "Adform.Reporting.Maintenance.SsrsMaintenance.Host"
$sevenZipPath = "D:\WindowsServices\Tools\7-Zip\7za.exe"
$programFiles = "D:\WindowsServices\Adform.Reporting.Maintenance.SsrsMaintenance.Host\Serivce\*"
$backupLocation = "\\{0}\WindowsServices\Adform.Reporting.Maintenance.SsrsMaintenance.Host\Backup"
$backupFolder = "D:\WindowsServices\Adform.Reporting.Maintenance.SsrsMaintenance.Host\Backup"

$serviceFilesLocation = "\\{0}\WindowsServices\Adform.Reporting.Maintenance.SsrsMaintenance.Host\Service\"

$msBuildPath = "$env:windir\Microsoft.NET\Framework64\v4.0.30319\MSBuild.exe"
$nugetPath = "..\.nuget\nuget.exe"


$servers = @(
    @{Name="REPO01"; IP=$Repo01Ip}
)

# Build

Write-Host `n:: Restoring nuget packages`n
Execute-Checked-Command "$nugetPath restore ..\Adform.Reporting.Maintenance.sln -verbosity detailed"

Write-Host `n:: Building solution`n
Execute-Checked-Command "$msBuildPath ..\Adform.Reporting.Maintenance.sln /p:Configuration=$Configuration /p:Platform=`"Any CPU`" /p:verbosity=diag"

# Deploy

$deploymentTime = (Get-Date -UFormat %Y-%m-%d_%H.%M)

foreach ($server in $servers)
{
    $serverIP = $server.IP

    Write-Host `n:: Deploying to server $serverIP`n

    # Backup

    $backupFilePattern = "teamcity-SsrsMaintenanceService_*.zip"

    $backupShare = ($backupLocation -f $serverIP)

    $backupFiles = Join-Path $backupShare $backupFilePattern

    if ((Get-ChildItem $backupFiles) -eq $null)
    {
        Write-Host `n:: NO BACKUP Files found !!!`n
        $numFilesToDelete = 0
    }
    else
    {
        $numFilesToDelete = @(Get-ChildItem $backupFiles).Count - 20
    }
        

    if ($numFilesToDelete -ge 1)
    {
        Write-Host `n:: Deleting $numFilesToDelete old backup file`(s`)`n

        Get-ChildItem $backupFiles | Sort-Object Name | Select-Object -First $numFilesToDelete | Remove-Item -Force
    }

    Write-Host `n:: [REMOTE] Stopping service`n
    $stopCommand = "sc stop $serviceName"
    Start-And-Wait-For-Remote-Process $serverIP $stopCommand


    Write-Host `n:: [REMOTE] Making backup zip file`n
    $backupFile = ("{0}\{1}" -f $backupFolder, ($backupFilePattern -replace '\*', $deploymentTime))
    $zipCommand = Create-Zip-Command $programFiles $backupFile $sevenZipPath
    Start-And-Wait-For-Remote-Process $serverIP $zipCommand


    Write-Host `n:: Deleting old files`n
    $serviceFilesShare = ($serviceFilesLocation -f $serverIP)+"*.*"
    Remove-Item -path $serviceFilesShare -Force


    Write-Host `n:: Copying new files`n
    $source = "..\src\Adform.Reporting.Maintenance.SsrsMaintenance.Host\bin\$Configuration\*"
    $destination = ($serviceFilesLocation -f $serverIP)
    Write-Host `n:: Source  $source`n
    Write-Host `n:: Destination $destination`n

    Copy-Item -Path $source -Destination $destination -Recurse -Force
  

    Write-Host `n:: [REMOTE] Starting service`n
    $startCommand = "sc start $serviceName"
    Start-And-Wait-For-Remote-Process $serverIP $startCommand  
}

Write-Host `n:: Finished`n