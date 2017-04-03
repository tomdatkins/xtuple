drop trigger if exists incdtbomvertrigger on xtincdtpls.incdtbomver;

create or replace function xtincdtpls._incdtbomvertrigger() returns trigger AS $$
DECLARE
  _oldFoundIn TEXT := '';
  _oldFixedIn TEXT := '';
  _newFoundIn TEXT := '';
  _newFixedIn TEXT := '';
  _incdtid INTEGER;
BEGIN
  SELECT incdt_id
    INTO _incdtid
    FROM incdt
   WHERE(incdt_id=NEW.incdtbomver_incdt_id);
  IF(NOT FOUND OR _incdtid IS NULL) THEN
    RETURN NEW;
  END IF;

  IF (TG_OP = 'UPDATE') THEN
    SELECT rev_number
      INTO _oldFoundIn
      FROM rev
     WHERE(rev_id=OLD.incdtbomver_found_rev_id);
    SELECT rev_number
      INTO _oldFixedIn
      FROM rev
     WHERE(rev_id=OLD.incdtbomver_fixed_rev_id);
    _oldFoundIn := COALESCE(_oldFoundIn, '');
    _oldFixedIn := COALESCE(_oldFixedIn, '');
  END IF;
  SELECT rev_number
    INTO _newFoundIn
    FROM rev
   WHERE(rev_id=NEW.incdtbomver_found_rev_id);
  SELECT rev_number
    INTO _newFixedIn
    FROM rev
   WHERE(rev_id=NEW.incdtbomver_fixed_rev_id);
  _newFoundIn := COALESCE(_newFoundIn, '');
  _newFixedIn := COALESCE(_newFixedIn, '');

  IF(_oldFoundIn <> _newFoundIn) THEN
    INSERT INTO incdthist (incdthist_incdt_id, incdthist_descrip)
    VALUES(_incdtid, 'Found In: '|| _oldFoundIn || ' -> ' || _newFoundIn);
  END IF;
  IF(_oldFixedIn <> _newFixedIn) THEN
    INSERT INTO incdthist (incdthist_incdt_id, incdthist_descrip)
    VALUES(_incdtid, 'Fixed In: '|| _oldFixedIn || ' -> ' || _newFixedIn);
  END IF;

  RETURN NEW;
END;
$$ language plpgsql;

create trigger incdtbomvertrigger after insert or update on xtincdtpls.incdtbomver for each row execute procedure xtincdtpls._incdtbomvertrigger();
