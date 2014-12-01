-- table definitions

select xt.create_table('xd_user_contact', 'xdruple');
select xt.add_column('xd_user_contact','xd_user_contact_id', 'serial', 'primary key', 'xdruple', 'xd_user_contact table primary key.');
select xt.add_column('xd_user_contact','xd_user_contact_site_id', 'integer', 'not null references xdruple.xd_site (xd_site_id) on delete cascade', 'xdruple', 'Drupal site id for this association.');
select xt.add_column('xd_user_contact','xd_user_contact_drupal_user_uuid', 'uuid', null, 'xdruple', 'Drupal user''s uuid.');
select xt.add_column('xd_user_contact','xd_user_contact_cntct_id', 'integer', 'not null', 'xdruple', 'xTuple Contact''s cntct_id');
select xt.add_column('xd_user_contact','xd_user_contact_create_new_cust', 'boolean', 'not null default false', 'xdruple', 'Create a new xTuple Customer from this Contact. Set to false if this is an existing Contact.');
select xt.add_column('xd_user_contact','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'xdruple');

-- Clean up old uid column constraints.
alter table xdruple.xd_user_contact drop constraint if exists xd_user_contact_obj_uuid_id;
alter table xdruple.xd_user_contact drop constraint if exists xd_user_contact_unique_uid_association;

select xt.add_constraint('xd_user_contact','xd_user_contact_unique_uuid_association', 'unique(xd_user_contact_site_id, xd_user_contact_drupal_user_uuid)', 'xdruple');
select xt.add_constraint('xd_user_contact','xd_user_contact_unique_cntct_association', 'unique(xd_user_contact_site_id, xd_user_contact_cntct_id)', 'xdruple');

comment on table xdruple.xd_user_contact is 'Defines a Drupal site''s users association to xTuple Contacts.';

-- create trigger
drop trigger if exists xd_user_contact_before on xdruple.xd_user_contact;
create trigger xd_user_contact_before before insert or update on xdruple.xd_user_contact for each row execute procedure xdruple.xd_create_b2x_user();

GRANT ALL ON TABLE xdruple.xd_user_contact_xd_user_contact_id_seq TO admin;
GRANT ALL ON TABLE xdruple.xd_user_contact_xd_user_contact_id_seq TO xtrole;
