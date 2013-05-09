-- add necessary privs

select xt.add_priv('AccessPPMExtension', 'Can Access PPM Extension', 'AccessPPMExtension', 'PPM', 'ppm', 'PPM', true);
