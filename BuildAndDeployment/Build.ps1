#*************************************************************************
# Powershell settings
#*************************************************************************
Set-StrictMode -Version 2.0
$ErrorActionPreference = "Stop"

$_currentDirectory = Split-Path $MyInvocation.MyCommand.Path
.(Join-Path $_currentDirectory "libraries\common.ps1")

#*************************************************************************
# Create pack
#*************************************************************************

# Clean-up

rmdir .\ReleasePack.* -Recurse -Force

# Build

$msBuildPath = "$env:windir\Microsoft.NET\Framework64\v4.0.30319\MSBuild.exe"
$nugetPath = "..\.nuget\nuget.exe"

Write-Host `n:: Restoring nuget packages`n
Execute-Checked-Command "$nugetPath restore ..\Adform.Reporting.sln"

Write-Host `n:: Building solution`n
Execute-Checked-Command "$msBuildPath ..\Adform.Reporting.sln /p:Configuration=Prod /p:Platform=`"Any CPU`" /verbosity:quiet"

Write-Host `n:: Building Web`n
Execute-Checked-Command "$msBuildPath ..\src\Adform.Reporting.Web.UI\Adform.Reporting.Web.UI.csproj /p:Configuration=Prod /p:Platform=`"Any CPU`" /target:package /p:OutputPath=bin /p:_PackageTempDir=build /verbosity:quiet"

Write-Host `n:: Finished`n
