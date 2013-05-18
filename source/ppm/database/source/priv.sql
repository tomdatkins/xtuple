-- add necessary privs

select xt.add_priv('AccessPPMExtension', 'Can Access PPM Extension', 'AccessPPMExtension', 'PPM', 'ppm', 'PPM', true);
select xt.add_priv('MaintainTimeExpenseOthers', 'Allowed to Maintain Time/Exp Sheets for all users', 'MaintainTimeExpenseOthers', 'PPM', 'ppm', 'TE', true);
select xt.add_priv('MaintainTimeExpenseSelf', 'Allowed to Maintain Time/Exp Sheets', 'MaintainTimeExpenseSelf', 'PPM', 'ppm', 'TE', true);
select xt.add_priv('MaintainTimeExpense', 'Allowed to Maintain Time/Exp Sheets', 'MaintainTimeExpense', 'PPM', 'ppm', 'TE', true);
select xt.add_priv('CanViewRates', 'Allowed to view rates in the Time Entries', 'CanViewRates', 'PPM', 'ppm', 'TE', true);
select xt.add_priv('MaintainEmpCostAll', 'Allowed to maintain employee costs for all users', 'MaintainEmpCostAll', 'PPM', 'ppm', 'TE', true);
select xt.add_priv('MaintainEmpCostSelf', 'Allowed to maintain own employee costs', 'MaintainEmpCostSelf', 'PPM', 'ppm', 'TE', true);
select xt.add_priv('CanApprove', 'Allowed to Approve Time/Exp Sheets', 'CanApprove', 'PPM', 'ppm', 'TE', true);
select xt.add_priv('allowInvoicing', 'Allowed to Invoice Time/Exp Sheets', 'allowInvoicing', 'PPM', 'ppm', 'TE', true);
select xt.add_priv('allowVouchering', 'Allowed to Voucher Time/Exp Sheets', 'allowVouchering', 'PPM', 'ppm', 'TE', true);
select xt.add_priv('PostTimeSheets', 'Allowed to Post Time Sheets', 'PostTimeSheets', 'PPM', 'ppm', 'TE', true);
select xt.add_priv('ViewTimeExpenseHistory', 'Allowed to view Time Expense Sheet history', 'ViewTimeExpenseHistory', 'PPM', 'ppm', 'TE', true);


