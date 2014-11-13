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


$serviceName = "ApiHost.exe"
$sevenZipPath = "D:\WindowsServices\Tools\7-Zip\7za.exe"
$programFiles = "D:\WindowsServices\Report.Builder.API\Service\*"
$backupLocation = "\\{0}\WindowsServices\Report.Builder.API\Backup"
$backupFolder = "D:\WindowsServices\Report.Builder.API\Backup"

$serviceFilesLocation = "\\{0}\api\"

$msBuildPath = "$env:windir\Microsoft.NET\Framework64\v4.0.30319\MSBuild.exe"
$nugetPath = "..\.nuget\nuget.exe"


$servers = @(
    @{Name="REPO01"; IP=$Repo01Ip}
)

# Deploy API

$deploymentTime = (Get-Date -UFormat %Y-%m-%d_%H.%M)

foreach ($server in $servers)
{
    $serverIP = $server.IP

    Write-Host `n:: Deploying to server $serverIP`n    

    Write-Host `n:: Deleting old files`n
    $serviceFilesShare = ($serviceFilesLocation -f $serverIP)+"*.*"
    Remove-Item -path $serviceFilesShare -Force

    Write-Host `n:: Copying new files`n
    $source = "..\API\source\Host\bin\Debug\*"
    $destination = ($serviceFilesLocation -f $serverIP)
    Write-Host `n:: Source  $source`n
    Write-Host `n:: Destination $destination`n

    Copy-Item -Path $source -Destination $destination -Recurse -Force  	
	
	Write-Host `n:: [REMOTE] Starting service`n
    Write-Host `n:: ..\API\source\Host\bin\Debug\ApiHost.exe -install`n
    $startCommand = "C:\Report Builder\API\ApiHost.exe -install"
    Start-And-Wait-For-Remote-Process $serverIP $startCommand  
}
foreach ($server in $servers)
{
    $serverDomain = $server.Domain

    Write-Host `n:: Deploying to server $serverDomain`n

    Write-Host `n:: Backing up files`n
    Backup-Folder ($serviceFilesLocation -f $serverDomain) (Join-Path ($backupFolder -f $serverDomain) $backupFileNameTemplate) $deploymentTime
    Write-Host "Done"

    Write-Host `n:: Transforming Web.config file`n
    $sourceFile = (Resolve-Path "..\src\Adform.Reporting.Web.UI\Web.config").Path
    $transformFile = (Resolve-Path "..\src\Adform.Reporting.Web.UI\Web.$Configuration.config").Path
    $tempWebConfigFile = [System.IO.Path]::GetTempFileName()
    Transform-ConfigXml $sourceFile $transformFile $tempWebConfigFile

    Write-Host `n:: Deleting old files`n
    $serviceFolder = ($serviceFilesLocation -f $serverDomain)
    Remove-Item-With-Retry "$serviceFolder\bin\*"
    Write-Host "Done"

    Write-Host `n:: Copying new files`n
    $source = "..\src\Adform.Reporting.Web.UI\build\*"
    $destination = ($serviceFilesLocation -f $serverDomain)
    Copy-Item -Path $source -Destination "$destination\" -Recurse -Force -Verbose -ErrorAction Stop
    Copy-Item -Path $tempWebConfigFile -Destination "$destination\Web.config" -Force -Verbose -ErrorAction Stop
    Remove-Item -Path $tempWebConfigFile -Force
    Write-Host "Done"
}

Write-Host `n:: Finished`n