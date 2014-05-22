/*
  This file is part of the xtmfg Package for xTuple ERP,
  and is Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.  It
  is licensed to you under the xTuple End-User License Agreement ("the
  EULA"), the full text of which is available at www.xtuple.com/EULA.
  While the EULA gives you access to source code and encourages your
  involvement in the development process, this Package is not free
  software.  By using this software, you agree to be bound by the
  terms of the EULA.
*/

debugger;

var _mpsTimeFence        = mywindow.findChild("_mpsTimeFence");
var _mpsTimeFenceDaysLit = mywindow.findChild("_mpsTimeFenceDaysLit");
var _mpsTimeFenceLit     = mywindow.findChild("_mpsTimeFenceLit");
var _planningType        = mywindow.findChild("_planningType");

_mpsTimeFence.show();
_mpsTimeFenceDaysLit.show();
_mpsTimeFenceLit.show();

_planningType.append(2, "MPS", "S");
