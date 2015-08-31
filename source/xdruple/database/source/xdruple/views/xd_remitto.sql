-- View definition for Remit To Info.

select xt.create_view('xdruple.xd_remitto', $$
  SELECT
  ( SELECT metric.metric_value
    FROM metric
    WHERE metric.metric_name = 'remitto_name'::text) AS remitto_name,
  ( SELECT metric.metric_value
    FROM metric
    WHERE metric.metric_name = 'remitto_address1'::text) AS remitto_address1,
  ( SELECT metric.metric_value
    FROM metric
    WHERE metric.metric_name = 'remitto_address2'::text) AS remitto_address2,
  ( SELECT metric.metric_value
    FROM metric
    WHERE metric.metric_name = 'remitto_address3'::text) AS remitto_address3,
  ( SELECT metric.metric_value
    FROM metric
    WHERE metric.metric_name = 'remitto_city'::text) AS remitto_city,
  ( SELECT metric.metric_value
    FROM metric
    WHERE metric.metric_name = 'remitto_state'::text) AS remitto_state,
  ( SELECT metric.metric_value
    FROM metric
    WHERE metric.metric_name = 'remitto_zipcode'::text) AS remitto_zipcode,
  ( SELECT metric.metric_value
    FROM metric
    WHERE metric.metric_name = 'remitto_country'::text) AS remitto_country,
  ( SELECT metric.metric_value
    FROM metric
    WHERE metric.metric_name = 'remitto_phone'::text) AS remitto_phone;
$$, false);
