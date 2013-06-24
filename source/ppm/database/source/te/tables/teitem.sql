-- table definition

select xt.create_table('teitem', 'te');

-- remove old triggers if any
drop trigger if exists teitemtrigger on te.teitem;
drop trigger if exists teitem_did_change on te.teitem;

select xt.add_column('teitem','teitem_id', 'serial', '', 'te');
select xt.add_column('teitem','teitem_tehead_id', 'integer', '', 'te');
select xt.add_column('teitem','teitem_linenumber', 'integer', 'not null', 'te');
select xt.add_column('teitem','teitem_type', 'character(1)', 'not null', 'te');
select xt.add_column('teitem','teitem_workdate', 'date', '', 'te');
select xt.add_column('teitem','teitem_cust_id', 'integer', '', 'te');
select xt.add_column('teitem','teitem_vend_id', 'integer', '', 'te');
select xt.add_column('teitem','teitem_po', 'text', '', 'te');
select xt.add_column('teitem','teitem_item_id', 'integer', 'not null', 'te');
select xt.add_column('teitem','teitem_qty', 'numeric', 'not null', 'te');
select xt.add_column('teitem','teitem_rate', 'numeric', 'not null', 'te');
select xt.add_column('teitem','teitem_total', 'numeric', 'not null', 'te');
select xt.add_column('teitem','teitem_prjtask_id', 'integer', 'not null', 'te');
select xt.add_column('teitem','teitem_lastupdated', 'timestamp without time zone', $$not null default ('now'::text)::timestamp(6) with time zone$$, 'te');
select xt.add_column('teitem','teitem_billable', 'boolean', '', 'te');
select xt.add_column('teitem','teitem_prepaid', 'boolean', '', 'te');
select xt.add_column('teitem','teitem_notes', 'text', '', 'te');
select xt.add_column('teitem','teitem_posted', 'boolean', 'default false', 'te');
select xt.add_column('teitem','teitem_curr_id', 'integer', 'not null default basecurrid()', 'te');
select xt.add_column('teitem','teitem_uom_id', 'integer', '', 'te');
select xt.add_column('teitem','teitem_invcitem_id', 'integer', '', 'te');
select xt.add_column('teitem','teitem_vodist_id', 'integer', '', 'te');
select xt.add_column('teitem','teitem_postedvalue', 'numeric', 'not null default 0', 'te');
select xt.add_column('teitem','teitem_empcost', 'numeric', '', 'te');
select xt.add_primary_key('teitem', 'teitem_id', 'te');
select xt.add_constraint('teitem', 'teitem_teitem_curr_id_fkey','foreign key (teitem_curr_id) references curr_symbol (curr_id) on delete set default', 'te');
select xt.add_constraint('teitem', 'teitem_teitem_invcitem_id_fkey','foreign key (teitem_invcitem_id) references invcitem (invcitem_id) on delete set null', 'te');
select xt.add_constraint('teitem', 'teitem_teitem_tehead_id_fkey','foreign key (teitem_tehead_id) references te.tehead (tehead_id)', 'te');
select xt.add_constraint('teitem', 'teitem_teitem_vodist_id_fkey','foreign key (teitem_vodist_id) references vodist (vodist_id) on delete set null', 'te');
select xt.add_constraint('teitem', 'teitem_teitem_prjtask_id_fkey','foreign key (teitem_prjtask_id) references prjtask (prjtask_id) ', 'te');

comment on table te.teitem is 'Time Expense Worksheet Item';

-- create triggers

create trigger teitemtrigger after insert or update on te.teitem for each row execute procedure te.triggerteitem();
create trigger teitem_did_change after insert on te.teitem for each row execute procedure xt.teitem_did_change();
