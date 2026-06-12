$files = Get-ChildItem -Path "src" -Recurse -Include "*.ts","*.tsx"
foreach ($f in $files) {
    $c = Get-Content $f.FullName -Raw
    if ($c -match "useDashboardStore") {
        $c = $c.Replace("useDashboardStore", "dashboardStore")
        Set-Content -Path $f.FullName -Value $c -NoNewline
        Write-Host "Updated: $($f.Name)"
    }
}
Write-Host "Done."
