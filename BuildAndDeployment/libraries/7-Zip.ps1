Set-StrictMode -Version 2.0
$ErrorActionPreference = "Stop"

function Create-Zip-Command(
    [String] $directory,
    [String] $zipFile,
    [string]$pathToZipExe = "C:\Program Files\7-zip\7z.exe"
)
{
    return ('{0} a -tzip "{1}" "{2}" -r -y' -f $pathToZipExe, $zipFile, $directory)
}