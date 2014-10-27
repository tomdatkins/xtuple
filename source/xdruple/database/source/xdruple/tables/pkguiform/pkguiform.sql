-- table definition

select xt.create_table('pkguiform', 'xdruple', false, 'uiform');

ALTER TABLE xdruple.pkguiform DISABLE TRIGGER ALL;
DROP TRIGGER IF EXISTS pkguiformaftertrigger ON xdruple.pkguiform;
CREATE TRIGGER pkguiformaftertrigger AFTER INSERT OR DELETE OR UPDATE ON xdruple.pkguiform FOR EACH ROW EXECUTE PROCEDURE _pkguiformaftertrigger();
DROP TRIGGER IF EXISTS pkguiformaltertrigger ON xdruple.pkguiform;
CREATE TRIGGER pkguiformaltertrigger BEFORE INSERT OR DELETE OR UPDATE ON xdruple.pkguiform FOR EACH ROW EXECUTE PROCEDURE _pkguiformaltertrigger();
DROP TRIGGER IF EXISTS pkguiformbeforetrigger ON xdruple.pkguiform;
CREATE TRIGGER pkguiformbeforetrigger BEFORE INSERT OR DELETE OR UPDATE ON xdruple.pkguiform FOR EACH ROW EXECUTE PROCEDURE _pkguiformbeforetrigger();
ALTER TABLE xdruple.pkguiform DROP CONSTRAINT IF EXISTS pkguiform_pkey CASCADE;
ALTER TABLE xdruple.pkguiform ADD CONSTRAINT pkguiform_pkey PRIMARY KEY(uiform_id);
