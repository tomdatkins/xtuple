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

ParameterGroup.appendValue = function(group, params)
{
  if (group.isSelected())
  {
    if (group.type == ParameterGroup.ClassCode)
      params.classcode_id = group.id();
    else if (group.type == ParameterGroup.PlannerCode)
      params.plancode_id = group.id();
    else if (group.type == ParameterGroup.ProductCategory)
      params.prodcat_id = group.id();
    else if (group.type == ParameterGroup.ItemGroup)
      params.itemgrp_id = group.id();
    else if (group.type == ParameterGroup.CostCategory)
      params.costcat_id = group.id();
    else if (group.type == ParameterGroup.CustomerType)
      params.custtype_id = group.id();
    else if (group.type == ParameterGroup.CustomerGroup)
      params.custgrp_id = group.id();
    else if (group.type == ParameterGroup.CurrencyNotBase
             || group.type == ParameterGroup.Currency)
      params.curr_id = group.id();
    else if (group.type == ParameterGroup.WorkCenter)
      params.wrkcnt_id = group.id();
    else if (group.type == ParameterGroup.User
             || group.type == ParameterGroup.ActiveUser )
    {
      params.usr_id   = group.id();
      params.username = group.selected;
    }
    else
      return false;
  }
  else if (group.isPattern())
  {
    if (group.type == ParameterGroup.ClassCode)
      params.classcode_pattern = group.pattern;
    else if (group.type == ParameterGroup.PlannerCode)
      params.plancode_pattern = group.pattern;
    else if (group.type == ParameterGroup.ProductCategory)
      params.prodcat_pattern = group.pattern;
    else if (group.type == ParameterGroup.ItemGroup)
      params.itemgrp_pattern = group.pattern;
    else if (group.type == ParameterGroup.CostCategory)
      params.costcat_pattern = group.pattern;
    else if (group.type == ParameterGroup.CustomerType)
      params.custtype_pattern = group.pattern;
    else if (group.type == ParameterGroup.CustomerGroup)
      params.custgrp_pattern = group.pattern;
    else if (group.type == ParameterGroup.CurrencyNotBase
             || group.type == ParameterGroup.Currency)
      params.currConcat_pattern = group.pattern;
    else if (group.type == ParameterGroup.WorkCenter)
      params.wrkcnt_pattern = group.pattern;
    else if (group.type == ParameterGroup.User
             || group.type == ParameterGroup.ActiveUser)
      params.usr_pattern = group.pattern;
    else
      return false;
  }
  else // "all" has been selected. give the caller a clue about type
  {
    if (group.type == ParameterGroup.ClassCode)
      params.classcode = true;
    else if (group.type == ParameterGroup.PlannerCode)
      params.plancode = true;
    else if (group.type == ParameterGroup.ProductCategory)
      params.prodcat = true;
    else if (group.type == ParameterGroup.ItemGroup)
      params.itemgrp = true;
    else if (group.type == ParameterGroup.CostCategory)
      params.costcat = true;
    else if (group.type == ParameterGroup.CustomerType)
      params.custtype = true;
    else if (group.type == ParameterGroup.CustomerGroup)
      params.custgrp = true;
    else if (group.type == ParameterGroup.CurrencyNotBase
             || group.type == ParameterGroup.Currency)
      params.currConcat = true;
    else if (group.type == ParameterGroup.WorkCenter)
      params.wrkcnt = true;
    else if (group.type == ParameterGroup.User
             || group.type == ParameterGroup.ActiveUser)
      params.usr = true;
    else
      return false;
  }

  return true;
}
