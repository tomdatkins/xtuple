-- Operation Type table definition

select xt.create_table('opntype', 'xtmfg');

select xt.add_column('opntype','opntype_id', 'serial', null, 'xtmfg');
select xt.add_column('opntype','opntype_code', 'text', null, 'xtmfg');
select xt.add_column('opntype','opntype_descrip', 'text', null, 'xtmfg');
select xt.add_column('opntype','opntype_sys', 'boolean', 'DEFAULT FALSE', 'xtmfg');

select xt.add_primary_key('opntype', 'opntype_id', 'xtmfg');
select xt.add_constraint('opntype', 'opntype_code_unq', 'unique (opntype_code)', 'xtmfg');

comment on table xtmfg.opntype is 'Work Order Operation Type';

-- Fix sequence permission issue
GRANT ALL ON TABLE xtmfg.opntype_opntype_id_seq TO xtrole;

-- Amend existing Std. Op and WO Operation tables

select xt.add_column('stdopn','stdopn_opntype_id', 'integer', null, 'xtmfg');
select xt.add_column('wooper','wooper_opntype_id', 'integer', null, 'xtmfg');


-- Insert System Data - if needed
DO $$
BEGIN

  IF ((SELECT COUNT(*) FROM xtmfg.opntype) = 0) THEN
    INSERT INTO xtmfg.opntype VALUES (1,'INSPECT', 'Inspection / Test', true);  
    INSERT INTO xtmfg.opntype VALUES (2,'REWORK', 'Rework Operation', true);
    PERFORM setval('xtmfg.opntype_opntype_id_seq', 2, true);
  END IF;

END$$;


