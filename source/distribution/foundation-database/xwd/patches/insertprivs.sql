do $$
begin
if not exists(select 1 from xwd.pkgpriv where priv_name='ViewMarginCommissions') then
  ALTER TABLE xwd.pkgpriv DISABLE TRIGGER ALL;
  INSERT INTO xwd.pkgpriv (priv_module, priv_name, priv_descrip) VALUES ('Sales', 'ViewMarginCommissions', 'Allowed to view Gross Margin Commissions');
  ALTER TABLE xwd.pkgpriv ENABLE TRIGGER ALL;
end if;
end$$;
