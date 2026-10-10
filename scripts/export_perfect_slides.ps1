$pptApp = New-Object -ComObject PowerPoint.Application
$pptApp.Visible = [Microsoft.Office.Core.MsoTriState]::msoTrue

$pptPath = "C:\Users\anura\Downloads\sih2026\LegacyCoderzSIH2026.pptx"
$pdfPath = "C:\Users\anura\Downloads\sih2026\LegacyCoderzSIH2026.pdf"
$outFolder = "C:\Users\anura\Downloads\SIH26246\scripts\perfect_inspect"

if (-not (Test-Path $outFolder)) {
    New-Item -ItemType Directory -Path $outFolder | Out-Null
}

$presentation = $pptApp.Presentations.Open($pptPath, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)

$slideIndex = 1
foreach ($slide in $presentation.Slides) {
    $slideImgPath = Join-Path $outFolder "slide_$slideIndex.png"
    $slide.Export($slideImgPath, "PNG", 1920, 1080)
    Write-Host "Exported Slide $slideIndex to $slideImgPath"
    $slideIndex++
}

# Export to PDF (ppSaveAsPDF = 32)
$presentation.SaveAs($pdfPath, 32)
Write-Host "Saved PDF to $pdfPath"

$presentation.Close()
$pptApp.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($pptApp) | Out-Null
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()

Write-Host "All slides exported and PDF generated successfully!"
