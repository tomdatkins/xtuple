CREATE OR REPLACE FUNCTION canProcessPaymentGatewayTransaction(
  pCustId integer,
  pCcardId integer,
  pCurrId integer
) RETURNS boolean AS
$BODY$
-- Copyright (c) 1999-2018 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _currentAccntPeriod RECORD;
  _custCardAccnt RECORD;
  _exchangeRate NUMERIC;
  _isMmltiCurrency BOOLEAN := false;
  _taxCodeAccnt RECORD;

BEGIN

  SELECT
    count(*) > 1  INTO _isMmltiCurrency
    FROM curr_symbol;

  SELECT
    cust_id,
    cust_taxzone_id,
    ccard_id,
    ccbank_ccard_type IS NOT NULL AS card_has_ccbank,
    bankaccnt_id IS NOT NULL AS ccbank_has_bankaccnt,
    bankaccnt_ar AS bankaccnt_is_revenue,
    bankaccnt_accnt.accnt_id IS NOT NULL AS bankaccnt_has_glaccnt,
    bankaccnt_accnt.accnt_type = 'A' AS bankaccnt_glaccnt_is_asset,
    bankaccnt_accnt.accnt_active AS bankaccnt_glaccnt_is_active,
    ar_accnt.accnt_id IS NOT NULL AS cust_has_ar_glaccnt,
    ar_accnt.accnt_type = 'A' AS ar_glaccnt_is_asset,
    ar_accnt.accnt_active AS ar_glaccnt_is_active,
    prepaid_accnt.accnt_id IS NOT NULL AS cust_has_prepaid_glaccnt,
    prepaid_accnt.accnt_type = 'R' AS prepaid_glaccnt_is_revenue,
    prepaid_accnt.accnt_active AS prepaid_glaccnt_is_active,
    deferred_accnt.accnt_id IS NOT NULL AS cust_has_deferred_glaccnt,
    deferred_accnt.accnt_type = 'L' AS deferred_glaccnt_is_liability,
    deferred_accnt.accnt_active AS deferred_glaccnt_is_active,
    CASE WHEN NOT fetchmetricbool('IgnoreCompany')
      THEN (bankaccnt_accnt.accnt_company IS NOT DISTINCT FROM ar_accnt.accnt_company
            AND bankaccnt_accnt.accnt_company IS NOT DISTINCT FROM prepaid_accnt.accnt_company
            AND bankaccnt_accnt.accnt_company IS NOT DISTINCT FROM deferred_accnt.accnt_company
           )
      ELSE TRUE
    END AS glaccnt_same_company,
    CASE WHEN COALESCE(fetchMetricValue('GLCompanySize'), 0) = 0
      THEN (SELECT (accnt_id IS NOT NULL AND accnt_type = 'E' AND accnt_active)
              FROM accnt, metric
             WHERE metric_name = 'GLSeriesDiscrepancyAccount'
               AND  accnt_id = metric_value::INTEGER)
      ELSE (comp_dscrp_accnt.accnt_id IS NOT NULL
            AND comp_dscrp_accnt.accnt_type = 'E'
            AND comp_dscrp_accnt.accnt_active)
    END AS discrep_accnt_is_valid,
    CASE WHEN COALESCE(fetchMetricValue('GLCompanySize'), 0) = 0
      THEN (SELECT (accnt_id IS NOT NULL AND accnt_type = 'L' AND accnt_active)
              FROM accnt, metric
             WHERE metric_name = 'UnassignedAccount'
               AND  accnt_id = metric_value::INTEGER)
      ELSE (comp_unassigned_accnt.accnt_id IS NOT NULL
            AND comp_unassigned_accnt.accnt_type = 'L'
            AND comp_unassigned_accnt.accnt_active)
    END AS unassigned_accnt_is_valid
    INTO _custCardAccnt
    FROM custinfo
    JOIN ccard ON cust_id = ccard_cust_id
    LEFT JOIN ccbank ON ccard_type = ccbank_ccard_type
    LEFT JOIN bankaccnt ON ccbank_bankaccnt_id = bankaccnt_id
    LEFT JOIN accnt AS bankaccnt_accnt ON bankaccnt_accnt_id = bankaccnt_accnt.accnt_id
    LEFT JOIN accnt AS ar_accnt ON ar_accnt.accnt_id = findARAccount(cust_id)
    LEFT JOIN accnt AS prepaid_accnt ON prepaid_accnt.accnt_id = findPrepaidAccount(cust_id)
    LEFT JOIN accnt AS deferred_accnt ON deferred_accnt.accnt_id = findDeferredAccount(cust_id)
    LEFT JOIN company ON bankaccnt_accnt.accnt_company = company_number
    LEFT JOIN accnt AS comp_dscrp_accnt ON company_dscrp_accnt_id = comp_dscrp_accnt.accnt_id
    LEFT JOIN accnt AS comp_unassigned_accnt ON company_unassigned_accnt_id = comp_unassigned_accnt.accnt_id
   WHERE ccard_id = pCcardId
     AND cust_id = pCustId;

  IF (_custCardAccnt IS NULL) THEN
    RAISE EXCEPTION 'Invaid Customer or Payment Method. [xdruple: canProcessPaymentGatewayTransaction, -1]';
  END IF;
  IF (NOT _custCardAccnt.card_has_ccbank) THEN
    RAISE EXCEPTION 'Payment Method Bank Account is not mapped. [xdruple: canProcessPaymentGatewayTransaction, -2]';
  END IF;
  IF (NOT _custCardAccnt.ccbank_has_bankaccnt) THEN
    RAISE EXCEPTION 'Payment Method Bank Account is not setup. [xdruple: canProcessPaymentGatewayTransaction, -3]';
  END IF;
  IF (NOT _custCardAccnt.bankaccnt_is_revenue) THEN
    RAISE EXCEPTION 'Payment Method Bank Account is not used for accounts receivable. [xdruple: canProcessPaymentGatewayTransaction, -4]';
  END IF;
  IF (NOT _custCardAccnt.bankaccnt_has_glaccnt) THEN
    RAISE EXCEPTION 'Payment Method Bank Account does not have a G/L Account assigned. [xdruple: canProcessPaymentGatewayTransaction, -5]';
  END IF;
  IF (NOT _custCardAccnt.bankaccnt_glaccnt_is_asset) THEN
    RAISE EXCEPTION 'Payment Method Bank Account G/L Account is not an Asset account. [xdruple: canProcessPaymentGatewayTransaction, -6]';
  END IF;
  IF (NOT _custCardAccnt.bankaccnt_glaccnt_is_active) THEN
    RAISE EXCEPTION 'Payment Method Bank Account G/L Account is not Active. [xdruple: canProcessPaymentGatewayTransaction, -7]';
  END IF;
  IF (NOT _custCardAccnt.cust_has_ar_glaccnt) THEN
    RAISE EXCEPTION 'Customer does not have a A/R G/L Account assigned. [xdruple: canProcessPaymentGatewayTransaction, -8]';
  END IF;
  IF (NOT _custCardAccnt.ar_glaccnt_is_asset) THEN
    RAISE EXCEPTION 'Customer A/R Account is not an Asset account. [xdruple: canProcessPaymentGatewayTransaction, -9]';
  END IF;
  IF (NOT _custCardAccnt.ar_glaccnt_is_active) THEN
    RAISE EXCEPTION 'Customer A/R Account is not Active. [xdruple: canProcessPaymentGatewayTransaction, -10]';
  END IF;
  IF (NOT _custCardAccnt.cust_has_prepaid_glaccnt) THEN
    RAISE EXCEPTION 'Customer does not have a Prepaid G/L Account assigned. [xdruple: canProcessPaymentGatewayTransaction, -11]';
  END IF;
  IF (NOT _custCardAccnt.prepaid_glaccnt_is_revenue) THEN
    RAISE EXCEPTION 'Customer Prepaid Account is not a Revenue account. [xdruple: canProcessPaymentGatewayTransaction, -12]';
  END IF;
  IF (NOT _custCardAccnt.prepaid_glaccnt_is_active) THEN
    RAISE EXCEPTION 'Customer Prepaid Account is not Active. [xdruple: canProcessPaymentGatewayTransaction, -13]';
  END IF;
  IF (NOT _custCardAccnt.cust_has_deferred_glaccnt) THEN
    RAISE EXCEPTION 'Customer does not have a Deferred Revenue G/L Account assigned. [xdruple: canProcessPaymentGatewayTransaction, -14]';
  END IF;
  IF (NOT _custCardAccnt.deferred_glaccnt_is_liability) THEN
    RAISE EXCEPTION 'Customer Deferred Revenue Account is not a Liability account. [xdruple: canProcessPaymentGatewayTransaction, -15]';
  END IF;
  IF (NOT _custCardAccnt.deferred_glaccnt_is_active) THEN
    RAISE EXCEPTION 'Customer Deferred Revenue is not Active. [xdruple: canProcessPaymentGatewayTransaction, -16]';
  END IF;
  IF (NOT _custCardAccnt.glaccnt_same_company) THEN
    RAISE EXCEPTION 'G/L Accounts are not for the same Company. [xdruple: canProcessPaymentGatewayTransaction, -17]';
  END IF;
  IF (NOT _custCardAccnt.discrep_accnt_is_valid) THEN
    RAISE EXCEPTION 'G/L Series Discrepancy is not setup. [xdruple: canProcessPaymentGatewayTransaction, -18]';
  END IF;
  IF (NOT _custCardAccnt.unassigned_accnt_is_valid) THEN
    RAISE EXCEPTION 'Unassigned G/L Account is not setup. [xdruple: canProcessPaymentGatewayTransaction, -19]';
  END IF;

  FOR _taxCodeAccnt IN
    SELECT
      tax_code,
      accnt_id IS NOT NULL AS tax_has_glaccnt,
      accnt_type = 'L' AS tax_glaccnt_is_liability,
      accnt_active AS tax_glaccnt_is_active
      FROM taxass
      JOIN tax ON taxass_tax_id = tax_id
      JOIN accnt ON tax_sales_accnt_id = accnt_id
     WHERE taxass_taxzone_id = cust_taxzone_id
  LOOP
    IF (NOT _taxCodeAccnt.tax_has_glaccnt) THEN
      RAISE EXCEPTION 'Tax Code % does not have a G/L Account assigned. [xdruple: canProcessPaymentGatewayTransaction, -20]', _taxCodeAccnt.tax_code;
    END IF;
    IF (NOT _taxCodeAccnt.tax_glaccnt_is_liability) THEN
      RAISE EXCEPTION 'Tax Code % G/L Account is not a Liability account. [xdruple: canProcessPaymentGatewayTransaction, -21]', _taxCodeAccnt.tax_code;
    END IF;
    IF (NOT _taxCodeAccnt.tax_glaccnt_is_active) THEN
      RAISE EXCEPTION 'Tax Code % G/L Account is not Active. [xdruple: canProcessPaymentGatewayTransaction, -22]', _taxCodeAccnt.tax_code;
    END IF;
  END LOOP;

  SELECT
    COALESCE(period_closed, FALSE) AS period_closed,
    (NOT checkPrivilege('PostFrozenPeriod') AND COALESCE(period_freeze, FALSE)) AS period_freeze
    INTO _currentAccntPeriod
    FROM period
   WHERE CURRENT_DATE BETWEEN period_start AND period_end;

  IF (_currentAccntPeriod IS NULL) THEN
    RAISE EXCEPTION 'Cannot post to nonexistent Accounting Period (%). [xdruple: canProcessPaymentGatewayTransaction, -23]', CURRENT_DATE;
  END IF;

  IF (_currentAccntPeriod.period_closed) THEN
    RAISE EXCEPTION 'Cannot post to a closed Accounting Period (%). [xdruple: canProcessPaymentGatewayTransaction, -24]', CURRENT_DATE;
  END IF;

  IF (_currentAccntPeriod.period_freeze) THEN
    RAISE EXCEPTION 'Cannot post to a frozen Accounting Period (%). [xdruple: canProcessPaymentGatewayTransaction, -25]', CURRENT_DATE;
  END IF;

  IF (_isMmltiCurrency) THEN
    -- Will throw an error if the exchange rate is not setup.
    _exchangeRate := currRate(pCurrId, baseCurrID(), CURRENT_DATE);
  END IF;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION canProcessPaymentGatewayTransaction(text, text)
  OWNER TO admin;
