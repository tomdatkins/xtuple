-- View definition for Drupal Commerce integration for User to Contact relations.

SELECT xt.create_view('xdruple.xd_user_association', $$
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
    CASE WHEN crmacct_parent_id > 0 AND crmacct_cust_id IS NULL
      -- Check if this is a Ship To Only CRM Account. Ship To Only Accounts
      -- are restricted to palce orders under their parent CRM Account and can
      -- only access a single Ship To of the Parent Customer.
      THEN
        CASE WHEN (SELECT crmacct_cust_id FROM crmacct AS parent WHERE parent.crmacct_id = crmacct.crmacct_parent_id) > 0
        -- If this CRM Account is not a Customer, but has a Parent that is,
        -- this can be a Ship To Only CRM Account.
          THEN
            CASE WHEN (SELECT DISTINCT shipto_cntct_id FROM shiptoinfo
                       WHERE shipto_cust_id = (SELECT crmacct_cust_id FROM crmacct AS parent WHERE parent.crmacct_id = crmacct.crmacct_parent_id)
                         AND shipto_cntct_id = xd_user_contact_cntct_id
                      ) > 0
              -- If this xd_user_contact_cntct_id is the shipto_cntct_id for the
              -- Parent Customer, this is a Ship To Only CRM Account.
              THEN true
              ELSE false
            END
          ELSE false
        END
      ELSE false
    END AS is_shipto_only,
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

  COMMENT ON COLUMN xdruple.xd_user_association.xd_user_contact_id
    IS 'xd_user_contact table primary key.';
  COMMENT ON COLUMN xdruple.xd_user_association.xd_user_contact_site_id
    IS 'Drupal site id for this association.';
  COMMENT ON COLUMN xdruple.xd_user_association.xd_user_contact_drupal_user_uuid
    IS 'Drupal Users UUID.';
  COMMENT ON COLUMN xdruple.xd_user_association.xd_user_contact_cntct_id
    IS 'Drupal Users associated Contact.';
  COMMENT ON COLUMN xdruple.xd_user_association.crmacct_id
    IS 'Read only association of the Contacts CRM Account.';
  COMMENT ON COLUMN xdruple.xd_user_association.is_customer
    IS 'Flag if this CRM Account is a Customer. Set to true creates new Customer if currently set to false.';
  COMMENT ON COLUMN xdruple.xd_user_association.is_prospect
    IS 'Flag if this CRM Account is a Prospect. Set to true creates new Prospect if currently set to false.';
  COMMENT ON COLUMN xdruple.xd_user_association.is_vendor
    IS 'Read only flag if this CRM Account is a Vendor.';
  COMMENT ON COLUMN xdruple.xd_user_association.is_employee
    IS 'Read only flag if this CRM Account is a Employee.';
  COMMENT ON COLUMN xdruple.xd_user_association.is_salesrep
    IS 'Read only flag if this CRM Account is a Sales Rep.';
  COMMENT ON COLUMN xdruple.xd_user_association.is_partner
    IS 'Read only flag if this CRM Account is a Partner.';
  COMMENT ON COLUMN xdruple.xd_user_association.is_competitor
    IS 'Read only flag if this CRM Account is a Competitor.';
  COMMENT ON COLUMN xdruple.xd_user_association.is_pguser
    IS 'Flag if this CRM Account is a PostgreSQL User. Set to true creates new PostgreSQL User if currently set to false.';
$$, false);

-- Remove old triggers if any.
DROP TRIGGER IF EXISTS xd_user_association_trigger ON xdruple.xd_user_association;
DROP TRIGGER IF EXISTS xd_user_association_flags_trigger ON xdruple.xd_user_association;

-- Create triggers.
CREATE TRIGGER xd_user_association_trigger
  INSTEAD OF INSERT OR UPDATE OR DELETE ON xdruple.xd_user_association
  FOR EACH ROW EXECUTE PROCEDURE xdruple._xd_user_association_trigger();
CREATE TRIGGER xd_user_association_flags_trigger
  INSTEAD OF INSERT OR UPDATE ON xdruple.xd_user_association
  FOR EACH ROW EXECUTE PROCEDURE xdruple._xd_user_association_flags_trigger();
