
if not exist %1 goto File1NotFound
if not exist %2 goto File2NotFound

copy %1 %2 /y & goto END

:File1NotFound
echo %1 not found.
goto END

:File2NotFound
copy %1 %2 /y
goto END

:END
echo Done.