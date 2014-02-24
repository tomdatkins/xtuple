-- table definitions

select xt.create_table('xd_user_contact', 'xdruple');
select xt.add_column('xd_user_contact','xd_user_contact_id', 'serial', 'primary key', 'xdruple', 'xd_user_contact table primary key.');
select xt.add_column('xd_user_contact','xd_user_contact_site_id', 'integer', 'not null references xdruple.xd_site (xd_site_id) on delete cascade', 'xdruple', 'Drupal site id for this association.');
select xt.add_column('xd_user_contact','xd_user_contact_uid', 'integer', 'not null', 'xdruple', 'Drupal user''s uid.');
select xt.add_column('xd_user_contact','xd_user_contact_cntct_id', 'integer', 'not null', 'xdruple', 'xTuple Contact''s cntct_id');

select xt.add_constraint('xd_user_contact','xd_user_contact_unique_uid_association', 'unique(xd_user_contact_site_id, xd_user_contact_uid)', 'xdruple');
select xt.add_constraint('xd_user_contact','xd_user_contact_unique_cntct_association', 'unique(xd_user_contact_site_id, xd_user_contact_cntct_id)', 'xdruple');

comment on table xdruple.xd_user_contact is 'Defines a Drupal site''s users association to xTuple Contacts.';
