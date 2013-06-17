-- add necessary privs

select xt.add_priv('MaintainTimeExpenseOthers', 'Allowed to Maintain Time/Exp Sheets for all users', 'PPM', 'TE');
select xt.add_priv('MaintainTimeExpenseSelf', 'Allowed to Maintain Time/Exp Sheets', 'PPM', 'TE');
select xt.add_priv('MaintainTimeExpense', 'Allowed to Maintain Time/Exp Sheets', 'PPM', 'TE');
select xt.add_priv('CanViewRates', 'Allowed to view rates in the Time Entries', 'PPM', 'TE');
select xt.add_priv('MaintainEmpCostAll', 'Allowed to maintain employee costs for all users', 'PPM', 'TE');
select xt.add_priv('MaintainEmpCostSelf', 'Allowed to maintain own employee costs', 'PPM', 'TE');
select xt.add_priv('CanApprove', 'Allowed to Approve Time/Exp Sheets', 'PPM', 'TE');
select xt.add_priv('allowInvoicing', 'Allowed to Invoice Time/Exp Sheets', 'PPM', 'TE');
select xt.add_priv('allowVouchering', 'Allowed to Voucher Time/Exp Sheets', 'PPM', 'TE');
select xt.add_priv('PostTimeSheets', 'Allowed to Post Time Sheets', 'PPM', 'TE');
select xt.add_priv('ViewTimeExpenseHistory', 'Allowed to view Time Expense Sheet history', 'PPM', 'TE');


