/* Helper function to assist in migrations and go live implementations. */
/* This function will take a cntct_id, determine it's CRM Account and Customer. */
/* Then use that data to create a PostgreSQL user and assign it the XDRUPLE role. */
/* It will return the username it creates. */

create or replace function xdruple.xd_create_pguser_for_crmaccnt_cntct(cntct_id integer) returns text stable as $$

return (function () {

  try {
    var username = plv8.execute("select current_user as username")[0].username,
      contact = plv8.execute("select * from cntct where cntct_id = $1;", [cntct_id])[0],
      crmaccnt = plv8.execute("select * from crmacct where crmacct_id = $1;", [contact.cntct_crmacct_id])[0],
      userexists = crmaccnt ? plv8.execute("select 1 from pg_roles where rolname= $1;", [crmaccnt.crmacct_number.toLowerCase()])[0] : false,
      primarycntct = crmaccnt ? plv8.execute("select * from cntct where cntct_id = $1;", [crmaccnt.crmacct_cntct_id_1])[0] : false,
      user_payload = {
        "username": username,
        "nameSpace":"XM",
        "type": "UserAccount"
      };

    /* Make sure crmaccnt is set. */
    if (!crmaccnt) {
      plv8.elog(WARNING, "No CRM Account set for Contact: ", contact.cntct_first_name + " " + contact.cntct_last_name);

      return null;
    }

    /* Send warning if primarycntct is not set. */
    if (!primarycntct) {
      plv8.elog(WARNING, "No primary contact set for CRM Account: ", crmaccnt.crmacct_number);
    }

    /* Make sure this crmaccnt is not already a user. */
    if (crmaccnt.crmacct_usr_username) {
      plv8.elog(WARNING, "Skipping user creation. There is already a user for CRM Account: ", crmaccnt.crmacct_number);

      /* Set role/privs and ext for this user. */
      plv8.execute("select xt.grant_user_role($1, $2)", [crmaccnt.crmacct_usr_username, "XDRUPLE"]);

      return crmaccnt.crmacct_usr_username;
    }

    if (userexists) {
      plv8.elog(WARNING, "Skipping user creation. There is already a user : ", crmaccnt.crmacct_number.toLowerCase());
      return crmaccnt.crmacct_number.toLowerCase();
    }

    /* Create a User Account. */
    user_payload.data = {
      "username": crmaccnt.crmacct_number.toLowerCase(),
      "properName": crmaccnt.crmacct_name ? crmaccnt.crmacct_name : "",
      "useEnhancedAuth": true,
      "disableExport": true,
      "isActive": true,
      "initials": "XDRUPLE",
      "email": (primarycntct && primarycntct.cntct_email) ? primarycntct.cntct_email.toLowerCase() : "",
      "organization": XT.currentDb,
      "locale": "Default",
      "isAgent": false
    };

    /* POST the new User Account. */
    new_user = XT.Rest.post(user_payload);

    /* Set the username on the CRM Account. */
    plv8.execute("update crmacct set crmacct_usr_username = $1 where crmacct_number = $2;", [new_user.id, crmaccnt.crmacct_number]);

    /* Set role/privs and ext for this user. */
    plv8.execute("select xt.grant_user_role($1, $2)", [new_user.id, "XDRUPLE"]);

    return new_user.username;
  } catch (err) {
    XT.error(err);
  }

}());

$$ language plv8;
