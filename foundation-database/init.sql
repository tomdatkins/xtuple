--
-- Create the database roles that xTuple software needs for bootstrapping
--

CREATE ROLE xtrole WITH LOGIN; -- bug 29109 says NOLOGIN is problematic

CREATE ROLE admin WITH PASSWORD 'admin'
                       SUPERUSER
                       CREATEDB
                       CREATEROLE
                       LOGIN
                       IN ROLE xtrole;
