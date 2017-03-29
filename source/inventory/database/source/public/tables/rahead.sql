-- add uuid column here because there are views that need this
select xt.add_column('rahead','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('rahead', 'xt.obj');
select xt.add_constraint('rahead', 'rahead_obj_uuid_id','unique(obj_uuid)', 'public');

-- auto workflow generation trigger
/*
drop trigger if exists rawf_after_insert on rahead;
DO $$ BEGIN RAISE DEBUG $m$ skipping
  create trigger rawf_after_insert after insert on rahead for each row
    execute procedure xt.createwf_after_insert();
  $m$;
END; $$;
*/;

