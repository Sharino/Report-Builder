function Transform-ConfigXml(
    [string]$source = $(throw "$source is required"),
    [string]$transform = $(throw "$transform is required"),
    [string]$destination = $(throw "$destination is required")
)
{
    Add-Type -Path ".\libraries\dlls\Microsoft.Web.XmlTransform.dll"

    $document = New-Object Microsoft.Web.XmlTransform.XmlTransformableDocument
    $document.PreserveWhiteSpace = $true
    $document.Load($source)

    $xmlTransformation = New-Object Microsoft.Web.XmlTransform.XmlTransformation($transform)

    if ($xmlTransformation.Apply($document))
    {
        $document.Save($destination)
        Write-Output "Output file: $destination"
    }
    else
    {
        throw "Transformation terminated with status False"
    }
}