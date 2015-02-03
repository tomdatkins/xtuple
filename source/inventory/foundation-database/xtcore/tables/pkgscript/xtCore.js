/* This file is part of the xtcore Package for xTuple ERP, and is
 * Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */

var DEBUG = false;

var xtCore;
if (!xtCore)
  xtCore = new Object;

xtCore.errorCheck = function (q)
{
  if (q.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                         q.lastError().text);
    return false;
  }

  return true;
}

/** @brief Try to find the full path to an executable program.

   xtCore.findExecutable() searches for the named command
   with the assumption that the program is part
   of the xTuple ERP installation. It takes into account platform
   dependencies in the actual filename, such as the '.exe' suffix
   on Windows and '.app' on Mac OS X. It starts in the current
   directory and marches up toward the filesystem root until the
   command is found. If optdirnames is passed, then it looks in each
   of those optional subdirectories as it walks up the directory
   hierarchy.

   For example, with the following filesystem hierarchy:
   @code
     .../xTuple
            + xtuple
            |      + xtuple.exe
            |      + agent.exe
            |      + libraries
            |      + support files
            + utilities
                   + csvimp.exe
                   + updater.exe
                   + libraries
                   + support files

     var okAgent= xtCore.findExecutable('agent'); // okAgent == '.../xTuple/xtuple/agent.exe'
     var badUpd = xtCore.findExecutable('updater'); // badUpd == 'updater'
     var okUpd  = xtCore.findExecutable('updater', 'utilities'); // okUpd == '.../xTuple/utilities/updater.exe'
   @endcode
   
   If the '.exe' suffix in the examples above is changed to '.app'
   and run on a Mac:
   @code
     var okAgent= xtCore.findExecutable('agent'); // okAgent == '.../xTuple/xtuple/agent.app/Contents/MacOS/agent'
     var badUpd = xtCore.findExecutable('updater'); // badUpd == 'updater'
     var okUpd  = xtCore.findExecutable('updater', 'utilities'); // okUpd == '.../xTuple/utilities/updater.app/Contents/MacOS/updater'
   @endcode

   @param cmdname The simple name of the program to find (e.g. xtuple)
   @param optdirnames Optional argument listing 1 or more subdirectories
                      to look in
   @return The full path to the executable if it is found, or the passed-in
           cmdname if it is not
 */
xtCore.findExecutable = function(cmdname, optdirnames)
{
  if (DEBUG) print("findExecutable(" + cmdname + ", " + optdirnames + ") entered");
  var exename = cmdname;
  var ws = "getWindowSystem" in mainwindow ? mainwindow.getWindowSystem() : 0;
  switch (ws)
  {
    case 0: break; // in case getwindowsystem doesn't exist
    case mainwindow.WIN: exename += ".exe"; break;
    case mainwindow.MAC: exename += ".app"; break;
  }
  
  var fi         = new QFileInfo(exename);
  var dir        = fi.absoluteDir();
  var fullpath   = fi.canonicalFilePath();
  var found      = false;

  do
  {
    fullpath = dir.absoluteFilePath(exename);
    if (DEBUG) print("looking at " + fullpath + ": " + QFile.exists(fullpath));
    if (QFile.exists(fullpath))
    {
      if (DEBUG) print(fullpath + " exists!");
      break;
    }
    else if (optdirnames instanceof Array)
    {
      for (var i = 0; i < optdirnames.length && ! found; i++)
      {
        var tryme = dir.absolutePath() + QDir.separator() + optdirnames[i]
                    + QDir.separator() + exename;
        if (DEBUG) print("and at " + tryme);
        if (QFile.exists(tryme))
        {
          fullpath = tryme;
          break;
        }
      }
    }
    else if (optdirnames)
    {
      var tryme = dir.absolutePath() + QDir.separator() + optdirnames
                       + QDir.separator() + exename;
      if (DEBUG) print("and at " + tryme);
      if (QFile.exists(tryme))
        fullpath = tryme;
    }
    else
      if (DEBUG) print("!exists && " + optdirnames + "isn't an Array && optdirnames is undefined?");
  } while (! QFile.exists(fullpath) && dir.cdUp());

  if (DEBUG)
    print('after while loop: ' + fullpath
        + " (" + typeof QFile.exists(fullpath) + "/" + QFile.exists(fullpath) + ")");

  if (ws && mainwindow.MAC == ws &&
      QFile.exists(dir.absoluteFilePath(fullpath + "/Contents/MacOS/" + cmdname)))
    fullpath = dir.absoluteFilePath(fullpath + "/Contents/MacOS/" + cmdname);
  else if (! QFile.exists(fullpath))
    fullpath = cmdname;

  if (DEBUG) print('findExecutable() returning ' + fullpath);
  return fullpath;
}

