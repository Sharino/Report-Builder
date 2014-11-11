function Upload-Package-To-Releazr(
    [string]$team = $(throw "$team is required"),
    [string]$releaseTitle = $(throw "$releaseTitle is required"),
    [string]$releaseDate = $(throw "$releaseDate is required"),
    [string]$releaseNotes,
    [string]$releazrBaseUrl = "http://releazr.adform.com/",
    [string]$pathToFile = $(throw "$pathToFile is required"),
    [string]$packageFileName = "Pack.zip",
    [string]$serverGroup,
    [string]$installCommand = "install.bat",
    [string]$rollbackCommand = "rollback.bat",
    $configFiles
)
{
    $client = GetReleazrProxy "$releazrBaseUrl/PackageUploader.svc?wsdl"

    if (Test-Path $pathToFile -PathType Container)
    {
        Write-Host "$pathToFile is directory. Zipping it..."

        $guid = [guid]::NewGuid().Guid
        $zippedFile = "$env:TEMP\$guid.zip"
        CompressDirectory $pathToFile $zippedFile
        $pathToFile = $zippedFile

        Write-Host "Zipped to $zippedFile"
    }

    Write-Host "Uploading $pathToFile to Releazr..."

    if (!(Test-Path $pathToFile -PathType Leaf))
    {
        throw "Package file '$pathToFile' was not found."
    }
    
    $fileStream = [System.IO.File]::OpenRead($pathToFile)

    try
    {
        $excludeEnvironments = $null

        $releaseId = ""

        $configs = @()

        foreach($config in $configFiles)
        {
            $configItem = New-Object Adform.Releazr.API.Interfaces.ConfigFile
            $configItem.ConfigFileUrl = $config.ConfigFileUrl
            $configItem.RelativePhysicalPathToFile = $config.RelativePhysicalPathToFile
            $configs += $configItem
        }

        $client.UploadPackage($configs,
                              $excludeEnvironments,
                              $packageFileName,
                              $installCommand,
                              $releaseDate,
                              $releaseNotes,
                              $rollbackCommand,
                              $serverGroup,
                              $team,
                         [ref]$releaseTitle,
                              $fileStream,
                         [ref]$releaseId)
    }
    finally
    {
        $fileStream.Dispose()
    }
    
    Write-Host "Uploaded to release" $releaseId

    if (($zippedFile -ne $null) -and (Test-Path $zippedFile -PathType Leaf))
    {
        Write-Host "Deleting zipped file $zippedFile..."
        Remove-Item $zippedFile -Force
        Write-Host "Done"
    }

    Write-Host "Upload to Releazr is DONE"
}

function Upload-MultiPackage-To-Releazr(
    [string]$team = $(throw "$team is required"),
    [string]$releaseTitle = $(throw "$releaseTitle is required"),
    [string]$releaseDate = $(throw "$releaseDate is required"),
    [string]$releaseNotes,
    [string]$releazrBaseUrl = "http://releazr.adform.com/",
    $packages = $(throw "$packages is required")
)
{
    $client = GetReleazrProxy "$releazrBaseUrl/PackageUploader.svc?wsdl"

    $packs = @()

    foreach($package in $packages)
    {
        $pathToFile = $package.PathToFile

        if (Test-Path $pathToFile -PathType Container)
        {
            Write-Host "$pathToFile is directory. Zipping it..."

            $guid = [guid]::NewGuid().Guid
            $zippedFile = "$env:TEMP\$guid.zip"
            CompressDirectory $pathToFile $zippedFile
            $pathToFile = $zippedFile

            Write-Host "Zipped to $zippedFile"
        }

        if ($package.ConfigFiles -eq $null)
        {
            $configs = $null
        }
        else
        {
            $configs = @()

            foreach($config in $package.ConfigFiles)
            {
                $configItem = New-Object Adform.Releazr.API.Interfaces.ConfigFile
                $configItem.ConfigFileUrl = $config.ConfigFileUrl
                $configItem.RelativePhysicalPathToFile = $config.RelativePhysicalPathToFile
                $configs += $configItem
            }
        }

        $pack = New-Object Adform.Releazr.API.Interfaces.PackageInfo
        $pack.FileName = $package.PackageFileName
        $pack.FileBytes = [System.IO.File]::ReadAllBytes($pathToFile)
        $pack.ServerGroup = $package.ServerGroup
        $pack.InstallCommand = $package.InstallCommand
        $pack.RollbackCommand = $package.RollbackCommand
        $pack.ConfigFiles = $configs

        $packs += $pack

        if (($zippedFile -ne $null) -and (Test-Path $zippedFile -PathType Leaf))
        {
            Write-Host "Deleting zipped file $zippedFile..."
            Remove-Item $zippedFile -Force
            Write-Host "Done"
        }
    }

    $excludeEnvironments = $null

    $releaseId = ""

    $client.UploadMultiplePackages($excludeEnvironments,
                                   $releaseDate,
                                   $releaseNotes,
                                   $team,
                              [ref]$releaseTitle,
                                   $packs,
                              [ref]$releaseId)

    Write-Host "Uploaded to release" $releaseId

    Write-Host "Upload to Releazr is DONE"
}

function Get-Release-Id-Releazr(
    [string]$team = $(throw "$team is required"),
    [string]$releaseTitle = $(throw "$releaseTitle is required"),
    [string]$releaseDate = $(throw "$releaseDate is required"),
    [string]$releaseNotes,
    [string]$releazrBaseUrl = "http://releazr.adform.com/"
)
{
    $client = GetReleazrProxy "$releazrBaseUrl/PackageUploader.svc?wsdl"

    [System.Guid]$releaseId = [guid]::NewGuid()

    $client.UploadMultiplePackages($null,
                                   $releaseDate,
                                   "",
                                   $team,
                              [ref]$releaseTitle,
                                   @(),
                              [ref]$releaseId)

    $releaseIdString = $releaseId.ToString("N")

    if ($releaseIdString -eq "")
    {
        throw "Unable to get release id"
    }

    return $releaseIdString
}

function CompressDirectory([string] $folderPath, [string] $zipPath)
{
    Add-Type -Path .\libraries\dlls\Ionic.Zip.Reduced.dll | Out-Null

    $zipFile = new-object Ionic.Zip.ZipFile
    $zipfile.AddDirectory($folderPath)
    $zipfile.Save($zipPath)
    $zipfile.Dispose()
}


# Based on https://github.com/justaprogrammer/PowerShellWCF
function GetReleazrProxy([string]$WsdlUrl)
{
    Add-Type -AssemblyName "System.ServiceModel"
    Add-Type -AssemblyName "System.Runtime.Serialization"

    $mexClient = New-Object System.ServiceModel.Description.MetadataExchangeClient([Uri]$WsdlUrl, [System.ServiceModel.Description.MetadataExchangeClientMode]::HttpGet);
    $mexClient.MaximumResolvedReferences = [System.Int32]::MaxValue
    $metadataSet = $mexClient.GetMetadata()
    $wsdlImporter = New-Object System.ServiceModel.Description.WsdlImporter($metadataSet)
        
    $endpoints = $wsdlImporter.ImportAllEndpoints()

    $generator = new-object System.ServiceModel.Description.ServiceContractGenerator
    
    foreach($contractDescription in $wsdlImporter.ImportAllContracts())
    {
        [void]$generator.GenerateServiceContractType($contractDescription)
    }
    
    $parameters = New-Object System.CodeDom.Compiler.CompilerParameters
    $parameters.GenerateInMemory = $true

    $providerOptions = New-Object "Collections.Generic.Dictionary[String,String]"
    [void]$providerOptions.Add("CompilerVersion","v3.5")
    
    $compiler = New-Object Microsoft.CSharp.CSharpCodeProvider($providerOptions)
    $result = $compiler.CompileAssemblyFromDom($parameters, $generator.TargetCompileUnit);
    
    if($result.Errors.Count -gt 0)
    {
        throw "Error generating proxy: " + $result.Errors[0].ErrorText
    }
    
    return New-Object PackageUploadServiceClient($endpoints[0].Binding, $endpoints[0].Address)
}