-- table definition

select xt.create_table('pkgreport', 'xdruple', false, 'report');

ALTER TABLE xdruple.pkgreport DISABLE TRIGGER ALL;
DROP TRIGGER IF EXISTS pkgreportaftertrigger ON xdruple.pkgreport;
CREATE TRIGGER pkgreportaftertrigger AFTER INSERT OR DELETE OR UPDATE ON xdruple.pkgreport FOR EACH ROW EXECUTE PROCEDURE _pkgreportaftertrigger();
DROP TRIGGER IF EXISTS pkgreportaltertrigger ON xdruple.pkgreport;
CREATE TRIGGER pkgreportaltertrigger BEFORE INSERT OR DELETE OR UPDATE ON xdruple.pkgreport FOR EACH ROW EXECUTE PROCEDURE _pkgreportaltertrigger();
DROP TRIGGER IF EXISTS pkgreportbeforetrigger ON xdruple.pkgreport;
CREATE TRIGGER pkgreportbeforetrigger BEFORE INSERT OR DELETE OR UPDATE ON xdruple.pkgreport FOR EACH ROW EXECUTE PROCEDURE _pkgreportbeforetrigger();
ALTER TABLE xdruple.pkgreport DROP CONSTRAINT IF EXISTS pkgreport_pkey CASCADE;
ALTER TABLE xdruple.pkgreport ADD CONSTRAINT pkgreport_pkey PRIMARY KEY(report_id);
