
  --Bill of Operations Item View

  SELECT dropIfExists('VIEW', 'api_booitem', 'xtmfg');
  CREATE OR REPLACE VIEW xtmfg.api_booitem AS

  SELECT
    item_number::VARCHAR AS boo_item_number,
    boohead_revision::VARCHAR AS boo_revision,
    booitem_seqnumber AS sequence_number,
    booitem_execday AS execution_day,
    CASE
      WHEN booitem_effective = startoftime() THEN
        'Always'
      ELSE
        formatdate(booitem_effective)
    END AS effective,
    CASE
      WHEN booitem_expires = endoftime() THEN
        'Never'
      ELSE
        formatdate(booitem_expires)
    END AS expires,
    COALESCE(stdopn_number,'None') AS standard_oper,
    booitem_descrip1 AS description1,
    booitem_descrip2 AS description2,
    wrkcnt_code AS work_center,
    booitem_toolref AS tooling_reference,
    booitem_produom AS production_uom,
    booitem_invproduomratio AS uom_ratio,
    booitem_sutime AS setup_time,
    CASE 
      WHEN booitem_sucosttype = 'D' THEN
        'Direct Labor'
      WHEN booitem_sucosttype = 'O' THEN
        'Overhead'
      WHEN booitem_sucosttype = 'N' THEN
        'None'
    END AS setup_report_cost_as,
    booitem_surpt AS report_setup_time,
    booitem_rntime AS run_time,
    booitem_rnqtyper AS run_per,
    CASE 
      WHEN booitem_rncosttype = 'D' THEN
        'Direct Labor'
      WHEN booitem_rncosttype = 'O' THEN
        'Overhead'
      WHEN booitem_rncosttype = 'N' THEN
        'None'
    END AS run_report_cost_as,
    booitem_rnrpt AS report_run_time,
    booitem_rcvinv AS receive_inventory,
    booitem_issuecomp AS auto_issue,
    booitem_overlap AS may_overlap,
    formatlocationname(booitem_wip_location_id) AS wip_location,
    booitem_instruc AS instructions
  FROM xtmfg.booitem
    LEFT OUTER JOIN xtmfg.boohead ON ((booitem_item_id=boohead_item_id)
                            AND (booitem_rev_id=boohead_rev_id))
    LEFT OUTER JOIN xtmfg.stdopn ON (booitem_stdopn_id=stdopn_id),
    xtmfg.wrkcnt, item
  WHERE ((booitem_wrkcnt_id=wrkcnt_id)
  AND (booitem_item_id=item_id));

GRANT ALL ON TABLE xtmfg.api_booitem TO xtrole;
COMMENT ON VIEW xtmfg.api_booitem IS 'Bill of Operations Item';

  --Rules

  CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO xtmfg.api_booitem DO INSTEAD

  INSERT INTO xtmfg.booitem VALUES (
    nextval('xtmfg.booitem_booitem_id_seq'),
    getItemId(NEW.boo_item_number),
    COALESCE(NEW.sequence_number,(
      SELECT MAX(booitem_seqnumber) + 10
      FROM xtmfg.booitem(getItemId(NEW.boo_item_number),
                   getRevId('BOO',NEW.boo_item_number,NEW.boo_revision))),10),
    COALESCE(xtmfg.getWrkCntId(NEW.work_center),
        (SELECT stdopn_wrkcnt_id
         FROM xtmfg.stdopn
         WHERE (stdopn_id=xtmfg.getStdOpnId(NEW.standard_oper))
           AND (stdopn_wrkcnt_id != -1))),
    COALESCE(xtmfg.getStdOpnId(NEW.standard_oper),-1),
    CASE
      WHEN xtmfg.getStdOpnId(NEW.standard_oper) IS NOT NULL THEN
        (SELECT stdopn_descrip1
         FROM xtmfg.stdopn
         WHERE (stdopn_id=xtmfg.getStdOpnId(NEW.standard_oper)))
      ELSE
        COALESCE(NEW.description1,'')
    END,
    CASE
      WHEN xtmfg.getStdOpnId(NEW.standard_oper) IS NOT NULL THEN
        (SELECT stdopn_descrip2
         FROM xtmfg.stdopn
         WHERE (stdopn_id=xtmfg.getStdOpnId(NEW.standard_oper)))
      ELSE
        COALESCE(NEW.description2,'')
    END,
    COALESCE(NEW.tooling_reference,
        (SELECT stdopn_toolref
         FROM xtmfg.stdopn
         WHERE (stdopn_id=xtmfg.getStdOpnId(NEW.standard_oper)))),
    COALESCE(NEW.setup_time,
        (SELECT stdopn_sutime
         FROM xtmfg.stdopn
         WHERE (stdopn_id=xtmfg.getStdOpnId(NEW.standard_oper))
         AND (stdopn_stdtimes)),
    0),
    COALESCE(
      CASE
        WHEN NEW.setup_report_cost_as = 'Direct Labor' THEN
          'D'
        WHEN NEW.setup_report_cost_as = 'Overhead' THEN
          'O'
        WHEN NEW.setup_report_cost_as = 'None' THEN
          'N'
      END,
        (SELECT stdopn_sucosttype
         FROM xtmfg.stdopn
         WHERE (stdopn_id=xtmfg.getStdOpnId(NEW.standard_oper))
         AND (stdopn_stdtimes)) 
    ),
    COALESCE(NEW.report_setup_time,
        (SELECT stdopn_reportsetup
         FROM xtmfg.stdopn
         WHERE (stdopn_id=xtmfg.getStdOpnId(NEW.standard_oper))
         AND (stdopn_stdtimes)),
    TRUE),
    COALESCE(NEW.run_time,
        (SELECT stdopn_rntime
         FROM xtmfg.stdopn
         WHERE (stdopn_id=xtmfg.getStdOpnId(NEW.standard_oper))
         AND (stdopn_stdtimes)),
    0),
    COALESCE(
      CASE
        WHEN NEW.run_report_cost_as = 'Direct Labor' THEN
          'D'
        WHEN NEW.run_report_cost_as = 'Overhead' THEN
          'O'
        WHEN NEW.run_report_cost_as = 'None' THEN
          'N'
      END,
        (SELECT stdopn_rncosttype
         FROM xtmfg.stdopn
         WHERE (stdopn_id=xtmfg.getStdOpnId(NEW.standard_oper))
         AND (stdopn_stdtimes))
      ),
    COALESCE(NEW.report_run_time,
        (SELECT stdopn_reportrun
         FROM xtmfg.stdopn
         WHERE (stdopn_id=xtmfg.getStdOpnId(NEW.standard_oper))
         AND (stdopn_stdtimes)),
    TRUE),
    COALESCE(NEW.run_per,
        (SELECT stdopn_rnqtyper
         FROM xtmfg.stdopn
         WHERE (stdopn_id=xtmfg.getStdOpnId(NEW.standard_oper))),
    1),
    COALESCE(NEW.production_uom,
        (SELECT stdopn_produom
         FROM xtmfg.stdopn
         WHERE (stdopn_id=xtmfg.getStdOpnId(NEW.standard_oper)))),
    COALESCE(NEW.uom_ratio,
        (SELECT stdopn_invproduomratio
         FROM xtmfg.stdopn
         WHERE (stdopn_id=xtmfg.getStdOpnId(NEW.standard_oper))),
    1),
    COALESCE(NEW.auto_issue,FALSE),
    COALESCE(NEW.receive_inventory,FALSE),
    CASE
      WHEN xtmfg.getStdOpnId(NEW.standard_oper) IS NOT NULL THEN
        (SELECT stdopn_instructions
         FROM xtmfg.stdopn
         WHERE (stdopn_id=xtmfg.getStdOpnId(NEW.standard_oper)))
      ELSE
        COALESCE(NEW.instructions,'')
    END,
    COALESCE(NEW.effective::date,startoftime()), 
    COALESCE(NEW.expires::date,endoftime()),
    'N',
    -1,
    TRUE,
    COALESCE(NEW.execution_day,1),
    COALESCE(NEW.may_overlap,TRUE),
    FALSE,
    COALESCE(getLocationId((
      SELECT warehous_code
      FROM xtmfg.wrkcnt, whsinfo
      WHERE (wrkcnt_id=xtmfg.getWrkCntId(NEW.work_center))
      AND (warehous_id=wrkcnt_warehous_id)),
      NEW.wip_location),-1),
    COALESCE(getRevId('BOO',NEW.boo_item_number,NEW.boo_revision),getActiveRevId('BOO',getItemId(NEW.boo_item_number))),
    nextval('xtmfg.booitem_booitem_seq_id_seq'));
     
    CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO xtmfg.api_booitem DO INSTEAD

    UPDATE xtmfg.booitem SET
      booitem_seqnumber=NEW.sequence_number,
      booitem_execday=NEW.execution_day,
      booitem_effective=
        CASE WHEN NEW.effective = 'Always' THEN
          startoftime()
        ELSE 
          NEW.effective::date
        END, 
      booitem_expires=
        CASE WHEN NEW.expires = 'Never' THEN
          endoftime()
        ELSE 
          NEW.expires::date
        END,
    booitem_stdopn_id=xtmfg.getStdOpnId(NEW.standard_oper),
    booitem_descrip1=
    CASE
      WHEN xtmfg.getStdOpnId(NEW.standard_oper) IS NOT NULL THEN
        (SELECT stdopn_descrip1
         FROM xtmfg.stdopn
         WHERE (stdopn_id=xtmfg.getStdOpnId(NEW.standard_oper)))
      ELSE
        NEW.description1
    END,
    booitem_descrip2=
    CASE
      WHEN xtmfg.getStdOpnId(NEW.standard_oper) IS NOT NULL THEN
        (SELECT stdopn_descrip2
         FROM xtmfg.stdopn
         WHERE (stdopn_id=xtmfg.getStdOpnId(NEW.standard_oper)))
      ELSE
        NEW.description2
    END,
    booitem_wrkcnt_id=xtmfg.getWrkCntId(NEW.work_center),
    booitem_toolref=NEW.tooling_reference,
    booitem_produom=NEW.production_uom,
    booitem_invproduomratio=NEW.uom_ratio,
    booitem_sutime=NEW.setup_time,
    booitem_sucosttype=
    CASE 
      WHEN NEW.setup_report_cost_as = 'Direct Labor' THEN
        'D'
      WHEN NEW.setup_report_cost_as = 'Overhead' THEN
        'O'
      WHEN NEW.setup_report_cost_as = 'None' THEN
        'N'
    END,
    booitem_surpt=NEW.report_setup_time,
    booitem_rntime=NEW.run_time,
    booitem_rnqtyper=NEW.run_per,
    booitem_rncosttype=
    CASE 
      WHEN NEW.run_report_cost_as = 'Direct Labor' THEN
        'D'
      WHEN NEW.run_report_cost_as = 'Overhead' THEN
        'O'
      When NEW.run_report_cost_as = 'None' THEN
        'N'
    END,
    booitem_rnrpt=NEW.report_run_time,
    booitem_rcvinv=NEW.receive_inventory,
    booitem_issuecomp=NEW.auto_issue,
    booitem_overlap=NEW.may_overlap,
    booitem_wip_location_id=
      CASE WHEN NEW.wip_location = 'N/A' THEN
        -1
      ELSE
        COALESCE(getLocationId((
          SELECT warehous_code
          FROM xtmfg.wrkcnt, whsinfo
          WHERE (wrkcnt_id=xtmfg.getWrkCntId(NEW.work_center))
          AND (warehous_id=wrkcnt_warehous_id)),
          NEW.wip_location),-1)
      END,
    booitem_instruc=
    CASE
      WHEN xtmfg.getStdOpnId(NEW.standard_oper) IS NOT NULL THEN
        (SELECT stdopn_instructions
         FROM xtmfg.stdopn
         WHERE (stdopn_id=xtmfg.getStdOpnId(NEW.standard_oper)))
      ELSE
        NEW.instructions
    END
  WHERE ((booitem_item_id=getItemId(OLD.boo_item_number))
    AND (booitem_rev_id=getRevId('BOO',OLD.boo_item_number,OLD.boo_revision))
    AND (booitem_seqnumber=OLD.sequence_number));

    CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO xtmfg.api_booitem DO INSTEAD NOTHING;

