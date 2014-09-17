-- table definitions

select xt.create_table('xd_site', 'xdruple');
select xt.add_column('xd_site','xd_site_id', 'serial', 'primary key', 'xdruple', 'xd_site table primary key.');
select xt.add_column('xd_site','xd_site_name', 'text', 'not null unique', 'xdruple', 'The Drupal site''s name');
select xt.add_column('xd_site','xd_site_url', 'text', 'not null unique', 'xdruple', 'The Drupal site''s URL');
select xt.add_column('xd_site','xd_site_notes', 'text', null, 'xdruple', 'The Drupal site''s notes');
-- TODO: Add more columns to define OAuth 2.0 Client settings needed to connect to the Drupal site.
-- This would allow for two way integration with the Drupal site so we could request the User object
-- and see their details from an xTuple client (Qt/Mobile). Currently, all we will see is the uid.

comment on table xdruple.xd_site is 'Defines Drupal sites that are integrated with xTuple';

GRANT ALL ON TABLE xdruple.xd_site_xd_site_id_seq TO admin;
GRANT ALL ON TABLE xdruple.xd_site_xd_site_id_seq TO xtrole;
