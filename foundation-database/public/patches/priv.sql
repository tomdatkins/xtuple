select createPriv('System', 'ConfigureWF', 'Can Configure Workflow');
select grantPriv('admin',    'ConfigureWF'),
       grantPriv('mfgadmin', 'ConfigureWF');
