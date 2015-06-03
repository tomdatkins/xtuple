-- Add necessary privs.
select xt.add_priv('AccessxDrupleExtension', 'Can Access xDruple Extension', 'xDruple', 'xDruple', 'xdruple');
select xt.add_priv('MaintainxDrupleUserAssociations', 'Can Edit xDruple User Associations', 'xDruple', 'xDruple', 'xdruple');
select xt.add_priv('MaintainxDrupleSites', 'Can Edit xDruple Sites', 'xDruple', 'xDruple', 'xdruple');

-- Add xDruple Role.
select xt.add_role('XDRUPLE', 'xDruple Extension Role');

-- Grant the xDruple Role it's dependant Extensions.
select xt.grant_role_ext('XDRUPLE', 'crm');
select xt.grant_role_ext('XDRUPLE', 'sales');
select xt.grant_role_ext('XDRUPLE', 'billing');
select xt.grant_role_ext('XDRUPLE', 'inventory');
--select xt.grant_role_ext('XDRUPLE', 'manufacturing');

-- Grant xDruple Role it's Extension.
select xt.grant_role_ext('XDRUPLE', 'xdruple');

-- Grant xDruple Role it's privs.
select xt.grant_role_priv('XDRUPLE', 'xDruple', 'AccessxDrupleExtension');
select xt.grant_role_priv('XDRUPLE', 'CRM', 'MaintainPersonalContacts');
select xt.grant_role_priv('XDRUPLE', 'CRM', 'MaintainPersonalCRMAccounts');
select xt.grant_role_priv('XDRUPLE', 'CRM', 'MaintainPersonalIncidents');
select xt.grant_role_priv('XDRUPLE', 'CRM', 'MaintainPersonalOpportunities');
select xt.grant_role_priv('XDRUPLE', 'CRM', 'MaintainPersonalProjects');
select xt.grant_role_priv('XDRUPLE', 'CRM', 'MaintainPersonalToDoItems');
select xt.grant_role_priv('XDRUPLE', 'CRM', 'ViewPersonalContacts');
select xt.grant_role_priv('XDRUPLE', 'CRM', 'ViewPersonalCRMAccounts');
select xt.grant_role_priv('XDRUPLE', 'CRM', 'ViewPersonalIncidents');
select xt.grant_role_priv('XDRUPLE', 'CRM', 'ViewPersonalOpportunities');
select xt.grant_role_priv('XDRUPLE', 'CRM', 'ViewPersonalProjects');
select xt.grant_role_priv('XDRUPLE', 'CRM', 'ViewPersonalToDoItems');
select xt.grant_role_priv('XDRUPLE', 'Inventory', 'ViewWarehouses');
select xt.grant_role_priv('XDRUPLE', 'Inventory', 'ViewCharacteristics');
select xt.grant_role_priv('XDRUPLE', 'Sales', 'ViewSalesOrderTotals');
