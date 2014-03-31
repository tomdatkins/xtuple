DROP SEQUENCE IF EXISTS lsreg_number_seq;

CREATE SEQUENCE lsreg_number_seq;
ALTER  SEQUENCE lsreg_number_seq OWNED BY lsreg.lsreg_number;

SELECT SETVAL('lsreg_number_seq', MAX(CAST(lsreg_number AS BIGINT)))
  FROM lsreg;

REVOKE ALL ON SEQUENCE lsreg_number_seq FROM PUBLIC;
GRANT  ALL ON SEQUENCE lsreg_number_seq TO   xtrole;
