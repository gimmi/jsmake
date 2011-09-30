@echo off
rem Workaround for https://github.com/mozilla/rhino/issues/10
set jsmakemodules=%~dp0
set jsmakemodules=%jsmakemodules:\=/%
rem bootstrap.js is specified 2 times because of this: https://github.com/mozilla/rhino/issues/11
rem TODO replace whitespace in jsmakemodules with "%20" (is a challenge in bat files)
java -cp "%~dp0js.jar" org.mozilla.javascript.tools.shell.Main -modules "file:///%jsmakemodules%" -modules "." -main "file:///%jsmakemodules%/bootstrap.js" "file:///%jsmakemodules%/bootstrap.js" %*