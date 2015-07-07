select xt.create_table('vendinfoext','xt');

select xt.add_column('vendinfoext','vendinfoext_id', 'integer', 'primary key');
select xt.add_column('vendinfoext','vendinfoext_potype_id', 'integer');
select xt.add_constraint('vendinfoext', 'vendinfoext_potype_id_fkey', 'foreign key (vendinfoext_potype_id) references xt.potype (potype_id)');

comment on table xt.vendinfoext is 'Vendor extension table';

-- Extend the XM.PurchaseVendorRelation ORM, add purchaseType.
select xt.install_orm(
	'{
    "context": "commercialcore",
    "nameSpace": "XM",
    "type": "PurchaseVendorRelation",
    "table": "xt.vendinfoext",
    "isExtension": true,
    "comment": "Extended by commercialcore",
    "relations": [
      {
        "column": "vendinfoext_id",
        "inverse": "id"
      }
    ],
    "properties": [
      {
        "name": "purchaseType",
        "toOne": {
          "type": "PurchaseType",
          "column": "vendinfoext_potype_id",
          "isNested": true,
          "inverse": "id"
        }
      }
    ],
    "isSystem": true
  }'
);