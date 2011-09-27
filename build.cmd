@echo off
rem Workaround for https://github.com/mozilla/rhino/issues/10
set jsmakemodules=%~dp0
set jsmakemodules=%jsmakemodules:\=/%
java -cp lib\main\rhino-1.7r3\js.jar org.mozilla.javascript.tools.shell.Main -modules "file:///%jsmakemodules%" -modules "." build.js %*
