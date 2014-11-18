
#*************************************************************************
# Powershell settings
#*************************************************************************
Set-ExecutionPolicy RemoteSigned
Set-StrictMode -Version 2.0
$ErrorActionPreference = "Stop"


#*************************************************************************
# Execute release
#*************************************************************************


$serviceName = "Report Builder"
$sevenZipPath = "D:\WindowsServices\Tools\7-Zip\7za.exe"
$programFiles = "D:\WindowsServices\Report.Builder.API\Service\*"
$backupLocation = "\\{0}\WindowsServices\Report.Builder.API\Backup"
$backupFolder = "D:\WindowsServices\Report.Builder.API\Backup"

$serviceFilesLocation = "\\{0}\api\"

$msBuildPath = "$env:windir\Microsoft.NET\Framework64\v4.0.30319\MSBuild.exe"
$nugetPath = "..\.nuget\nuget.exe"


$servers = @(
    @{Name="WIN-5UJ4T7I4AS4"; IP="172.22.3.236"; Domain="WIN-5UJ4T7I4AS4.dev3.adform.com";}
)

# Deploy API

$deploymentTime = (Get-Date -UFormat %Y-%m-%d_%H.%M)

$remoteUserName = "DEV3\Administrator"
$remoteUserPassword = "admin01ADF"

foreach ($server in $servers)
{
    $serverDomain = $server.Domain
	$serverIP = $server.IP
	
    Write-Host `n:: Establishing remote PowerShell session`n
    $credential = New-Object System.Management.Automation.PSCredential -ArgumentList $remoteUserName, ($remoteUserPassword | ConvertTo-SecureString -AsPlainText -Force)
    $session = New-PSSession -ComputerName $serverDomain -Credential $credential
    Write-Host "Done"

    Write-Host `n:: Stopping service`n
    Invoke-Command -Session $session { param($serviceName) Stop-Service $serviceName; Write-Host "Service status: " (Get-Service $serviceName).Status } -ArgumentList $serviceName
    Write-Host "Done"  
	
    Write-Host `n:: Deleting old files`n
    $serviceFilesShare = ($serviceFilesLocation -f $serverIP)+"*.*"
    Remove-Item -path $serviceFilesShare -Force

    Write-Host `n:: Copying new files`n
    $source = "..\API\source\Host\bin\Release\*"
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
