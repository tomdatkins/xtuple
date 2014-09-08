drop trigger if exists wooperqualitytrigger on xtmfg.wooper;

CREATE TRIGGER wooperqualitytrigger AFTER INSERT
  ON xtmfg.wooper FOR EACH ROW
  EXECUTE PROCEDURE xt.triggerwooperquality();
