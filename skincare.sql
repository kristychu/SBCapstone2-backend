\echo 'Delete and recreate skincare db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE skincare;
CREATE DATABASE skincare;
\connect skincare

\i skincare-schema.sql

\echo 'Delete and recreate skincare_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE skincare_test;
CREATE DATABASE skincare_test;
\connect skincare_test

\i skincare-schema.sql