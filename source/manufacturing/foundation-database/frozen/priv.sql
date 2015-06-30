ALTER TABLE xtmfg.pkgpriv DISABLE TRIGGER ALL;
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('CreateBufferStatus', 'Schedule', 'Can Create the Buffer Status information.');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('MaintainBBOMs', 'Products', 'Can Add/Edit/Delete Breeder BOM Items');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('MaintainBOOs','Products','Can Add/Edit/Delete Bills of Operations');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('MaintainLaborRates','Products','Can Add/Edit/Delete Labor Rates');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('MaintainPlannedSchedules','Schedule','Can change the Planned Schedules.');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('MaintainShifts','System','Can create and modify Shift definitions.');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('MaintainStandardOperations','Products','Can Add/Edit/Delete Standard Operations');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('MaintainWarehouseCalendarExceptions','Schedule','Can maintain warehouse calendar exceptions');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('MaintainWarehouseWorkWeek','Schedule','Can maintain warehouse work week information.');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('MaintainWoOperations','Manufacture','Can Add/Edit/Delete Order Operations');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('MaintainWoTimeClock','Manufacture','Can modify when other Users clocked in and out of Work Orders.');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('MaintainWorkCenters','Products','Can Add/Edit/Delete Work Centers');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('OverrideWOTCTime','Manufacture','Can enter setup and run times that differ from the time recorded by clocking in and out.');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('PostWoOperations','Manufacture','Can Post W/O Operation Progress');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('ViewBBOMs','Products','Can View Breeder BOM Items');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('ViewBOOs','Products','Can View Bills of Operations');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('ViewBreederVariances','Manufacture','Can View Breeder Distribution Variances');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('ViewInventoryBufferStatus','Inventory','Can View Buffer Status information by Inventory.');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('ViewLaborRates','Products','Can View Labor Rates');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('ViewLaborVariances','Manufacture','Can View W/O Operation Variances');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('ViewMPS','Schedule','Can View the Master Planning Schedule');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('ViewProduction','Schedule','Can View Detailed and Summarized Production');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('ViewProductionDemand','Schedule','Can View Detailed and Summarized Production Demand');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('ViewRoughCut','Schedule','Can View the Rough Cut');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('ViewStandardOperations','Products','Can View Standard Operations');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('ViewWarehouseCalendarExceptions','Schedule','Can view warehouse calendar exceptions.');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('ViewWoOperations','Manufacture','Can View Work Order Operations');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('ViewWoTimeClock','Manufacture','Can view when other Users clocked in and out of Work Orders.');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('ViewWorkCenterBufferStatus','Schedule','Can View Buffer Status information by Work Centers.');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('ViewWorkCenterCapacity','Schedule','Can View Detailed and Summarized Work Center Capacities');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('ViewWorkCenterLoad','Schedule','Can View Detailed and Summarized Work Center Loads');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('ViewWorkCenters','Products','Can View Work Centers');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('WoTimeClock','Manufacture','Can clock Users in and out of Work Orders.');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('MaintainOverheadAssignment','Manufacture','Allowed to create and maintain Overhead GL Account Assignments');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('ViewOverheadAssignment','Manufacture','Allowed to view Overhead GL Account Assignments');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('MaintainTimeEntries','Manufacture','Allowed to Maintain Time Clock entries');
insert into xtmfg.pkgpriv (priv_name, priv_module, priv_descrip) values ('PostTimeEntries','Manufacture','Allowed to Post Time Clock entries');
ALTER TABLE xtmfg.pkgpriv ENABLE TRIGGER ALL;