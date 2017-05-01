select xt.create_table('oldinvbal', 'public');

select xt.add_column('oldinvbal','oldinvbal_id', 'SERIAL', 'PRIMARY KEY', 'public');
select xt.add_column('oldinvbal','oldinvbal_period_id', 'INTEGER', '', 'public');
select xt.add_column('oldinvbal','oldinvbal_itemsite_id', 'INTEGER', '', 'public');
select xt.add_column('oldinvbal','oldinvbal_qoh_beginning', 'NUMERIC(18,6)', 'NOT NULL DEFAULT 0.0', 'public');
select xt.add_column('oldinvbal','oldinvbal_qoh_ending', 'NUMERIC(18,6)', 'NOT NULL DEFAULT 0.0', 'public');
select xt.add_column('oldinvbal','oldinvbal_qty_in', 'NUMERIC(18,6)', 'NOT NULL DEFAULT 0.0', 'public');
select xt.add_column('oldinvbal','oldinvbal_qty_out', 'NUMERIC(18,6)', 'NOT NULL DEFAULT 0.0', 'public');
select xt.add_column('oldinvbal','oldinvbal_value_beginning', 'NUMERIC(12,2)', 'NOT NULL DEFAULT 0.0', 'public');
select xt.add_column('oldinvbal','oldinvbal_value_ending', 'NUMERIC(12,2)', 'NOT NULL DEFAULT 0.0', 'public');
select xt.add_column('oldinvbal','oldinvbal_value_in', 'NUMERIC(12,2)', 'NOT NULL DEFAULT 0.0', 'public');
select xt.add_column('oldinvbal','oldinvbal_value_out', 'NUMERIC(12,2)', 'NOT NULL DEFAULT 0.0', 'public');
select xt.add_column('oldinvbal','oldinvbal_nn_beginning', 'NUMERIC(18,6)', 'NOT NULL DEFAULT 0.0', 'public');
select xt.add_column('oldinvbal','oldinvbal_nn_ending', 'NUMERIC(18,6)', 'NOT NULL DEFAULT 0.0', 'public');
select xt.add_column('oldinvbal','oldinvbal_nn_in', 'NUMERIC(18,6)', 'NOT NULL DEFAULT 0.0', 'public');
select xt.add_column('oldinvbal','oldinvbal_nn_out', 'NUMERIC(18,6)', 'NOT NULL DEFAULT 0.0', 'public');
select xt.add_column('oldinvbal','oldinvbal_nnval_beginning', 'NUMERIC(12,2)', 'NOT NULL DEFAULT 0.0', 'public');
select xt.add_column('oldinvbal','oldinvbal_nnval_ending', 'NUMERIC(12,2)', 'NOT NULL DEFAULT 0.0', 'public');
select xt.add_column('oldinvbal','oldinvbal_nnval_in', 'NUMERIC(12,2)', 'NOT NULL DEFAULT 0.0', 'public');
select xt.add_column('oldinvbal','oldinvbal_nnval_out', 'NUMERIC(12,2)', 'NOT NULL DEFAULT 0.0', 'public');
select xt.add_column('oldinvbal','oldinvbal_dirty', 'BOOLEAN', 'NOT NULL DEFAULT TRUE', 'public');

comment on table oldinvbal is 'Backup table for invbal in case rebuilding does not work as intended';
