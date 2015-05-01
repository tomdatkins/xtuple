insert into xtcore.pkgpriv (priv_name, priv_module, priv_descrip)
select 'MaintainPurchaseEmailProfiles', 'Purchase', 'Can Maintain Purchase Email Profiles'
 where not exists (select 1 from priv where priv_name = 'MaintainPurchaseEmailProfiles');

insert into xtcore.pkgpriv (priv_name, priv_module, priv_descrip)
select 'MaintainPurchaseTypes', 'Purchase', 'Can Maintain Purchase Types'
 where not exists (select 1 from priv where priv_name = 'MaintainPurchaseTypes');
