-- table definition

select xt.create_table('pkgpriv', 'xdruple', false, 'priv');

ALTER TABLE xdruple.pkgpriv DISABLE TRIGGER ALL;
DROP TRIGGER IF EXISTS pkgprivaftertrigger ON xdruple.pkgpriv;
CREATE TRIGGER pkgprivaftertrigger AFTER INSERT OR DELETE OR UPDATE ON xdruple.pkgpriv FOR EACH ROW EXECUTE PROCEDURE _pkgprivaftertrigger();
DROP TRIGGER IF EXISTS pkgprivaltertrigger ON xdruple.pkgpriv;
CREATE TRIGGER pkgprivaltertrigger BEFORE INSERT OR DELETE OR UPDATE ON xdruple.pkgpriv FOR EACH ROW EXECUTE PROCEDURE _pkgprivaltertrigger();
DROP TRIGGER IF EXISTS pkgprivbeforetrigger ON xdruple.pkgpriv;
CREATE TRIGGER pkgprivbeforetrigger BEFORE INSERT OR DELETE OR UPDATE ON xdruple.pkgpriv FOR EACH ROW EXECUTE PROCEDURE _pkgprivbeforetrigger();
ALTER TABLE xdruple.pkgpriv DROP CONSTRAINT IF EXISTS pkgpriv_pkey CASCADE;
ALTER TABLE xdruple.pkgpriv ADD CONSTRAINT pkgpriv_pkey PRIMARY KEY(priv_id);
