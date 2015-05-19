-- View definition for Drupal Commerce integration for User to Contact relations.

SELECT xt.create_view('xdruple.xd_user_cntct_crmacct', $$
  SELECT
    xd_user_contact.*,
    crmacct_id,
    CASE WHEN crmacct_cust_id IS NULL
      THEN false
      ELSE true
    END AS is_customer,
    CASE WHEN crmacct_prospect_id IS NULL
      THEN false
      ELSE true
    END AS is_prospect,
    CASE WHEN crmacct_vend_id IS NULL
      THEN false
      ELSE true
    END AS is_vendor,
    CASE WHEN crmacct_emp_id IS NULL
      THEN false
      ELSE true
    END AS is_employee,
    CASE WHEN crmacct_salesrep_id IS NULL
      THEN false
      ELSE true
    END AS is_salesrep,
    CASE WHEN crmacct_partner_id IS NULL
      THEN false
      ELSE true
    END AS is_partner,
    CASE WHEN crmacct_competitor_id IS NULL
      THEN false
      ELSE true
    END AS is_competitor,
    CASE WHEN crmacct_usr_username IS NULL
      THEN false
      ELSE true
    END AS is_pguser
  FROM xdruple.xd_user_contact
  LEFT JOIN cntct ON xd_user_contact_cntct_id = cntct_id
  LEFT JOIN crmacct ON crmacct_id = cntct_crmacct_id;
$$, false);

-- Remove old triggers if any.
DROP TRIGGER IF EXISTS xd_user_cntct_crmacct_trigger ON xdruple.xd_user_cntct_crmacct;
DROP TRIGGER IF EXISTS xd_user_cntct_crmacct_flags_trigger ON xdruple.xd_user_cntct_crmacct;

-- Create triggers.
CREATE TRIGGER xd_user_cntct_crmacct_trigger
  INSTEAD OF INSERT OR UPDATE OR DELETE ON xdruple.xd_user_cntct_crmacct
  FOR EACH ROW EXECUTE PROCEDURE xdruple._xd_user_cntct_crmacct_trigger();
CREATE TRIGGER xd_user_cntct_crmacct_flags_trigger
  INSTEAD OF INSERT OR UPDATE ON xdruple.xd_user_cntct_crmacct
  FOR EACH ROW EXECUTE PROCEDURE xdruple._xd_user_cntct_crmacct_flags_trigger();
