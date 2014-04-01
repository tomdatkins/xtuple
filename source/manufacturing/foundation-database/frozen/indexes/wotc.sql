DROP INDEX IF EXISTS wotc_wo_id_idx;
DROP INDEX IF EXISTS wotc_wotc_username_idx;
DROP INDEX IF EXISTS wotc_wotc_wooper_id_idx;

CREATE INDEX wotc_wo_id_idx          ON xtmfg.wotc (wotc_wo_id);
CREATE INDEX wotc_wotc_username_idx  ON xtmfg.wotc (wotc_username);
CREATE INDEX wotc_wotc_wooper_id_idx ON xtmfg.wotc (wotc_wooper_id);

