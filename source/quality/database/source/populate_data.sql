-- Work Centres
INSERT INTO xtmfg.wrkcnt ( wrkcnt_id, wrkcnt_code, wrkcnt_descrip,  wrkcnt_dept_id, wrkcnt_warehous_id,  wrkcnt_nummachs, wrkcnt_numpeople,  wrkcnt_setup_lbrrate_id, wrkcnt_setuprate,  wrkcnt_run_lbrrate_id, wrkcnt_runrate,  wrkcnt_brd_prcntlbr, wrkcnt_brd_rateperlbrhr,  wrkcnt_brd_ratepermachhr, wrkcnt_brd_rateperunitprod,  wrkcnt_avgqueuedays, wrkcnt_avgsutime,  wrkcnt_dailycap, wrkcnt_caploaduom, wrkcnt_efficfactor,  wrkcnt_comments, wrkcnt_wip_location_id) VALUES ( 3 , 'INSP' , 'QA Inspection' ,  NULL , 35 ,  1 , 1 ,  -1 , 0 ,  -1 , 0 ,  0 , 0 ,  0 , 0 ,  0 , 0 ,  0 , 'L' , 0 ,  '' , -1  );

INSERT INTO xtmfg.wrkcnt ( wrkcnt_id, wrkcnt_code, wrkcnt_descrip,  wrkcnt_dept_id, wrkcnt_warehous_id,  wrkcnt_nummachs, wrkcnt_numpeople,  wrkcnt_setup_lbrrate_id, wrkcnt_setuprate,  wrkcnt_run_lbrrate_id, wrkcnt_runrate,  wrkcnt_brd_prcntlbr, wrkcnt_brd_rateperlbrhr,  wrkcnt_brd_ratepermachhr, wrkcnt_brd_rateperunitprod,  wrkcnt_avgqueuedays, wrkcnt_avgsutime,  wrkcnt_dailycap, wrkcnt_caploaduom, wrkcnt_efficfactor,  wrkcnt_comments, wrkcnt_wip_location_id) VALUES ( 2 , 'REMAN' , 'Remanufacture' ,  NULL , 35 ,  1 , 1 ,  -1 , 0 ,  -1 , 0 ,  0 , 0 ,  0 , 0 ,  0 , 0 ,  0 , 'L' , 0 ,  '' , -1  );

INSERT INTO xtmfg.wrkcnt ( wrkcnt_id, wrkcnt_code, wrkcnt_descrip,  wrkcnt_dept_id, wrkcnt_warehous_id,  wrkcnt_nummachs, wrkcnt_numpeople,  wrkcnt_setup_lbrrate_id, wrkcnt_setuprate,  wrkcnt_run_lbrrate_id, wrkcnt_runrate,  wrkcnt_brd_prcntlbr, wrkcnt_brd_rateperlbrhr,  wrkcnt_brd_ratepermachhr, wrkcnt_brd_rateperunitprod,  wrkcnt_avgqueuedays, wrkcnt_avgsutime,  wrkcnt_dailycap, wrkcnt_caploaduom, wrkcnt_efficfactor,  wrkcnt_comments, wrkcnt_wip_location_id) VALUES ( 1 , 'ASS' , 'Assembly' ,  NULL , 35 ,  1 , 1 ,  -1 , 0 ,  -1 , 0 ,  0 , 0 ,  0 , 0 ,  0 , 0 ,  0 , 'L' , 0 ,  '' , -1  );

-- Standard Operation
INSERT INTO xtmfg.stdopn ( stdopn_id, stdopn_number,  stdopn_descrip1, stdopn_descrip2,  stdopn_wrkcnt_id, stdopn_toolref, stdopn_stdtimes,  stdopn_produom, stdopn_invproduomratio,  stdopn_sutime, stdopn_sucosttype, stdopn_reportsetup,  stdopn_rntime, stdopn_rncosttype, stdopn_reportrun,  stdopn_rnqtyper, stdopn_instructions, stdopn_opntype_id ) VALUES ( 1 ,  'INSPECT' ,  'Inspection' ,  '' ,  1 ,  'Calipers' ,  FALSE ,  'EA' ,  1 ,  0 ,  'D' ,  FALSE ,  0 ,  'D' ,  FALSE ,  0 ,  'Quality Test and Inspection' ,  1  );

INSERT INTO xtmfg.stdopn ( stdopn_id, stdopn_number,  stdopn_descrip1, stdopn_descrip2,  stdopn_wrkcnt_id, stdopn_toolref, stdopn_stdtimes,  stdopn_produom, stdopn_invproduomratio,  stdopn_sutime, stdopn_sucosttype, stdopn_reportsetup,  stdopn_rntime, stdopn_rncosttype, stdopn_reportrun,  stdopn_rnqtyper, stdopn_instructions, stdopn_opntype_id ) VALUES ( 2 ,  'REWORK' ,  'Manufacturing Rework' ,  '' ,  2 ,  '' ,  FALSE ,  'EA' ,  1 ,  0 ,  'D' ,  FALSE ,  0 ,  'D' ,  FALSE ,  0 ,  '' ,  2  );

SELECT setval('xtmfg.stdopn_stdopn_id_seq', 3);

-- Units of Measure
INSERT INTO public.uom (uom_name, uom_descrip, uom_item_weight) VALUES ('MM', 'Millimetre', false);
INSERT INTO public.uom (uom_name, uom_descrip, uom_item_weight) VALUES ('C', 'Degrees Centigrade', false);

-- Sequence Setup
-- Lot Serial Sequence Setup
INSERT INTO lsseq ( lsseq_id, lsseq_number) VALUES ( 3, 'LOT1');
UPDATE lsseq SET lsseq_number='LOT1', lsseq_descrip='Lot Sequence', lsseq_prefix='XT-',lsseq_seqlen=5, lsseq_suffix='' WHERE (lsseq_id=3);
SELECT setval('lsseq_number_seq_3', '50000' - 1);

INSERT INTO lsseq ( lsseq_id, lsseq_number) VALUES ( 4, 'SERIAL1');
UPDATE lsseq SET lsseq_number='SERIAL1', lsseq_descrip='Serial Sequence', lsseq_prefix='XT-',lsseq_seqlen=5, lsseq_suffix='-QA' WHERE (lsseq_id=4);
SELECT setval('lsseq_number_seq_4', '80000' - 1);

