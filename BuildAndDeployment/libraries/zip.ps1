function UnZip-File([string]$zipFilePath, [string]$extractionPath)
{
    [Reflection.Assembly]::LoadWithPartialName("System.IO.Compression.FileSystem") | Out-Null

    $zipArchive = [System.IO.Compression.ZipFile]::OpenRead($zipFilePath)

    foreach ($entry in $zipArchive.Entries)
    {
        $path = $extractionPath + "\" + $entry.FullName

        if ($path.EndsWith("/"))
        {
            if (!(Test-Path -PathType Container $path))
            {
                mkdir $path -Force | Out-Null
            }
        }
        else
        {
            $folder = (Split-Path -Parent $path)

            if (!(Test-Path -PathType Container $folder))
            {
                mkdir $folder -Force | Out-Null
            }

            [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $path, $true)
        }
    }

    $zipArchive.Dispose()
}

function Zip-Folder([string]$folderPath, [string]$zipPath)
{
    [Reflection.Assembly]::LoadWithPartialName("System.IO.Compression.FileSystem") | Out-Null
    [System.IO.Compression.ZipFile]::CreateFromDirectory($folderPath, $zipPath)
}