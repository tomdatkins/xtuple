select createPriv('Purchase', 'MaintainPurchaseTypes',         'Can Maintain Purchase Types',          NULL, 'xtcore'),
       createPriv('System',   'ConfigureWF',                   'Can Configure Workflow',               NULL, 'xtcore');
       
select grantPriv('admin', 'MaintainPurchaseTypes'),
       grantPriv('admin', 'ConfigureWF');
       
