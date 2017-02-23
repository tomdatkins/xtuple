SELECT xt.create_view('public.usr', $BODY$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/EULA for the full text of the software license.

  WITH default_locale AS (
    SELECT
      locale_id,
      1 AS sort
      FROM locale
     WHERE lower(locale_code) = 'default'

    UNION
    SELECT
      locale_id,
      2 AS sort
      FROM (
        SELECT
          locale_id
          FROM locale
         ORDER BY locale_id
      ) AS locale_sort
     ORDER BY sort
     LIMIT 1
  )
  SELECT
    usesysid::integer AS usr_id,
    usename::text AS usr_username,
    COALESCE(value[6], '') AS usr_propername,
    null::text AS usr_passwd,
    COALESCE(value[5]::integer, (SELECT locale_id FROM default_locale)) AS usr_locale_id,
    COALESCE(value[4], '') AS usr_initials,
    COALESCE((value[2] = 't'), false) AS usr_agent,
    COALESCE((value[1] = 't'), usercanlogin(usename::text), false) AS usr_active,
    COALESCE(value[3], '') AS usr_email,
    COALESCE(value[7], '') AS usr_window
    FROM pg_user
    LEFT JOIN (
      SELECT
        username,
        -- Roll the value pairs up into an array for each user.
        --array_agg(name) AS name, -- Not actually used above, but helpful for debugging.
        array_agg(value) AS value
        FROM (
          SELECT
            username,
            name,
            value
            FROM (
              -- Make a dummy table of the pref names to serve as default rows if not set for the user.
              SELECT
                unnest(ARRAY[
                  'active',
                  'agent',
                  'email',
                  'initials',
                  'locale_id',
                  'propername',
                  'window'
                ]) AS name
               ORDER BY
                name
            ) AS pref_names
            LEFT JOIN (
              -- Join the user's pref settings with the dummy table.
              SELECT
                usrpref_username AS username,
                usrpref_name AS name,
                usrpref_value AS value
                FROM usrpref
               WHERE true
                 AND usrpref_name IN (
                   'active',
                   'agent',
                   'email',
                   'initials',
                   'locale_id',
                   'propername',
                   'window'
                 )
               ORDER BY
                username,
                name
            ) AS userprefs USING (name)
           -- Make sure they are alpha ordered so the array access operators above know which is which.
           ORDER BY
            username,
            name
        ) AS userprefs
       GROUP BY username
  ) AS usrprefs ON pg_user.usename = usrprefs.username;

$BODY$, false);
