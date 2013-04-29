-- add necessary privs

select xt.add_priv('AccessFooExtension', 'Can Access Foo Extension', 'AccessFooExtension', 'Foo', 'foo', 'Foo', true);
