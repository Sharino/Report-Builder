param( # !! 'param' must be on first line !! parameters sample:  "-ReleaseDate '2014.07.29' -ReleaseNotes 'Adding features' -ReleaseTitle 'Reporting release'"
    [string]$ReleaseDate = $(throw "argument -ReleaseDate is required"),
    [string]$ReleaseNotes = $(throw "argument -ReleaseNotes is required"),
    [string]$ReleaseTitle = $(throw "argument -ReleaseTitle is required"),
    [bool]$DeployScheduler = $false
)

#*************************************************************************
# Powershell settings
#*************************************************************************
$ErrorActionPreference = "Stop"

$_currentDirectory = Split-Path $MyInvocation.MyCommand.Path
.(Join-Path $_currentDirectory "libraries\configuration.ps1")
.(Join-Path $_currentDirectory "libraries\releazr.ps1")
.(Join-Path $_currentDirectory "libraries\xml-transform.ps1")

#*************************************************************************
# Create pack
#*************************************************************************

$team = "Reporting"
$releaseId = Get-Release-Id-Releazr -team:$team -releaseTitle:$ReleaseTitle -releaseDate:$ReleaseDate
$releaseString = ("{0}_{1}" -f $ReleaseDate, $releaseId[1])

# Copy files

Write-Host `n:: Copying IAPI files to pack`n

$reportingIapiHostProject = "..\src\Adform.Reporting.Internal.API.Host.Service"

$reportingIapiFiles = "$reportingIapiHostProject\bin\Prod\"
Remove-Item "$reportingIapiFiles\*.pdb"

if (Test-Path "ReleasePack.REIA")
{
    Remove-Item -Recurse -Force "ReleasePack.REIA"
}

New-Item -ItemType directory -Path "ReleasePack.REIA" | Out-Null
New-Item -ItemType directory -Path "ReleasePack.REIA\configs" | Out-Null
New-Item -ItemType directory -Path "ReleasePack.REIA\service" | Out-Null
New-Item -ItemType directory -Path "ReleasePack.REIA\licenses" | Out-Null

Copy-Item -Recurse -Force "..\licenses\*" "ReleasePack.REIA\licenses" -Verbose
Copy-Item -Recurse -Force "ReleasePackTemplate.REIA\*" "ReleasePack.REIA" -Verbose
Copy-Item -Recurse -Force "$reportingIapiFiles\*" "ReleasePack.REIA\service" -Verbose
ProcessConfigs $reportingIapiHostProject $reportingIapiFiles "ReleasePack.REIA\configs" "Adform.Reporting.Internal.API.Host.Service.exe"

$releaseString >> "ReleasePack.REIA\ReleaseDate.txt"

Write-Host `n:: Copying WEBS files to pack`n

$reportingWebProject = "..\src\Adform.Reporting.Web.UI"

$reportingWebFiles = "$reportingWebProject\build\"
Remove-Item "$reportingWebFiles\*.pdb"

if (Test-Path "ReleasePack.WEBS_GROUP")
{
    Remove-Item -Recurse -Force "ReleasePack.WEBS_GROUP"
}

New-Item -ItemType directory -Path "ReleasePack.WEBS_GROUP" | Out-Null
New-Item -ItemType directory -Path "ReleasePack.WEBS_GROUP\configs" | Out-Null
New-Item -ItemType directory -Path "ReleasePack.WEBS_GROUP\service" | Out-Null
New-Item -ItemType directory -Path "ReleasePack.WEBS_GROUP\licenses" | Out-Null

Copy-Item -Recurse -Force "..\licenses\*" "ReleasePack.WEBS_GROUP\licenses" -Verbose
Copy-Item -Recurse -Force "ReleasePackTemplate.WEBS_GROUP\*" "ReleasePack.WEBS_GROUP" -Verbose
Copy-Item -Recurse -Force "$reportingWebFiles\*" "ReleasePack.WEBS_GROUP\service" -Verbose
ProcessConfigs $reportingWebProject $reportingWebFiles "ReleasePack.WEBS_GROUP\configs" "Web"

$releaseString >> "ReleasePack.WEBS_GROUP\ReleaseDate.txt"

if ($DeployScheduler)
{
    Write-Host `n:: Copying Scheduler files to pack`n

    $schedulerProject = "..\src\Adform.Reporting.JobsServer.Service"

    $schedulerFiles = "$schedulerProject\bin\Prod\"
    Remove-Item "$schedulerFiles\*.pdb"

    if (Test-Path "ReleasePack.REPO1")
    {
        Remove-Item -Recurse -Force "ReleasePack.REPO1"
    }

    New-Item -ItemType directory -Path "ReleasePack.REPO1" | Out-Null
    New-Item -ItemType directory -Path "ReleasePack.REPO1\configs" | Out-Null
    New-Item -ItemType directory -Path "ReleasePack.REPO1\service" | Out-Null

    Copy-Item -Recurse -Force "ReleasePackTemplate.REPO1\*" "ReleasePack.REPO1" -Verbose
    Copy-Item -Recurse -Force "$schedulerFiles\*" "ReleasePack.REPO1\service" -Verbose
    ProcessConfigs $schedulerProject $schedulerFiles "ReleasePack.REPO1\configs" "Adform.Reporting.JobsServer.Service.exe"

    $releaseString >> "ReleasePack.REPO1\ReleaseDate.txt"
}

# Register pack to releazr

Write-Host `n:: Starting pack creation: $releaseString`n

$installCommand = 'install.bat "haProxyManagementKey=${pwd:INLB/management_apikey}" "reportingWebPassword=${pwd:RepoortingServer2/Windows/ReportingWeb}" "domainReportingWebPassword=${pwd:RepoortingServer2/Windows/DomainReportingWeb}"'
$rollbackCommand = 'rollback.bat "haProxyManagementKey=${pwd:INLB/management_apikey}" "reportingWebPassword=${pwd:RepoortingServer2/Windows/ReportingWeb}" "domainReportingWebPassword=${pwd:RepoortingServer2/Windows/DomainReportingWeb}"'
$serversConfig = @{ ConfigFileUrl = "servers.config"; RelativePhysicalPathToFile = "servers.config" }
$configFiles = @( $serversConfig )
$iapiPack = @{PathToFile = (Resolve-Path "ReleasePack.REIA"); PackageFileName = "pack.REIA.zip"; ServerGroup = "REIA"; InstallCommand = $installCommand; RollbackCommand = $rollbackCommand; ConfigFiles = $configFiles}
$websPack = @{PathToFile = (Resolve-Path "ReleasePack.WEBS_GROUP"); PackageFileName = "pack.WEBS_GROUP.zip"; ServerGroup = "REWE_TEMP"; InstallCommand = $installCommand; RollbackCommand = $rollbackCommand; ConfigFiles = $configFiles}

if ($DeployScheduler)
{
    $schedulerPack = @{PathToFile = (Resolve-Path "ReleasePack.REPO1"); PackageFileName = "pack.REPO1.zip"; ServerGroup = "REPO1"; InstallCommand = "install.bat"; RollbackCommand = "rollback.bat"; ConfigFiles = $configFiles}

    Upload-MultiPackage-To-Releazr -team:$team -releaseTitle:$ReleaseTitle -releaseDate:$ReleaseDate -releaseNotes:$ReleaseNotes -packages:@( $iapiPack, $websPack, $schedulerPack )
}
else
{    
    Upload-MultiPackage-To-Releazr -team:$team -releaseTitle:$ReleaseTitle -releaseDate:$ReleaseDate -releaseNotes:$ReleaseNotes -packages:@( $iapiPack, $websPack )
}

Write-Host `n:: File uploaded to releazr`n

Write-Host `n:: Finished`n
