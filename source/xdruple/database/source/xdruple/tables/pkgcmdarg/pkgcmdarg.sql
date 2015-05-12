-- table definition

select xt.create_table('pkgcmdarg', 'xdruple', false, 'cmdarg');

ALTER TABLE xdruple.pkgcmdarg DISABLE TRIGGER ALL;
DROP TRIGGER IF EXISTS pkgcmdargaftertrigger ON xdruple.pkgcmdarg;
CREATE TRIGGER pkgcmdargaftertrigger AFTER INSERT OR DELETE OR UPDATE ON xdruple.pkgcmdarg FOR EACH ROW EXECUTE PROCEDURE _pkgcmdargaftertrigger();
DROP TRIGGER IF EXISTS pkgcmdargaltertrigger ON xdruple.pkgcmdarg;
CREATE TRIGGER pkgcmdargaltertrigger BEFORE INSERT OR DELETE OR UPDATE ON xdruple.pkgcmdarg FOR EACH ROW EXECUTE PROCEDURE _pkgcmdargaltertrigger();
DROP TRIGGER IF EXISTS pkgcmdargbeforetrigger ON xdruple.pkgcmdarg;
CREATE TRIGGER pkgcmdargbeforetrigger BEFORE INSERT OR DELETE OR UPDATE ON xdruple.pkgcmdarg FOR EACH ROW EXECUTE PROCEDURE _pkgcmdargbeforetrigger();
ALTER TABLE xdruple.pkgcmdarg DROP CONSTRAINT IF EXISTS pkgcmdarg_pkey CASCADE;
ALTER TABLE xdruple.pkgcmdarg ADD CONSTRAINT pkgcmdarg_pkey PRIMARY KEY(cmdarg_id);
