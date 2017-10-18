DO $$
DECLARE
  _r RECORD;
  _resultcashrcpt INTEGER;
  _resultccpay INTEGER;
  _cashrcpts INTEGER[];
  _ccpays INTEGER[];
  _foundcashrcpts INTEGER[];
  _foundccpays INTEGER[];
  _cashrcpt INTEGER;
  _ccpay INTEGER;
  _amount NUMERIC;
  _currid INTEGER;

BEGIN

  -- Try to match existing cash receipts and ccpays as well as possible
  -- The old way is to compare order number with doc number and match customer
  -- If only one match is found this way, use it, otherwise, do the best we can
  -- In almost all cases it should be a simple match, the rest is just in case
  FOR _r IN SELECT CASE WHEN TRIM(COALESCE(cashrcpt_docnumber, ''))=''
                        THEN TEXT(cashrcpt_id)
                        ELSE cashrcpt_docnumber END AS docnumber,
                   cashrcpt_cust_id,
                   COUNT(*) AS count
              FROM cashrcpt
             WHERE isExternalFundsType(cashrcpt_fundstype)
               AND cashrcpt_ccpay_id IS NULL
             GROUP BY docnumber, cashrcpt_cust_id
  LOOP
    IF _r.count=1 THEN
      -- Only one cashrcpt. Pick a matching ccpay by following priority:
      -- 1. Matching currency and amount
      -- 2. Matching currency only
      -- 3. Matching amount
      -- 4. Any
      -- When choosing among these, try to match based on creation time, approximated
      -- by cashrcpt_id for cashrcpt and done by ccpay_transaction_datetime followed by ccpay_id
      -- for ccpay
      UPDATE cashrcpt
         SET cashrcpt_ccpay_id=(SELECT ccpay_id
                                  FROM (SELECT ccpay_id,
                                        CASE WHEN ccpay_amount=cashrcpt_amount
                                                  OR ccpay_status!='C'
                                             THEN 1
                                             ELSE 0
                                              END +
                                        CASE WHEN ccpay_curr_id=cashrcpt_curr_id
                                             THEN 2 
                                             ELSE 0
                                              END AS match
                                          FROM ccpay
                                         WHERE ccpay_type='C'
                                           AND ccpay_id NOT IN (SELECT payco_ccpay_id FROM payco)
                                           AND ccpay_order_number=_r.docnumber
                                           AND ccpay_cust_id=_r.cashrcpt_cust_id
                                         ORDER BY match DESC,
                                         ccpay_transaction_datetime, ccpay_id) ordered
                                 LIMIT 1)
       WHERE CASE WHEN TRIM(COALESCE(cashrcpt_docnumber, ''))=''
                             THEN TEXT(cashrcpt_id)
                             ELSE cashrcpt_docnumber END=_r.docnumber
             AND cashrcpt_cust_id=_r.cashrcpt_cust_id
       RETURNING cashrcpt_id, cashrcpt_ccpay_id
            INTO _resultcashrcpt, _resultccpay;

       _foundcashrcpts := _foundcashrcpts || _resultcashrcpt;
       _foundccpays := _foundccpays || _resultccpay;
    ELSE
      -- Multiple cash rcecipts. Grab all cash receipts and ccpays with this number and try
      -- to match them based on amount, currency, and order as above
      _cashrcpts := ARRAY(SELECT cashrcpt_id
                            FROM cashrcpt
                           WHERE CASE WHEN TRIM(COALESCE(cashrcpt_docnumber, ''))=''
                                      THEN TEXT(cashrcpt_id)
                                      ELSE cashrcpt_docnumber END=_r.docnumber
                             AND cashrcpt_cust_id=_r.cashrcpt_cust_id
                           ORDER BY cashcrpt_id);
      _ccpays := ARRAY(SELECT ccpay_id
                         FROM ccpay
                        WHERE ccpay_type='C'
                          AND ccpay_id NOT IN (SELECT payco_ccpay_id FROM payco)
                          AND ccpay_order_number=_r.docnumber
                          AND ccpay_cust_id=_r.cashrcpt_cust_id
                        ORDER BY ccpay_transaction_datetime, ccpay_id);

      FOREACH _cashrcpt IN ARRAY _cashrcpts
      LOOP
        SELECT cashrcpt_amount, cashrcpt_curr_id
          INTO _amount, _currid
          FROM cashrcpt
         WHERE cashrcpt_id=_cashrcpt;

        FOREACH _ccpay IN ARRAY _ccpays
        LOOP
          IF ((SELECT ccpay_amount=_amount AND ccpay_curr_id=_currid
                 FROM ccpay
                WHERE ccpay_id=_ccpay)
              AND _ccpay NOT IN (SELECT UNNEST(_foundccpays))) THEN
            UPDATE cashrcpt
               SET cashrcpt_ccpay_id=_ccpay
             WHERE cashrcpt_id=_cashrcpt;

            _foundcashrcpts := _foundcashrcpts || _cashrcpt;
            _foundccpays := _foundccpays || _ccpay;

            EXIT;
          END IF;
        END LOOP;
      END LOOP;

      FOREACH _cashrcpt IN ARRAY _cashrcpts
      LOOP
        IF (_cashrcpt NOT IN (SELECT UNNEST(_foundcashrcpts))) THEN
          SELECT cashrcpt_amount
            INTO _amount
            FROM cashrcpt
           WHERE cashrcpt_id=_cashrcpt;

          FOREACH _ccpay IN ARRAY _ccpays
          LOOP
            IF ((SELECT ccpay_amount=_amount
                   FROM ccpay
                  WHERE ccpay_id=_ccpay)
                AND _ccpay NOT IN (SELECT UNNEST(_foundccpays))) THEN
              UPDATE cashrcpt
                 SET cashrcpt_ccpay_id=_ccpay
               WHERE cashrcpt_id=_cashrcpt;

              _foundcashrcpts := _foundcashrcpts || _cashrcpt;
              _foundccpays := _foundccpays || _ccpay;

              EXIT;
            END IF;
          END LOOP;
        END IF;
      END LOOP;

      FOREACH _cashrcpt IN ARRAY _cashrcpts
      LOOP
        IF (_cashrcpt NOT IN (SELECT UNNEST(_foundcashrcpts))) THEN
          SELECT cashrcpt_curr_id
            INTO _currid
            FROM cashrcpt
           WHERE cashrcpt_id=_cashrcpt;

          FOREACH _ccpay IN ARRAY _ccpays
          LOOP
            IF ((SELECT ccpay_curr_id=_currid
                   FROM ccpay
                  WHERE ccpay_id=_ccpay)
                AND _ccpay NOT IN (SELECT UNNEST(_foundccpays))) THEN
              UPDATE cashrcpt
                 SET cashrcpt_ccpay_id=_ccpay
               WHERE cashrcpt_id=_cashrcpt;

              _foundcashrcpts := _foundcashrcpts || _cashrcpt;
              _foundccpays := _foundccpays || _ccpay;

              EXIT;
            END IF;
          END LOOP;
        END IF;
      END LOOP;

      FOREACH _cashrcpt IN ARRAY _cashrcpts
      LOOP
        IF (_cashrcpt NOT IN (SELECT UNNEST(_foundcashrcpts))) THEN
          FOREACH _ccpay IN ARRAY _ccpays
          LOOP
            IF (_ccpay NOT IN (SELECT UNNEST(_foundccpays))) THEN
              UPDATE cashrcpt
                 SET cashrcpt_ccpay_id=_ccpay
               WHERE cashrcpt_id=_cashrcpt;

              _foundcashrcpts := _foundcashrcpts || _cashrcpt;
              _foundccpays := _foundccpays || _ccpay;

              EXIT;
            END IF;
          END LOOP;
        END IF;
      END LOOP;
    END IF;
  END LOOP;

END;
$$ LANGUAGE plpgsql;
