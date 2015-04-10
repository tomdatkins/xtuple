do $$
begin
if (not exists(select char_id from char where upper(char_name)='VENDORPLANNER')) then
  insert into char
    (char_name, char_items, char_options,
     char_attributes, char_lotserial, char_notes,
     char_customers, char_crmaccounts, char_addresses,
     char_contacts, char_opportunity, char_employees,
     char_mask, char_validator, char_incidents,
     char_type, char_order, char_search,
     char_quotes, char_salesorders, char_invoices,
     char_vendors, char_purchaseorders, char_vouchers, char_projects)
  values
    ('VendorPlanner', false, false,
     false, false, 'xWD Vendor Planner Code',
     false, false, false,
     false, false, false,
     null, null, false,
     0, 0, true,
     false, false, false,
     true, false, false, false);

end if;
end$$;