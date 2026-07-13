$ErrorActionPreference = 'Continue'

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $root

$logPath = Join-Path $root 'vercel-deploy.log'
$vercel = Join-Path $root '.npm-cache\_npx\67eb4586ca667318\node_modules\.bin\vercel.cmd'

function Write-Log($message) {
  $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
  Add-Content -Path $logPath -Value "[$timestamp] $message"
}

function Read-DotEnv($path) {
  $values = @{}
  if (-not (Test-Path $path)) {
    return $values
  }

  foreach ($line in Get-Content $path) {
    if ($line -match '^\s*#') { continue }
    if ($line -match '^\s*$') { continue }
    if ($line -match '^\s*([^=]+)=(.*)$') {
      $key = $matches[1].Trim()
      $value = $matches[2].Trim()
      $value = $value -replace '^"', ''
      $value = $value -replace '"$', ''
      $values[$key] = $value
    }
  }

  return $values
}

function Run-Vercel($arguments) {
  Write-Log "RUN vercel $arguments"
  cmd.exe /c "set XDG_CONFIG_HOME=$root\.vercel-cli-data&& set XDG_DATA_HOME=$root\.vercel-cli-data&& set LOCALAPPDATA=$root\.vercel-cli-local&& set APPDATA=$root\.vercel-cli-data&& set VERCEL_TELEMETRY_DISABLED=1&& `"$vercel`" $arguments" >> $logPath 2>&1
  Write-Log "EXIT $LASTEXITCODE"
}

function Set-VercelEnv($name, $value) {
  if (-not $value) {
    Write-Log "SKIP ${name}: missing value"
    return
  }

  $tmp = Join-Path $root ".vercel-$name.txt"
  Set-Content -Path $tmp -Value $value -NoNewline

  Run-Vercel "env rm $name production --yes"
  Run-Vercel "env add $name production < `"$tmp`""

  Remove-Item -LiteralPath $tmp -Force
}

if (Test-Path $logPath) {
  Remove-Item -LiteralPath $logPath -Force
}

Write-Log 'Starting StockSMS Vercel deploy'

if (-not (Test-Path $vercel)) {
  Write-Log 'ERROR: Vercel CLI not found. Run vercel login first.'
  exit 1
}

Run-Vercel 'whoami'
Run-Vercel 'link --yes --project stock-sms-web-app-5152'
Run-Vercel 'deploy --prod --yes'

Write-Log 'Finished StockSMS Vercel deploy'
