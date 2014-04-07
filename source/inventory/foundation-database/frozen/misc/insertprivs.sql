SELECT createPriv('Inventory', 'CreateInterWarehouseTrans', 'Can Create a Inter-Warehouse Transfer Transaction');
SELECT createPriv('Inventory', 'CreateTransformTrans', 'Can Create Transform Transactions');
SELECT createPriv('Inventory', 'MaintainTransferOrders', 'Can Add/Edit/Delete Transfer Orders');
SELECT createPriv('Inventory', 'OverrideTODate', 'Can Change the Order Date of existing Transfer Orders');
SELECT createPriv('Inventory', 'ReassignLotSerial', 'Can Reassign Lot/Serial #s');
SELECT createPriv('Inventory', 'ReleaseTransferOrders', 'Can Release Transfer Orders from status Unreleased to status Open');
SELECT createPriv('Inventory', 'ViewTransferOrders', 'Can View Transfer Orders');
SELECT createPriv('Products', 'MaintainRevisions', 'Allows users to create revisions and change status.');
SELECT createPriv('Products', 'UseInactiveRevisions', 'Allows users to create orders using inactive revisions.');
SELECT createPriv('Products', 'ViewInactiveRevisions', 'Allows users to view and print inactive revisions.');
SELECT createPriv('Sales', 'MaintainReservations', 'Can modify S/O Reservation quantities.');
SELECT createPriv('Sales', 'MaintainReturns', 'Allows users to create Return Authorizations.');
SELECT createPriv('Sales', 'ViewReturns', 'Allows users to view and print Return Authorizations.');
SELECT createPriv('Schedule', 'CreatePlannedOrders', 'Can Create Planned Orders');
SELECT createPriv('Schedule', 'DeletePlannedOrders', 'Can Delete Planned Orders');
SELECT createPriv('Schedule', 'FirmPlannedOrders', 'Can Firm Planned Orders');
SELECT createPriv('Schedule', 'ReleasePlannedOrders', 'Can Release Planned Orders');
SELECT createPriv('Schedule', 'SoftenPlannedOrders', 'Can Un-Firm Planned Orders');
SELECT createPriv('Schedule', 'ViewPlannedOrders', 'Can View Planned Orders');
SELECT createPriv('System', 'BackupServer', 'Can Perform Server Backup');
SELECT createPriv('System', 'ConfigureBackupServer', 'Can Configure Backup Server Parameters');
SELECT createPriv('System', 'ConfigureEncryption', 'Allowed to view and change the Encryption Key File');
SELECT createPriv('System', 'ConfigureMS', 'Can Configure the M/S Module');
SELECT createPriv('System', 'MaintainRegistrationKey', 'Can Configure the Registration Key');
SELECT createPriv('Products', 'MaintainLotSerialSequences', 'Can modify LotSerial Sequences');
SELECT createPriv('Products', 'ViewLotSerialSequences', 'Can view LotSerial Sequences');
