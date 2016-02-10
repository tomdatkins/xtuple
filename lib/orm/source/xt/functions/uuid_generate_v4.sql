/**
    Generate a universally unique identifier.

    @returns {text}
*/
create or replace function xt.uuid_generate_v4() returns uuid as $$

  /*
   * Uses the `uuid-ossp` Postgres extension to create a UUID.
   * @See: http://www.postgresql.org/docs/9.1/static/uuid-ossp.html
   */

  return uuid_generate_v4();

$$ language plv8;
