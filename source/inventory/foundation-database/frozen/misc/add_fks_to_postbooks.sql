UPDATE incdt SET incdt_ls_id = NULL
 WHERE incdt_ls_id IS NOT NULL
   AND incdt_ls_id NOT IN (SELECT ls_id FROM ls);
ALTER TABLE incdt
  ADD CONSTRAINT incdt_incdt_ls_id_fkey FOREIGN KEY (incdt_ls_id)
      REFERENCES ls (ls_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION;

UPDATE invdetail SET invdetail_ls_id = NULL
 WHERE invdetail_ls_id IS NOT NULL
   AND invdetail_ls_id NOT IN (SELECT ls_id FROM ls);
ALTER TABLE invdetail
  ADD CONSTRAINT invdetail_invdetail_ls_id_fkey FOREIGN KEY (invdetail_ls_id)
      REFERENCES ls (ls_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION;

UPDATE itemloc SET itemloc_ls_id = NULL
 WHERE itemloc_ls_id IS NOT NULL
   AND itemloc_ls_id NOT IN (SELECT ls_id FROM ls);
ALTER TABLE itemloc
  ADD CONSTRAINT itemloc_itemloc_ls_id_fkey FOREIGN KEY (itemloc_ls_id)
      REFERENCES ls (ls_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION;

UPDATE itemlocdist SET itemlocdist_ls_id = NULL
 WHERE itemlocdist_ls_id IS NOT NULL
   AND itemlocdist_ls_id NOT IN (SELECT ls_id FROM ls);
ALTER TABLE itemlocdist
  ADD CONSTRAINT itemlocdist_itemlocdist_ls_id_fkey FOREIGN KEY (itemlocdist_ls_id)
      REFERENCES ls (ls_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION;
