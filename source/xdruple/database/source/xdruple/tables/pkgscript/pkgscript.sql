-- table definition

select xt.create_table('pkgscript', 'xdruple', false, 'script');

ALTER TABLE xdruple.pkgscript DISABLE TRIGGER ALL;
DROP TRIGGER IF EXISTS pkgscriptaftertrigger ON xdruple.pkgscript;
CREATE TRIGGER pkgscriptaftertrigger AFTER INSERT OR DELETE OR UPDATE ON xdruple.pkgscript FOR EACH ROW EXECUTE PROCEDURE _pkgscriptaftertrigger();
DROP TRIGGER IF EXISTS pkgscriptaltertrigger ON xdruple.pkgscript;
CREATE TRIGGER pkgscriptaltertrigger BEFORE INSERT OR DELETE OR UPDATE ON xdruple.pkgscript FOR EACH ROW EXECUTE PROCEDURE _pkgscriptaltertrigger();
DROP TRIGGER IF EXISTS pkgscriptbeforetrigger ON xdruple.pkgscript;
CREATE TRIGGER pkgscriptbeforetrigger BEFORE INSERT OR DELETE OR UPDATE ON xdruple.pkgscript FOR EACH ROW EXECUTE PROCEDURE _pkgscriptbeforetrigger();
ALTER TABLE xdruple.pkgscript DROP CONSTRAINT IF EXISTS pkgscript_pkey CASCADE;
ALTER TABLE xdruple.pkgscript ADD CONSTRAINT pkgscript_pkey PRIMARY KEY(script_id);
