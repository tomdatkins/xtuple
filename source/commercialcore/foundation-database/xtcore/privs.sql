select createPriv('Purchase', 'MaintainPurchaseEmailProfiles', 'Can Maintain Purchase Email Profiles', NULL, 'xtcore'),
       createPriv('Purchase', 'MaintainPurchaseTypes',         'Can Maintain Purchase Types',          NULL, 'xtcore'),
       createPriv('System',   'ConfigureWF',                   'Can Configure Workflow',               NULL, 'xtcore');
       
select grantPriv('admin', 'MaintainPurchaseEmailProfiles'),
       grantPriv('admin', 'MaintainPurchaseTypes'),
       grantPriv('admin', 'ConfigureWF');
       
