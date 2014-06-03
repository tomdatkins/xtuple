/*
  This file is part of the xwd Package for xTuple ERP,
  and is Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple.  It
  is licensed to you under the xTuple End-User License Agreement ("the
  EULA"), the full text of which is available at www.xtuple.com/EULA.
  While the EULA gives you access to source code and encourages your
  involvement in the development process, this Package is not free
  software.  By using this software, you agree to be bound by the
  terms of the EULA.
*/

var xwdErrors = new Object;

xwdErrors.convertCatalog = new Object;
xwdErrors.convertCatalog[-1] = qsTr("Catalog Item not found");
xwdErrors.convertCatalog[-2] = qsTr("Catalog Provider not configured");
xwdErrors.convertCatalog[-3] = qsTr("Catalog Item already converted");
xwdErrors.convertCatalog[-4] = qsTr("Item does not exist");
xwdErrors.convertCatalog[-5] = qsTr("Catalog Item Source already converted");

xwdErrors.issueOrder = new Object;
xwdErrors.issueOrder[0] = qsTr("No Lines were Issued to Shipping");
