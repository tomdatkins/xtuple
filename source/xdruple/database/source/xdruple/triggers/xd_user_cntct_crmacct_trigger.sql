CREATE OR REPLACE FUNCTION xdruple._xd_user_cntct_crmacct_trigger() RETURNS TRIGGER AS $$

  var deleteSql = 'DELETE FROM xdruple.xd_user_contact WHERE xd_user_contact_id = $1;',
      insertSql = 'INSERT INTO xdruple.xd_user_contact ( ' +
                  '  xd_user_contact_site_id, ' +
                  '  xd_user_contact_drupal_user_uuid, ' +
                  '  xd_user_contact_cntct_id ' +
                  ') VALUES ( ' +
                  '  $1, ' +
                  '  $2, ' +
                  '  $3 ' +
                  ')',
      params = [],
      updateSql = 'UPDATE xdruple.xd_user_contact SET ' +
                  '  xd_user_contact_site_id = $1, ' +
                  '  xd_user_contact_drupal_user_uuid = $2, ' +
                  '  xd_user_contact_cntct_id = $3 ' +
                  'WHERE xd_user_contact_id = $4';


  /* Persist the change to the xdruple.xd_user_contact table. */
  if (TG_OP === 'INSERT') {
    params = [
      NEW.xd_user_contact_site_id,
      NEW.xd_user_contact_drupal_user_uuid,
      NEW.xd_user_contact_cntct_id,
    ];

    if (DEBUG) {
      XT.debug('_xd_user_cntct_crmacct_trigger sql =', insertSql);
      XT.debug('_xd_user_cntct_crmacct_trigger values =', params);
    }

    plv8.execute(insertSql, params);
    return NEW;
  } else if (TG_OP === 'UPDATE') {
    params = [
      NEW.xd_user_contact_site_id,
      NEW.xd_user_contact_drupal_user_uuid,
      NEW.xd_user_contact_cntct_id,
      OLD.xd_user_contact_id
    ];

    if (DEBUG) {
      XT.debug('_xd_user_cntct_crmacct_trigger sql =', updateSql);
      XT.debug('_xd_user_cntct_crmacct_trigger values =', params);
    }

    plv8.execute(updateSql, params);
    return NEW;
  } else if (TG_OP === 'DELETE') {
    params = [
      OLD.xd_user_contact_id
    ];

    if (DEBUG) {
      XT.debug('_xd_user_cntct_crmacct_trigger sql =', deleteSql);
      XT.debug('_xd_user_cntct_crmacct_trigger values =', params);
    }

    plv8.execute(deleteSql, params);
    return OLD;
  }

$$ LANGUAGE plv8;
