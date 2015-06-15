CREATE or replace FUNCTION _cmitemaccntaftertrigger() RETURNS TRIGGER 
	AS $$
BEGIN
    DELETE FROM cmitemaccnt 
    WHERE (cmitemaccnt_cmitem_id=OLD.cmitem_id);
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION public._cmitemaccntaftertrigger() OWNER TO admin;

CREATE TRIGGER cmitemaccntaftertrigger BEFORE DELETE ON cmitem FOR EACH ROW EXECUTE PROCEDURE _cmitemaccntaftertrigger();
