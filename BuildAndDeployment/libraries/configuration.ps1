function GetConfigurationByEnv([string]$environment = $env:ENV)
{
    switch ($environment)
    {
        "DEV1" { return "Dev1" }
        "DEV3" { return "Release" }
        "PREPROD" { return "Preprod" }
        "PROD" { return "Prod" }
        default { throw "Unknown environment" }
    }
}

function ProcessConfigs([string]$projectPath, [string]$compiledFilePath, [string]$outputPath, [string]$serviceExeName)
{
    Copy-Item -Recurse -Force (Get-ChildItem "$projectPath\*.config") $outputPath
    Remove-Item -Force "$outputPath\packages.config"

    foreach ($prodConfigFile in (Get-ChildItem "$outputPath\*.Prod.config"))
    {
        $baseConfig = $prodConfigFile -replace ".Prod.config", ".config"
        $configTransformations = (Get-ChildItem ($prodConfigFile -replace ".Prod.config", ".*.config"))

        foreach ($configTransformation in $configTransformations)
        {
            Transform-ConfigXml $baseConfig $configTransformation $configTransformation

            # Convert file to DOS/Windows line endings
            (Get-Content $configTransformation) | Out-File -Encoding UTF8 $configTransformation

            if ((Split-Path $baseConfig -Leaf) -eq "App.config")
            {
                Rename-Item "$configTransformation" ("$configTransformation" -replace "App.", "$serviceExeName.")
            }
        }

        Remove-Item $baseConfig
        
        if ((Split-Path $baseConfig -Leaf) -eq "App.config")
        {
            Remove-Item "$compiledFilePath\$serviceExeName.config" -ErrorAction SilentlyContinue
        }
        else
        {
            $baseConfigName = (Split-Path $baseConfig -Leaf)
            Remove-Item "$compiledFilePath\$baseConfigName" -ErrorAction SilentlyContinue
        }
    }
}