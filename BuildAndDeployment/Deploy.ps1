param( # !! 'param' must be on first line !! parameters sample:  "-Configuration 'Dev3' -Environment 'Dev3'"
    [string]$Configuration = $(throw "argument -Configuration is required"),
    [string]$Environment = $(throw "argument -Environment is required")
)

#*************************************************************************
# Powershell settings
#*************************************************************************
$ErrorActionPreference = "Stop"

$_currentDirectory = Split-Path $MyInvocation.MyCommand.Path
.(Join-Path $_currentDirectory "libraries\backup.ps1")
.(Join-Path $_currentDirectory "libraries\delete.ps1")
.(Join-Path $_currentDirectory "libraries\xml-transform.ps1")
.(Join-Path $_currentDirectory "libraries\zip.ps1")

#*************************************************************************
# Execute release
#*************************************************************************
$deploymentTime = ((Get-Date).ToUniversalTime()).ToString("yyyy-MM-dd_HH.mm")


### IAPI deployment

$serviceName = "Adform.Reporting.InternalAPI.Host"

$remoteUserName = "$Environment\ReportingWeb"
$remoteUserPassword = "admin01ADF"
$serviceRoot = "\\{0}\d\WindowsServices\$serviceName\"
$serviceFilesLocation = "$serviceRoot\Service\"
$backupFolder = "$serviceRoot\Backup\"
$backupFileNameTemplate = "teamcity-$serviceName_{0}.zip"

Write-Host `n:: Getting REIA server list`n

$wc = New-Object System.Net.WebClient

[xml]$serversXml = $wc.DownloadString("http://deployment.adform.com/Config/Browse/$Environment/servers.config?xpath=//Servers/Server[./Name/text()=%22REIA%22]/Static")

$servers = $serversXml.Static.Server

foreach ($server in $servers)
{
    $serverDomain = $server.Domain

    Write-Host `n:: Deploying to server $serverDomain`n

    Write-Host `n:: Establishing remote PowerShell session`n
    $credential = New-Object System.Management.Automation.PSCredential -ArgumentList $remoteUserName, ($remoteUserPassword | ConvertTo-SecureString -AsPlainText -Force)
    $session = New-PSSession -ComputerName $serverDomain -Credential $credential
    Write-Host "Done"

    Write-Host `n:: Stopping service`n
    Invoke-Command -Session $session { param($serviceName) Stop-Service $serviceName; Write-Host "Service status: " (Get-Service $serviceName).Status } -ArgumentList $serviceName
    Write-Host "Done"

    Write-Host `n:: Backing up files`n
    Backup-Folder ($serviceFilesLocation -f $serverDomain) (Join-Path ($backupFolder -f $serverDomain) $backupFileNameTemplate) $deploymentTime
    Write-Host "Done"

    Write-Host `n:: Copying new files`n
    $source = "..\src\Adform.Reporting.Internal.API.Host.Service\bin\$Configuration\*"
    $destination = ($serviceFilesLocation -f $serverDomain)
    Copy-Item -Path $source -Destination $destination -Recurse -Force -Verbose -ErrorAction Stop
    Write-Host "Done"

    Write-Host `n:: Starting service`n
    Invoke-Command -Session $session { param($serviceName) Start-Service $serviceName; Write-Host "Service status: " (Get-Service $serviceName).Status } -ArgumentList $serviceName
    Write-Host "Done"

    Write-Host `n:: Closing remote PowerShell session`n
    Remove-PSSession $session
    Write-Host "Done"
}