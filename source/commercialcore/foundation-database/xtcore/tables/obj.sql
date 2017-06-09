ALTER TABLE xt.obj
   ALTER COLUMN obj_uuid SET DEFAULT xt.uuid_generate_v4();

