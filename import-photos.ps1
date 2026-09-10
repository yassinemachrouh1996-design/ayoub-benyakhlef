# يستورد الصور تلقائيا إلى موقع الأستاذ
# الاستعمال: ضع كل صورك في مجلد واحد ثم شغل هذا السكريبت
param(
  [string]$From = ""
)

$ImagesDir = "C:\Users\HP\Desktop\teacher-website\images"

if ([string]::IsNullOrWhiteSpace($From)) {
  Add-Type -AssemblyName System.Windows.Forms
  $dlg = New-Object System.Windows.Forms.FolderBrowserDialog
  $dlg.Description = "اختار المجلد اللي فيه التصاور ديالك"
  if ($dlg.ShowDialog() -ne "OK") { Write-Host "تم الإلغاء."; exit }
  $From = $dlg.SelectedPath
}

if (-not (Test-Path -LiteralPath $From)) { Write-Host "المجلد غير موجود: $From"; exit 1 }
if (-not (Test-Path -LiteralPath $ImagesDir)) { New-Item -ItemType Directory -Path $ImagesDir -Force | Out-Null }

$files = Get-ChildItem -Path $From -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Extension -match '^\.(jpg|jpeg|png|webp)$' } |
  Sort-Object LastWriteTime

if ($files.Count -eq 0) { Write-Host "ما لقيت حتى تصويرة فـ هذا المجلد."; exit 1 }

$i = 1
foreach ($f in $files) {
  if ($i -gt 12) { break }
  $dest = Join-Path $ImagesDir ("photo{0}.jpg" -f $i)
  Copy-Item -LiteralPath $f.FullName -Destination $dest -Force
  Write-Host ("photo{0}.jpg <= {1}" -f $i, $f.Name)
  $i++
}

# الشعار: إذا كانت هناك صورة 13 اعتبرها شعار الوزارة
if ($files.Count -ge 13) {
  Copy-Item -LiteralPath $files[12].FullName -Destination (Join-Path $ImagesDir "logo-ministere.jpg") -Force
  Write-Host ("logo-ministere.jpg <= {0}" -f $files[12].Name)
} else {
  Write-Host "ملاحظة: ضع شعار الوزارة كصورة 13 أو انسخه يدويا باسم logo-ministere.jpg"
}

Write-Host ""
Write-Host ("تم استيراد {0} صور بنجاح! حل ملف index.html وشوف الموقع." -f ($i - 1))
