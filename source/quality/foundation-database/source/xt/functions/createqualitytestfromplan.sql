CREATE OR REPLACE FUNCTION xt.createQualityTestFromPlan( pPlanId INTEGER)
  RETURNS integer AS $$
DECLARE
 _qtest INTEGER;  
 _s	RECORD;
 _line  INTEGER :=1;
BEGIN

  INSERT INTO xt.qthead (qthead_number, qthead_qphead_id, qthead_status)
    VALUES (fetchnextnumber('QTNumber'), pPlanId, 'O')
    RETURNING qthead_id INTO _qtest;

  FOR _s IN
    SELECT qp.qpitem_id, qs.*
    FROM xt.qpitem qp
    JOIN xt.qspec qs ON (qpitem_qspec_id=qspec_id)
    WHERE qpitem_qphead_id=pPlanId
  LOOP  
    INSERT INTO xt.qtitem (qtitem_qthead_id, qtitem_linenumber, qtitem_qpitem_id,
                           qtitem_description, qtitem_instruction, qtitem_type,
                           qtitem_target, qtitem_upper, qtitem_lower, qtitem_uom,
                           qtitem_status)
    VALUES (_qtest, _line, _s.qpitem_id,
            _s.qspec_descrip, _s.qspec_instructions, _s.qspec_type,
            _s.qspec_target, _s.qspec_upper, _s.qspec_lower, _s.qspec_uom,
            'O');
  END LOOP;

-- TODO: Generate Quality Test workflow from Quality Plan
  
  RETURN _qtest;

END;
$$ language plpgsql;
