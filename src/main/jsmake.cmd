@echo off
rem Workaround for https://github.com/mozilla/rhino/issues/10
set jsmakemodules=%~dp0
set jsmakemodules=%jsmakemodules:\=/%
java -cp "%~dp0js.jar" org.mozilla.javascript.tools.shell.Main -modules "file:///%jsmakemodules%" -modules "." "%~dp0bootstrap.js" "%~dp0jsmake.js" %*