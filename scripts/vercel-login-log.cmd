@echo off
cd /d "%~dp0\.."
set "npm_config_cache=%CD%\.npm-cache"
set "XDG_CONFIG_HOME=%CD%\.vercel-cli-data"
set "XDG_DATA_HOME=%CD%\.vercel-cli-data"
set "LOCALAPPDATA=%CD%\.vercel-cli-local"
set "APPDATA=%CD%\.vercel-cli-data"
npx.cmd -y vercel@latest login > vercel-login.log 2>&1
