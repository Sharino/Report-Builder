param( # !! 'param' must be on first line !! parameters sample:  "-Configuration 'DEV3' -Repo01Ip '172.22.3.10'"
    [string]$Configuration = $(throw "argument -Configuration is required"),
    [string]$Repo01Ip = $(throw "argument -Repo01Ip is required")
)
#*************************************************************************
# Powershell settings
#*************************************************************************
Set-StrictMode -Version 2.0
$ErrorActionPreference = "Stop"


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

$deploymentTime = (Get-Date -UFormat %Y-%m-%d_%H.%M)

# Deploy UI

$serviceFilesLocation = "\\{0}\Client\"
$configFilesLocation = "\\{0}\Client\scripts\config\config.js"

foreach ($server in $servers)
{ 
	$serverIP = $server.IP
	
	Write-Host `n:: Deploying to server $serverIP`n    

    Write-Host `n:: Deleting old UI files`n
    $serviceFilesShare = ($serviceFilesLocation -f $serverIP)+"*.*"
    Remove-Item -path $serviceFilesShare -Force

    Write-Host `n:: Copying new UI files`n
    $source = "..\UI\UI\*"
    $destination = ($serviceFilesLocation -f $serverIP)
    Write-Host `n:: Source  $source`n
    Write-Host `n:: Destination $destination`n
    Copy-Item -Path $source -Destination $destination -Recurse -Force  	
	
	#CONFIG
	Write-Host `n:: Copying new Config files`n
    $source = "..\UI\UI\scripts\config\config.Release.js"
	$destination = ($configFilesLocation -f $serverIP)
    Write-Host `n:: Source  $source`n
    Write-Host `n:: Destination $destination`n	
    Copy-Item -Path $source -Destination $destination -Recurse -Force  	
	
	# Load IIS module:
	Import-Module WebAdministration
	# Set a name of the site we want to recycle the pool for:
	$site = "Default Web Site"
	# Get pool name by the site name:
	$pool = (Get-Item "IIS:\Sites\$site"| Select-Object applicationPool).applicationPool
	# Recycle the application pool:
	Restart-WebAppPool $pool

}
Write-Host `n:: Finished`n