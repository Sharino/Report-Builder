Set-StrictMode -Version 2.0
$ErrorActionPreference = "Stop"

function Start-Remote-Process(
    [string]$serverName = $(throw "$serverName is required"),
	[string]$processName = $(throw "$processName is required"),
	[string]$userName = "IAPI01P1\administrator",
	[string]$password = "admin01ADF"
)
{
    Write-Host "Executing '$processName' on '$serverName'"

	$securePassword = ConvertTo-SecureString -string $password -AsPlainText -Force 
	$credentials = New-Object -typename System.Management.Automation.PSCredential -argumentlist $userName, $securePassword
    $process = get-wmiobject -query "SELECT * FROM Meta_Class WHERE __Class = 'Win32_Process'" -namespace "root\cimv2" -computername $serverName -credential $credentials
	return $process.Create($processName)
}

function Wait-For-Remote-Process(
    [string]$serverName = $(throw "$serverName is required"),
    [int]$processPID = $(throw "$processPID is required"),
	[string]$userName = "IAPI01P1\administrator",
	[string]$password = "admin01ADF"
)
{
    if ($processPID -eq 0)
    {
        throw "Can not wait for process: Incorrect process ID"
    }

    $numTries = 30

    do
    {
        $numTries--

        Write-Host "Waiting for remote process to exit (PID: $processPID)"

        tasklist /U "$userName" /P "$password" /s "$serverName" /FI "PID eq $processPID" | findstr "PID" | Out-Null

        if ($LastExitCode -eq 0)
        {
            Start-Sleep -s 2
        }
    }
    while(($LastExitCode -eq 0) -and ($numTries -ge 0))

    if ($LastExitCode -eq 0)
    {
        throw "Timeout while waiting for remote process to exit"
    }
}

function Start-And-Wait-For-Remote-Process(
    [string]$serverName = $(throw "$serverName is required"),
	[string]$processName = $(throw "$processName is required"),
	[string]$userName = "IAPI01P1\administrator",
	[string]$password = "admin01ADF"
)
{
    $process = Start-Remote-Process $serverName $processName $userName $password
    Wait-For-Remote-Process $serverName $process.ProcessId $userName $password
}