-- add necessary privs

select xt.add_priv('AccessxDrupleExtension', 'Can Access xDruple Extension', 'xDruple', 'xDruple');

-- Add xDruple Role.
select xt.add_role('XDRUPLE', 'xDruple Extension Role');

-- Grant xDruple Role it's Extension.
select xt.grant_role_ext('XDRUPLE', 'xdruple');

-- Grant the ADMIN ROle this Extension.
select xt.grant_role_ext('ADMIN', 'xdruple');

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
-- TODO: Figure out a way to not give this to xDruple Users, but still be able to create Sales Orders.
select xt.grant_role_priv('XDRUPLE', 'Sales', 'MaintainSalesOrders');
select xt.grant_role_priv('XDRUPLE', 'Sales', 'ViewSalesOrders');
