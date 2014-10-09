-- table definition

select xt.create_table('pkgmetasql', 'xdruple', false, 'metasql');

ALTER TABLE xdruple.pkgmetasql DISABLE TRIGGER ALL;
DROP TRIGGER IF EXISTS pkgmetasqlaftertrigger ON xdruple.pkgmetasql;
CREATE TRIGGER pkgmetasqlaftertrigger AFTER INSERT OR DELETE OR UPDATE ON xdruple.pkgmetasql FOR EACH ROW EXECUTE PROCEDURE _pkgmetasqlaftertrigger();
DROP TRIGGER IF EXISTS pkgmetasqlaltertrigger ON xdruple.pkgmetasql;
CREATE TRIGGER pkgmetasqlaltertrigger BEFORE INSERT OR DELETE OR UPDATE ON xdruple.pkgmetasql FOR EACH ROW EXECUTE PROCEDURE _pkgmetasqlaltertrigger();
DROP TRIGGER IF EXISTS pkgmetasqlbeforetrigger ON xdruple.pkgmetasql;
CREATE TRIGGER pkgmetasqlbeforetrigger BEFORE INSERT OR DELETE OR UPDATE ON xdruple.pkgmetasql FOR EACH ROW EXECUTE PROCEDURE _pkgmetasqlbeforetrigger();
ALTER TABLE xdruple.pkgmetasql DROP CONSTRAINT IF EXISTS pkgmetasql_pkey CASCADE;
ALTER TABLE xdruple.pkgmetasql ADD CONSTRAINT pkgmetasql_pkey PRIMARY KEY(metasql_id);
