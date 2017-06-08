-- Function: xt.copychars(text, integer, text, integer)

-- DROP FUNCTION xt.copychars(text, integer, text, integer);

CREATE OR REPLACE FUNCTION xt.copychars(
    source_char_type text,
    source_id integer,
    target_char_type text,
    target_id integer)
  RETURNS text AS
$BODY$
  var sourceCharsSql =  "SELECT\n" +
                        "  charass_char_id,\n" +
                        "  charass_value\n" +
                        "FROM charass\n" +
                        "WHERE charass_target_type = $1\n" +
                        "  AND charass_target_id = $2";
  var insertCharsSql =  "INSERT INTO charass (" +
                        "  charass_target_type,\n" +
                        "  charass_target_id,\n" +
                        "  charass_char_id,\n" +
                        "  charass_value\n" +
                        ") VALUES (\n" +
                        "  $1,\n" +
                        "  $2,\n" +
                        "  $3,\n" +
                        "  $4\n" +
                        ")";

  var sourceChars = plv8.execute(sourceCharsSql,
                                 [
                                   source_char_type,
                                   source_id
                                 ]);

  sourceChars.map(function (row) {
    plv8.execute(insertCharsSql,
                 [
                   target_char_type,
                   target_id,
                   row.charass_char_id,
                   row.charass_value
                 ]);
  });

  return;
$BODY$
  LANGUAGE plv8 VOLATILE
  COST 100;
ALTER FUNCTION xt.copychars(text, integer, text, integer)
  OWNER TO admin;
