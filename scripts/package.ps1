param(
  [string]$OutputRoot = "dist",
  [string]$PackageName = "PanicTab"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$manifestPath = Join-Path $repoRoot "manifest.json"

if (-not (Test-Path -LiteralPath $manifestPath)) {
  throw "Cannot find manifest.json at $manifestPath"
}

$manifest = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
$version = $manifest.version

if ([string]::IsNullOrWhiteSpace($version)) {
  throw "manifest.json does not contain a version field."
}

$outputRootPath = Join-Path $repoRoot $OutputRoot
$packageDir = Join-Path $outputRootPath $PackageName
$zipPath = Join-Path $outputRootPath "$PackageName-v$version.zip"

New-Item -ItemType Directory -Path $outputRootPath -Force | Out-Null

if (Test-Path -LiteralPath $packageDir) {
  Remove-Item -LiteralPath $packageDir -Recurse -Force
}

if (Test-Path -LiteralPath $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

New-Item -ItemType Directory -Path $packageDir -Force | Out-Null

$rootFiles = @(
  "manifest.json"
)

$rootDirectories = @(
  "src",
  "_locales"
)

foreach ($file in $rootFiles) {
  $source = Join-Path $repoRoot $file
  if (-not (Test-Path -LiteralPath $source)) {
    throw "Required file is missing: $file"
  }

  Copy-Item -LiteralPath $source -Destination $packageDir -Force
}

foreach ($directory in $rootDirectories) {
  $source = Join-Path $repoRoot $directory
  if (-not (Test-Path -LiteralPath $source)) {
    throw "Required directory is missing: $directory"
  }

  Copy-Item -LiteralPath $source -Destination $packageDir -Recurse -Force
}

$assetsSource = Join-Path $repoRoot "assets"
$assetsTarget = Join-Path $packageDir "assets"

if (-not (Test-Path -LiteralPath $assetsSource)) {
  throw "Required directory is missing: assets"
}

New-Item -ItemType Directory -Path $assetsTarget -Force | Out-Null

Get-ChildItem -LiteralPath $assetsSource -Recurse -File |
  Where-Object {
    $_.FullName -notlike "*\assets\store-promo\*" -and
    $_.Name -notlike "*-source.*"
  } |
  ForEach-Object {
    $relativePath = $_.FullName.Substring($assetsSource.Length).TrimStart("\", "/")
    $targetPath = Join-Path $assetsTarget $relativePath
    $targetDirectory = Split-Path -Parent $targetPath

    New-Item -ItemType Directory -Path $targetDirectory -Force | Out-Null
    Copy-Item -LiteralPath $_.FullName -Destination $targetPath -Force
  }

Compress-Archive -Path (Join-Path $packageDir "*") -DestinationPath $zipPath -Force

Write-Host "Package directory: $packageDir"
Write-Host "Package archive:   $zipPath"
