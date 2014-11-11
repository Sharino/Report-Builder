function Remove-Item-With-Retry([string]$path = $(throw "$path is required"))
{
    $numTries = 10

    do
    {
        $numTries--

        Remove-Item $path -ErrorAction SilentlyContinue -Recurse -Force

        $filesExist = !!(Get-ChildItem "$path" -ErrorAction SilentlyContinue)

        $tryAgain = (($filesExist) -and ($numTries -ge 0))

        if ($tryAgain)
        {
            Write-Host "Some files exist. Will try again in 10 seconds"

            Sleep -Seconds 10
        }
    }
    while ($tryAgain)

    if ($filesExist)
    {
        throw "Failed to delete all files"
    }
}
