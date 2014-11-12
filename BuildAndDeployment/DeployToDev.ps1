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


$serviceName = "API"
$sevenZipPath = "D:\WindowsServices\Tools\7-Zip\7za.exe"
$programFiles = "D:\WindowsServices\Report.Builder.API\Service\*"
$backupLocation = "\\{0}\WindowsServices\Report.Builder.API\Backup"
$backupFolder = "D:\WindowsServices\Report.Builder.API\Backup"

$serviceFilesLocation = "C:\Report Builder\API"

$msBuildPath = "$env:windir\Microsoft.NET\Framework64\v4.0.30319\MSBuild.exe"
$nugetPath = "..\.nuget\nuget.exe"


$servers = @(
    @{Name="REPO01"; IP=$Repo01Ip}
)

# Deploy

$deploymentTime = (Get-Date -UFormat %Y-%m-%d_%H.%M)

foreach ($server in $servers)
{
    $serverIP = $server.IP

    Write-Host `n:: Deploying to server $serverIP`n   

    Write-Host `n:: [REMOTE] Stopping service`n
    $stopCommand = "sc stop $serviceName"
    Start-And-Wait-For-Remote-Process $serverIP $stopCommand

    Write-Host `n:: Deleting old files`n
    $serviceFilesShare = ($serviceFilesLocation -f $serverIP)+"*.*"
    Remove-Item -path $serviceFilesShare -Force

    Write-Host `n:: Copying new files`n
    $source = "..\API\source\Host\bin\$Configuration\*"
    $destination = ($serviceFilesLocation -f $serverIP)
    Write-Host `n:: Source  $source`n
    Write-Host `n:: Destination $destination`n

    Copy-Item -Path $source -Destination $destination -Recurse -Force
  

    Write-Host `n:: [REMOTE] Starting service`n
    $startCommand = "sc start $serviceName"
    Start-And-Wait-For-Remote-Process $serverIP $startCommand  
}

Write-Host `n:: Finished`n