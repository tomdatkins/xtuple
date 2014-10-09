-- table definition

select xt.create_table('pkgimage', 'xdruple', false, 'image');

ALTER TABLE xdruple.pkgimage DISABLE TRIGGER ALL;
DROP TRIGGER IF EXISTS pkgimageaftertrigger ON xdruple.pkgimage;
CREATE TRIGGER pkgimageaftertrigger AFTER INSERT OR DELETE OR UPDATE ON xdruple.pkgimage FOR EACH ROW EXECUTE PROCEDURE _pkgimageaftertrigger();
DROP TRIGGER IF EXISTS pkgimagealtertrigger ON xdruple.pkgimage;
CREATE TRIGGER pkgimagealtertrigger BEFORE INSERT OR DELETE OR UPDATE ON xdruple.pkgimage FOR EACH ROW EXECUTE PROCEDURE _pkgimagealtertrigger();
DROP TRIGGER IF EXISTS pkgimagebeforetrigger ON xdruple.pkgimage;
CREATE TRIGGER pkgimagebeforetrigger BEFORE INSERT OR DELETE OR UPDATE ON xdruple.pkgimage FOR EACH ROW EXECUTE PROCEDURE _pkgimagebeforetrigger();
ALTER TABLE xdruple.pkgimage DROP CONSTRAINT IF EXISTS pkgimage_pkey CASCADE;
ALTER TABLE xdruple.pkgimage ADD CONSTRAINT pkgimage_pkey PRIMARY KEY(image_id);
