Set-StrictMode -Version 2.0
$ErrorActionPreference = "Stop"  

function Execute-Checked-Command(
    [string]$command = $(throw "command is required")
)
{
    Write-Host Executing: $command

    invoke-expression $command

    if ($LastExitCode -ne 0)
    {
        throw "ErrorLevel: " + $LastExitCode
    }

    Write-Host Execution of $command finished
}
