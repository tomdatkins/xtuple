-- table definition

select xt.create_table('pkgcmd', 'xdruple', false, 'cmd');

ALTER TABLE xdruple.pkgcmd DISABLE TRIGGER ALL;
DROP TRIGGER IF EXISTS pkgcmdaftertrigger ON xdruple.pkgcmd;
CREATE TRIGGER pkgcmdaftertrigger AFTER INSERT OR DELETE OR UPDATE ON xdruple.pkgcmd FOR EACH ROW EXECUTE PROCEDURE _pkgcmdaftertrigger();
DROP TRIGGER IF EXISTS pkgcmdaltertrigger ON xdruple.pkgcmd;
CREATE TRIGGER pkgcmdaltertrigger BEFORE INSERT OR DELETE OR UPDATE ON xdruple.pkgcmd FOR EACH ROW EXECUTE PROCEDURE _pkgcmdaltertrigger();
DROP TRIGGER IF EXISTS pkgcmdbeforetrigger ON xdruple.pkgcmd;
CREATE TRIGGER pkgcmdbeforetrigger BEFORE INSERT OR DELETE OR UPDATE ON xdruple.pkgcmd FOR EACH ROW EXECUTE PROCEDURE _pkgcmdbeforetrigger();
ALTER TABLE xdruple.pkgcmd DROP CONSTRAINT IF EXISTS pkgcmd_pkey CASCADE;
ALTER TABLE xdruple.pkgcmd ADD CONSTRAINT pkgcmd_pkey PRIMARY KEY(cmd_id);
