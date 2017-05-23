/* This file is part of the xTuple Quality extension package for xTuple ERP, and is
 * Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */
var xtquality;
if (!xtquality)
  xtquality = new Object;

xtquality.errorCheck = function (q)
{
  if (q.lastError().type != QSqlError.NoError)
  {
    toolbox.messageBox("critical", mywindow,
                        qsTr("Database Error"), q.lastError().text);
    return false;
  }

  return true;
}

xtquality.revisionStatus = {"P": qsTr("Pending"),
                            "A": qsTr("Active"),
                            "I": qsTr("Inactive")
                           };
xtquality.status = { "O": qsTr("Open"),
                     "P": qsTr("Pass"),
                     "F": qsTr("Fail"),
                     "C": qsTr("Cancelled")
                   };
xtquality.disposition = { "I":  qsTr("In-Process"),
                          "OK": qsTr("Released"),
                          "Q":  qsTr("Quarantine"),
                          "R":  qsTr("Rework"),
                          "S":  qsTr("Scrap")
                         };
xtquality.testtype = { "T": qsTr("Text Comment"),
                       "N": qsTr("Numeric Value"),
                       "B": qsTr("Pass/Fail")
                     };

xtquality.getStatus = function (inStatus)
{
  return xtquality.status[inStatus];
}

xtquality.getDisposition = function (inDisp)
{
  return xtquality.disposition[inDisp];
}

xtquality.extraParams = function (params)
{
  if (!params)
    var params = {};

  params.inactive = xtquality.revisionStatus["I"];
  params.active = xtquality.revisionStatus["A"];
  params.pending = xtquality.revisionStatus["P"];

  params.open = xtquality.status["O"];
  params.pass = xtquality.status["P"];
  params.fail = xtquality.status["F"];
  params.cancelled = xtquality.status["C"];

  params.inprocess = xtquality.disposition["I"];
  params.released = xtquality.disposition["OK"];
  params.quarantine = xtquality.disposition["Q"];
  params.rework = xtquality.disposition["R"];
  params.scrap = xtquality.disposition["S"];

  return params;
}

xtquality.getUuid = function (id)
{
  var _sql = "SELECT obj_uuid FROM xt.qthead WHERE qthead_id = <? value('id') ?>;";
  var data = toolbox.executeQuery(_sql, {id: id});
  if (data.first() && xtquality.errorCheck(data))
    return data.value("obj_uuid");
}

