--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = ohrm, public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: hs_hr_config; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_config (
    key character varying(100) NOT NULL,
    value character varying(512) NOT NULL
);


ALTER TABLE hs_hr_config OWNER TO admin;

--
-- Name: hs_hr_country; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_country (
    cou_code character(2) NOT NULL,
    name character varying(80) NOT NULL,
    cou_name character varying(80) NOT NULL,
    iso3 character(3),
    numcode smallint
);


ALTER TABLE hs_hr_country OWNER TO admin;

--
-- Name: hs_hr_currency_type; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_currency_type (
    code integer DEFAULT 0 NOT NULL,
    currency_id character(3) NOT NULL,
    currency_name character varying(70) NOT NULL
);


ALTER TABLE hs_hr_currency_type OWNER TO admin;

--
-- Name: hs_hr_custom_export; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_custom_export (
    export_id integer NOT NULL,
    name character varying(250) NOT NULL,
    fields text,
    headings text
);


ALTER TABLE hs_hr_custom_export OWNER TO admin;

--
-- Name: hs_hr_custom_fields; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_custom_fields (
    field_num integer NOT NULL,
    name character varying(250) NOT NULL,
    type integer NOT NULL,
    screen character varying(100),
    extra_data character varying(250)
);


ALTER TABLE hs_hr_custom_fields OWNER TO admin;

--
-- Name: hs_hr_custom_import; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_custom_import (
    import_id integer NOT NULL,
    name character varying(250) NOT NULL,
    fields text,
    has_heading boolean DEFAULT false
);


ALTER TABLE hs_hr_custom_import OWNER TO admin;

--
-- Name: hs_hr_district; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_district (
    district_code character varying(13) NOT NULL,
    district_name character varying(50),
    province_code character varying(13)
);


ALTER TABLE hs_hr_district OWNER TO admin;

--
-- Name: hs_hr_emp_attachment; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_attachment (
    emp_number integer DEFAULT 0 NOT NULL,
    eattach_id integer DEFAULT 0 NOT NULL,
    eattach_desc character varying(200),
    eattach_filename character varying(100),
    eattach_size integer DEFAULT 0,
    eattach_attachment bytea,
    eattach_type character varying(200),
    screen character varying(100),
    attached_by integer,
    attached_by_name character varying(200),
    attached_time timestamp without time zone NOT NULL
);


ALTER TABLE hs_hr_emp_attachment OWNER TO admin;

--
-- Name: hs_hr_emp_basicsalary; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_basicsalary (
    id integer NOT NULL,
    emp_number integer DEFAULT 0 NOT NULL,
    sal_grd_code integer,
    currency_id character varying(6) NOT NULL,
    ebsal_basic_salary character varying(100),
    payperiod_code character varying(13),
    salary_component character varying(100),
    comments character varying(255)
);


ALTER TABLE hs_hr_emp_basicsalary OWNER TO admin;

--
-- Name: hs_hr_emp_basicsalary_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE hs_hr_emp_basicsalary_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE hs_hr_emp_basicsalary_id_seq OWNER TO admin;

--
-- Name: hs_hr_emp_basicsalary_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE hs_hr_emp_basicsalary_id_seq OWNED BY hs_hr_emp_basicsalary.id;


--
-- Name: hs_hr_emp_children; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_children (
    emp_number integer DEFAULT 0 NOT NULL,
    ec_seqno numeric(2,0) DEFAULT 0 NOT NULL,
    ec_name character varying(100),
    ec_date_of_birth date
);


ALTER TABLE hs_hr_emp_children OWNER TO admin;

--
-- Name: hs_hr_emp_contract_extend; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_contract_extend (
    emp_number integer DEFAULT 0 NOT NULL,
    econ_extend_id numeric(10,0) DEFAULT 0 NOT NULL,
    econ_extend_start_date timestamp without time zone,
    econ_extend_end_date timestamp without time zone
);


ALTER TABLE hs_hr_emp_contract_extend OWNER TO admin;

--
-- Name: hs_hr_emp_dependents; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_dependents (
    emp_number integer DEFAULT 0 NOT NULL,
    ed_seqno numeric(2,0) DEFAULT 0 NOT NULL,
    ed_name character varying(100),
    ed_relationship_type character varying(5),
    ed_relationship character varying(100),
    ed_date_of_birth date
);


ALTER TABLE hs_hr_emp_dependents OWNER TO admin;

--
-- Name: hs_hr_emp_directdebit; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_directdebit (
    id integer NOT NULL,
    salary_id integer NOT NULL,
    dd_routing_num integer NOT NULL,
    dd_account character varying(100) NOT NULL,
    dd_amount numeric(11,2) NOT NULL,
    dd_account_type character varying(20) NOT NULL,
    dd_transaction_type character varying(20) NOT NULL
);


ALTER TABLE hs_hr_emp_directdebit OWNER TO admin;

--
-- Name: COLUMN hs_hr_emp_directdebit.dd_account_type; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN hs_hr_emp_directdebit.dd_account_type IS 'CHECKING, SAVINGS';


--
-- Name: COLUMN hs_hr_emp_directdebit.dd_transaction_type; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN hs_hr_emp_directdebit.dd_transaction_type IS 'BLANK, PERC, FLAT, FLATMINUS';


--
-- Name: hs_hr_emp_directdebit_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE hs_hr_emp_directdebit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE hs_hr_emp_directdebit_id_seq OWNER TO admin;

--
-- Name: hs_hr_emp_directdebit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE hs_hr_emp_directdebit_id_seq OWNED BY hs_hr_emp_directdebit.id;


--
-- Name: hs_hr_emp_emergency_contacts; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_emergency_contacts (
    emp_number integer DEFAULT 0 NOT NULL,
    eec_seqno numeric(2,0) DEFAULT 0 NOT NULL,
    eec_name character varying(100),
    eec_relationship character varying(100),
    eec_home_no character varying(100),
    eec_mobile_no character varying(100),
    eec_office_no character varying(100)
);


ALTER TABLE hs_hr_emp_emergency_contacts OWNER TO admin;

--
-- Name: hs_hr_emp_history_of_ealier_pos; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_history_of_ealier_pos (
    emp_number integer DEFAULT 0 NOT NULL,
    emp_seqno numeric(2,0) DEFAULT 0 NOT NULL,
    ehoep_job_title character varying(100),
    ehoep_years character varying(100)
);


ALTER TABLE hs_hr_emp_history_of_ealier_pos OWNER TO admin;

--
-- Name: hs_hr_emp_language; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_language (
    emp_number integer DEFAULT 0 NOT NULL,
    lang_id integer NOT NULL,
    fluency smallint DEFAULT 0 NOT NULL,
    competency smallint DEFAULT 0,
    comments character varying(100)
);


ALTER TABLE hs_hr_emp_language OWNER TO admin;

--
-- Name: hs_hr_emp_locations; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_locations (
    emp_number integer NOT NULL,
    location_id integer NOT NULL
);


ALTER TABLE hs_hr_emp_locations OWNER TO admin;

--
-- Name: hs_hr_emp_member_detail; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_member_detail (
    emp_number integer DEFAULT 0 NOT NULL,
    membship_code integer DEFAULT 0 NOT NULL,
    ememb_subscript_ownership character varying(20),
    ememb_subscript_amount numeric(15,2),
    ememb_subs_currency character varying(20),
    ememb_commence_date date,
    ememb_renewal_date date
);


ALTER TABLE hs_hr_emp_member_detail OWNER TO admin;

--
-- Name: hs_hr_emp_passport; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_passport (
    emp_number integer DEFAULT 0 NOT NULL,
    ep_seqno numeric(2,0) DEFAULT 0 NOT NULL,
    ep_passport_num character varying(100) NOT NULL,
    ep_passportissueddate timestamp without time zone,
    ep_passportexpiredate timestamp without time zone,
    ep_comments character varying(255),
    ep_passport_type_flg smallint,
    ep_i9_status character varying(100),
    ep_i9_review_date date,
    cou_code character varying(6)
);


ALTER TABLE hs_hr_emp_passport OWNER TO admin;

--
-- Name: hs_hr_emp_picture; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_picture (
    emp_number integer DEFAULT 0 NOT NULL,
    epic_picture bytea,
    epic_filename character varying(100),
    epic_type character varying(50),
    epic_file_size character varying(20),
    epic_file_width character varying(20),
    epic_file_height character varying(20)
);


ALTER TABLE hs_hr_emp_picture OWNER TO admin;

--
-- Name: hs_hr_emp_reportto; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_reportto (
    erep_sup_emp_number integer DEFAULT 0 NOT NULL,
    erep_sub_emp_number integer DEFAULT 0 NOT NULL,
    erep_reporting_mode integer DEFAULT 0 NOT NULL
);


ALTER TABLE hs_hr_emp_reportto OWNER TO admin;

--
-- Name: hs_hr_emp_skill; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_skill (
    emp_number integer DEFAULT 0 NOT NULL,
    skill_id integer NOT NULL,
    years_of_exp numeric(2,0),
    comments character varying(100) NOT NULL
);


ALTER TABLE hs_hr_emp_skill OWNER TO admin;

--
-- Name: hs_hr_emp_us_tax; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_us_tax (
    emp_number integer DEFAULT 0 NOT NULL,
    tax_federal_status character varying(13),
    tax_federal_exceptions integer DEFAULT 0,
    tax_state character varying(13),
    tax_state_status character varying(13),
    tax_state_exceptions integer DEFAULT 0,
    tax_unemp_state character varying(13),
    tax_work_state character varying(13)
);


ALTER TABLE hs_hr_emp_us_tax OWNER TO admin;

--
-- Name: hs_hr_emp_work_experience; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_work_experience (
    emp_number integer DEFAULT 0 NOT NULL,
    eexp_seqno numeric(10,0) DEFAULT 0 NOT NULL,
    eexp_employer character varying(100),
    eexp_jobtit character varying(120),
    eexp_from_date timestamp without time zone,
    eexp_to_date timestamp without time zone,
    eexp_comments character varying(200),
    eexp_internal integer
);


ALTER TABLE hs_hr_emp_work_experience OWNER TO admin;

--
-- Name: hs_hr_employee; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_employee (
    emp_number integer DEFAULT 0 NOT NULL,
    employee_id character varying(50),
    emp_lastname character varying(100) NOT NULL,
    emp_firstname character varying(100) NOT NULL,
    emp_middle_name character varying(100) NOT NULL,
    emp_nick_name character varying(100),
    emp_smoker smallint DEFAULT 0,
    ethnic_race_code character varying(13),
    emp_birthday date,
    nation_code integer,
    emp_gender smallint,
    emp_marital_status character varying(20),
    emp_ssn_num character varying(100),
    emp_sin_num character varying(100),
    emp_other_id character varying(100),
    emp_dri_lice_num character varying(100),
    emp_dri_lice_exp_date date,
    emp_military_service character varying(100),
    emp_status integer,
    job_title_code integer,
    eeo_cat_code integer,
    work_station integer,
    emp_street1 character varying(100),
    emp_street2 character varying(100),
    city_code character varying(100),
    coun_code character varying(100),
    provin_code character varying(100),
    emp_zipcode character varying(20),
    emp_hm_telephone character varying(50),
    emp_mobile character varying(50),
    emp_work_telephone character varying(50),
    emp_work_email character varying(50),
    sal_grd_code character varying(13),
    joined_date date,
    emp_oth_email character varying(50),
    termination_id integer,
    custom1 character varying(250),
    custom2 character varying(250),
    custom3 character varying(250),
    custom4 character varying(250),
    custom5 character varying(250),
    custom6 character varying(250),
    custom7 character varying(250),
    custom8 character varying(250),
    custom9 character varying(250),
    custom10 character varying(250)
);


ALTER TABLE hs_hr_employee OWNER TO admin;

--
-- Name: hs_hr_jobtit_empstat; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_jobtit_empstat (
    jobtit_code integer NOT NULL,
    estat_code integer NOT NULL
);


ALTER TABLE hs_hr_jobtit_empstat OWNER TO admin;

--
-- Name: hs_hr_kpi; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_kpi (
    id integer NOT NULL,
    job_title_code character varying(13),
    description character varying(200),
    rate_min double precision,
    rate_max double precision,
    rate_default boolean DEFAULT false,
    is_active boolean DEFAULT false
);


ALTER TABLE hs_hr_kpi OWNER TO admin;

--
-- Name: hs_hr_mailnotifications; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_mailnotifications (
    user_id integer NOT NULL,
    notification_type_id integer NOT NULL,
    status integer NOT NULL,
    email character varying(100)
);


ALTER TABLE hs_hr_mailnotifications OWNER TO admin;

--
-- Name: hs_hr_module; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_module (
    mod_id character varying(36) NOT NULL,
    name character varying(45),
    owner character varying(45),
    owner_email character varying(100),
    version character varying(36),
    description text
);


ALTER TABLE hs_hr_module OWNER TO admin;

--
-- Name: hs_hr_pay_period; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_pay_period (
    id integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    close_date date NOT NULL,
    check_date date NOT NULL,
    timesheet_aproval_due_date date NOT NULL
);


ALTER TABLE hs_hr_pay_period OWNER TO admin;

--
-- Name: hs_hr_payperiod; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_payperiod (
    payperiod_code character varying(13) NOT NULL,
    payperiod_name character varying(100)
);


ALTER TABLE hs_hr_payperiod OWNER TO admin;

--
-- Name: hs_hr_performance_review; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_performance_review (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    reviewer_id integer NOT NULL,
    creator_id character varying(36),
    job_title_code character varying(10) NOT NULL,
    sub_division_id integer,
    creation_date date NOT NULL,
    period_from date NOT NULL,
    period_to date NOT NULL,
    due_date date NOT NULL,
    state numeric(3,0),
    kpis text
);


ALTER TABLE hs_hr_performance_review OWNER TO admin;

--
-- Name: hs_hr_performance_review_comments; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_performance_review_comments (
    id integer NOT NULL,
    pr_id integer NOT NULL,
    employee_id integer,
    comment text,
    create_date date NOT NULL
);


ALTER TABLE hs_hr_performance_review_comments OWNER TO admin;

--
-- Name: hs_hr_performance_review_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE hs_hr_performance_review_comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE hs_hr_performance_review_comments_id_seq OWNER TO admin;

--
-- Name: hs_hr_performance_review_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE hs_hr_performance_review_comments_id_seq OWNED BY hs_hr_performance_review_comments.id;


--
-- Name: hs_hr_province; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_province (
    id integer NOT NULL,
    province_name character varying(40) NOT NULL,
    province_code character(2) NOT NULL,
    cou_code character(2) DEFAULT 'us'::bpchar NOT NULL
);


ALTER TABLE hs_hr_province OWNER TO admin;

--
-- Name: hs_hr_province_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE hs_hr_province_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE hs_hr_province_id_seq OWNER TO admin;

--
-- Name: hs_hr_province_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE hs_hr_province_id_seq OWNED BY hs_hr_province.id;


--
-- Name: hs_hr_unique_id; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_unique_id (
    id integer NOT NULL,
    last_id integer NOT NULL,
    table_name character varying(50) NOT NULL,
    field_name character varying(50) NOT NULL
);


ALTER TABLE hs_hr_unique_id OWNER TO admin;

--
-- Name: hs_hr_unique_id_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE hs_hr_unique_id_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE hs_hr_unique_id_id_seq OWNER TO admin;

--
-- Name: hs_hr_unique_id_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE hs_hr_unique_id_id_seq OWNED BY hs_hr_unique_id.id;


--
-- Name: ohrm_advanced_report; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_advanced_report (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    definition text NOT NULL
);


ALTER TABLE ohrm_advanced_report OWNER TO admin;

--
-- Name: ohrm_attendance_record; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_attendance_record (
    id bigint NOT NULL,
    employee_id bigint NOT NULL,
    punch_in_utc_time timestamp without time zone,
    punch_in_note character varying(255),
    punch_in_time_offset character varying(255),
    punch_in_user_time timestamp without time zone,
    punch_out_utc_time timestamp without time zone,
    punch_out_note character varying(255),
    punch_out_time_offset character varying(255),
    punch_out_user_time timestamp without time zone,
    state character varying(255) NOT NULL
);


ALTER TABLE ohrm_attendance_record OWNER TO admin;

--
-- Name: ohrm_available_group_field; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_available_group_field (
    report_group_id bigint NOT NULL,
    group_field_id bigint NOT NULL
);


ALTER TABLE ohrm_available_group_field OWNER TO admin;

--
-- Name: ohrm_composite_display_field; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_composite_display_field (
    composite_display_field_id bigint NOT NULL,
    report_group_id bigint NOT NULL,
    name character varying(1000) NOT NULL,
    label character varying(255) NOT NULL,
    field_alias character varying(255),
    is_sortable character varying(10) NOT NULL,
    sort_order character varying(255),
    sort_field character varying(255),
    element_type character varying(255) NOT NULL,
    element_property character varying(1000) NOT NULL,
    width character varying(255) NOT NULL,
    is_exportable character varying(10),
    text_alignment_style character varying(20),
    display_field_group_id integer,
    default_value character varying(255),
    is_value_list boolean DEFAULT false NOT NULL,
    is_encrypted boolean DEFAULT false NOT NULL,
    is_meta boolean DEFAULT false NOT NULL
);


ALTER TABLE ohrm_composite_display_field OWNER TO admin;

--
-- Name: ohrm_composite_display_field_composite_display_field_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_composite_display_field_composite_display_field_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_composite_display_field_composite_display_field_id_seq OWNER TO admin;

--
-- Name: ohrm_composite_display_field_composite_display_field_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_composite_display_field_composite_display_field_id_seq OWNED BY ohrm_composite_display_field.composite_display_field_id;


--
-- Name: ohrm_customer; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_customer (
    customer_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(255),
    is_deleted boolean DEFAULT false
);


ALTER TABLE ohrm_customer OWNER TO admin;

--
-- Name: ohrm_customer_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_customer_customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_customer_customer_id_seq OWNER TO admin;

--
-- Name: ohrm_customer_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_customer_customer_id_seq OWNED BY ohrm_customer.customer_id;


--
-- Name: ohrm_data_group; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_data_group (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    can_read boolean,
    can_create boolean,
    can_update boolean DEFAULT false,
    can_delete boolean DEFAULT false
);


ALTER TABLE ohrm_data_group OWNER TO admin;

--
-- Name: ohrm_data_group_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_data_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_data_group_id_seq OWNER TO admin;

--
-- Name: ohrm_data_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_data_group_id_seq OWNED BY ohrm_data_group.id;


--
-- Name: ohrm_display_field; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_display_field (
    display_field_id bigint NOT NULL,
    report_group_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    label character varying(255) NOT NULL,
    field_alias character varying(255),
    is_sortable character varying(10) NOT NULL,
    sort_order character varying(255),
    sort_field character varying(255),
    element_type character varying(255) NOT NULL,
    element_property character varying(1000) NOT NULL,
    width character varying(255) NOT NULL,
    is_exportable character varying(10),
    text_alignment_style character varying(20),
    display_field_group_id integer,
    default_value character varying(255),
    is_value_list boolean,
    is_encrypted boolean,
    is_meta boolean
);


ALTER TABLE ohrm_display_field OWNER TO admin;

--
-- Name: ohrm_display_field_display_field_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_display_field_display_field_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_display_field_display_field_id_seq OWNER TO admin;

--
-- Name: ohrm_display_field_display_field_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_display_field_display_field_id_seq OWNED BY ohrm_display_field.display_field_id;


--
-- Name: ohrm_display_field_group; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_display_field_group (
    id integer NOT NULL,
    report_group_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    is_list boolean
);


ALTER TABLE ohrm_display_field_group OWNER TO admin;

--
-- Name: ohrm_display_field_group_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_display_field_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_display_field_group_id_seq OWNER TO admin;

--
-- Name: ohrm_display_field_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_display_field_group_id_seq OWNED BY ohrm_display_field_group.id;


--
-- Name: ohrm_education; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_education (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE ohrm_education OWNER TO admin;

--
-- Name: ohrm_education_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_education_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_education_id_seq OWNER TO admin;

--
-- Name: ohrm_education_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_education_id_seq OWNED BY ohrm_education.id;


--
-- Name: ohrm_email; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_email (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE ohrm_email OWNER TO admin;

--
-- Name: ohrm_email_configuration; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_email_configuration (
    id integer NOT NULL,
    mail_type character varying(50),
    sent_as character varying(250) NOT NULL,
    sendmail_path character varying(250),
    smtp_host character varying(250),
    smtp_port integer,
    smtp_username character varying(250),
    smtp_password character varying(250),
    smtp_auth_type character varying(50),
    smtp_security_type character varying(50)
);


ALTER TABLE ohrm_email_configuration OWNER TO admin;

--
-- Name: ohrm_email_configuration_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_email_configuration_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_email_configuration_id_seq OWNER TO admin;

--
-- Name: ohrm_email_configuration_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_email_configuration_id_seq OWNED BY ohrm_email_configuration.id;


--
-- Name: ohrm_email_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_email_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_email_id_seq OWNER TO admin;

--
-- Name: ohrm_email_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_email_id_seq OWNED BY ohrm_email.id;


--
-- Name: ohrm_email_notification; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_email_notification (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    is_enable integer NOT NULL
);


ALTER TABLE ohrm_email_notification OWNER TO admin;

--
-- Name: ohrm_email_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_email_notification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_email_notification_id_seq OWNER TO admin;

--
-- Name: ohrm_email_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_email_notification_id_seq OWNED BY ohrm_email_notification.id;


--
-- Name: ohrm_email_processor; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_email_processor (
    id integer NOT NULL,
    email_id integer NOT NULL,
    class_name character varying(100)
);


ALTER TABLE ohrm_email_processor OWNER TO admin;

--
-- Name: ohrm_email_processor_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_email_processor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_email_processor_id_seq OWNER TO admin;

--
-- Name: ohrm_email_processor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_email_processor_id_seq OWNED BY ohrm_email_processor.id;


--
-- Name: ohrm_email_subscriber; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_email_subscriber (
    id integer NOT NULL,
    notification_id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL
);


ALTER TABLE ohrm_email_subscriber OWNER TO admin;

--
-- Name: ohrm_email_subscriber_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_email_subscriber_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_email_subscriber_id_seq OWNER TO admin;

--
-- Name: ohrm_email_subscriber_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_email_subscriber_id_seq OWNED BY ohrm_email_subscriber.id;


--
-- Name: ohrm_email_template; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_email_template (
    id integer NOT NULL,
    email_id integer NOT NULL,
    locale character varying(20),
    performer_role character varying(50),
    recipient_role character varying(50),
    subject character varying(255),
    body text
);


ALTER TABLE ohrm_email_template OWNER TO admin;

--
-- Name: ohrm_email_template_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_email_template_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_email_template_id_seq OWNER TO admin;

--
-- Name: ohrm_email_template_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_email_template_id_seq OWNED BY ohrm_email_template.id;


--
-- Name: ohrm_emp_education; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_emp_education (
    id integer NOT NULL,
    emp_number integer NOT NULL,
    education_id integer NOT NULL,
    institute character varying(100),
    major character varying(100),
    year numeric(4,0),
    score character varying(25),
    start_date date,
    end_date date
);


ALTER TABLE ohrm_emp_education OWNER TO admin;

--
-- Name: ohrm_emp_education_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_emp_education_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_emp_education_id_seq OWNER TO admin;

--
-- Name: ohrm_emp_education_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_emp_education_id_seq OWNED BY ohrm_emp_education.id;


--
-- Name: ohrm_emp_license; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_emp_license (
    emp_number integer NOT NULL,
    license_id integer NOT NULL,
    license_no character varying(50),
    license_issued_date date,
    license_expiry_date date
);


ALTER TABLE ohrm_emp_license OWNER TO admin;

--
-- Name: ohrm_emp_reporting_method; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_emp_reporting_method (
    reporting_method_id integer NOT NULL,
    reporting_method_name character varying(100) NOT NULL
);


ALTER TABLE ohrm_emp_reporting_method OWNER TO admin;

--
-- Name: ohrm_emp_reporting_method_reporting_method_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_emp_reporting_method_reporting_method_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_emp_reporting_method_reporting_method_id_seq OWNER TO admin;

--
-- Name: ohrm_emp_reporting_method_reporting_method_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_emp_reporting_method_reporting_method_id_seq OWNED BY ohrm_emp_reporting_method.reporting_method_id;


--
-- Name: ohrm_emp_termination; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_emp_termination (
    id integer NOT NULL,
    emp_number integer,
    reason_id integer,
    termination_date date NOT NULL,
    note character varying(255)
);


ALTER TABLE ohrm_emp_termination OWNER TO admin;

--
-- Name: ohrm_emp_termination_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_emp_termination_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_emp_termination_id_seq OWNER TO admin;

--
-- Name: ohrm_emp_termination_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_emp_termination_id_seq OWNED BY ohrm_emp_termination.id;


--
-- Name: ohrm_emp_termination_reason; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_emp_termination_reason (
    id integer NOT NULL,
    name character varying(100)
);


ALTER TABLE ohrm_emp_termination_reason OWNER TO admin;

--
-- Name: ohrm_emp_termination_reason_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_emp_termination_reason_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_emp_termination_reason_id_seq OWNER TO admin;

--
-- Name: ohrm_emp_termination_reason_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_emp_termination_reason_id_seq OWNED BY ohrm_emp_termination_reason.id;


--
-- Name: ohrm_employee_work_shift; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_employee_work_shift (
    work_shift_id integer NOT NULL,
    emp_number integer NOT NULL
);


ALTER TABLE ohrm_employee_work_shift OWNER TO admin;

--
-- Name: ohrm_employee_work_shift_work_shift_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_employee_work_shift_work_shift_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_employee_work_shift_work_shift_id_seq OWNER TO admin;

--
-- Name: ohrm_employee_work_shift_work_shift_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_employee_work_shift_work_shift_id_seq OWNED BY ohrm_employee_work_shift.work_shift_id;


--
-- Name: ohrm_employment_status; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_employment_status (
    id integer NOT NULL,
    name character varying(60) NOT NULL
);


ALTER TABLE ohrm_employment_status OWNER TO admin;

--
-- Name: ohrm_employment_status_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_employment_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_employment_status_id_seq OWNER TO admin;

--
-- Name: ohrm_employment_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_employment_status_id_seq OWNED BY ohrm_employment_status.id;


--
-- Name: ohrm_filter_field; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_filter_field (
    filter_field_id bigint NOT NULL,
    report_group_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    where_clause_part text NOT NULL,
    filter_field_widget character varying(255),
    condition_no integer NOT NULL,
    required character varying(10)
);


ALTER TABLE ohrm_filter_field OWNER TO admin;

--
-- Name: ohrm_group_field; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_group_field (
    group_field_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    group_by_clause text NOT NULL,
    group_field_widget character varying(255)
);


ALTER TABLE ohrm_group_field OWNER TO admin;

--
-- Name: ohrm_holiday; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_holiday (
    id integer NOT NULL,
    description text,
    date date,
    length integer,
    operational_country_id integer,
    recurring boolean DEFAULT false
);


ALTER TABLE ohrm_holiday OWNER TO admin;

--
-- Name: ohrm_holiday_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_holiday_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_holiday_id_seq OWNER TO admin;

--
-- Name: ohrm_holiday_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_holiday_id_seq OWNED BY ohrm_holiday.id;


--
-- Name: ohrm_home_page; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_home_page (
    id integer NOT NULL,
    user_role_id integer NOT NULL,
    action character varying(255),
    enable_class character varying(100),
    priority integer DEFAULT 0 NOT NULL
);


ALTER TABLE ohrm_home_page OWNER TO admin;

--
-- Name: COLUMN ohrm_home_page.priority; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN ohrm_home_page.priority IS 'lowest priority 0';


--
-- Name: ohrm_home_page_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_home_page_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_home_page_id_seq OWNER TO admin;

--
-- Name: ohrm_home_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_home_page_id_seq OWNED BY ohrm_home_page.id;


--
-- Name: ohrm_job_candidate; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_candidate (
    id integer NOT NULL,
    first_name character varying(30) NOT NULL,
    middle_name character varying(30),
    last_name character varying(30) NOT NULL,
    email character varying(100) NOT NULL,
    contact_number character varying(30),
    status integer NOT NULL,
    comment text,
    mode_of_application integer NOT NULL,
    date_of_application date NOT NULL,
    cv_file_id integer,
    cv_text_version text,
    keywords character varying(255),
    added_person integer
);


ALTER TABLE ohrm_job_candidate OWNER TO admin;

--
-- Name: ohrm_job_candidate_attachment; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_candidate_attachment (
    id integer NOT NULL,
    candidate_id integer NOT NULL,
    file_name character varying(200) NOT NULL,
    file_type character varying(200),
    file_size integer NOT NULL,
    file_content bytea,
    attachment_type integer
);


ALTER TABLE ohrm_job_candidate_attachment OWNER TO admin;

--
-- Name: ohrm_job_candidate_attachment_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_job_candidate_attachment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_job_candidate_attachment_id_seq OWNER TO admin;

--
-- Name: ohrm_job_candidate_attachment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_job_candidate_attachment_id_seq OWNED BY ohrm_job_candidate_attachment.id;


--
-- Name: ohrm_job_candidate_history; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_candidate_history (
    id integer NOT NULL,
    candidate_id integer NOT NULL,
    vacancy_id integer,
    candidate_vacancy_name character varying(255),
    interview_id integer,
    action integer NOT NULL,
    performed_by integer,
    performed_date timestamp without time zone NOT NULL,
    note text,
    interviewers character varying(255)
);


ALTER TABLE ohrm_job_candidate_history OWNER TO admin;

--
-- Name: ohrm_job_candidate_history_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_job_candidate_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_job_candidate_history_id_seq OWNER TO admin;

--
-- Name: ohrm_job_candidate_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_job_candidate_history_id_seq OWNED BY ohrm_job_candidate_history.id;


--
-- Name: ohrm_job_candidate_vacancy; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_candidate_vacancy (
    id integer,
    candidate_id integer NOT NULL,
    vacancy_id integer NOT NULL,
    status character varying(100) NOT NULL,
    applied_date date NOT NULL
);


ALTER TABLE ohrm_job_candidate_vacancy OWNER TO admin;

--
-- Name: ohrm_job_category; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_category (
    id integer NOT NULL,
    name character varying(60)
);


ALTER TABLE ohrm_job_category OWNER TO admin;

--
-- Name: ohrm_job_category_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_job_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_job_category_id_seq OWNER TO admin;

--
-- Name: ohrm_job_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_job_category_id_seq OWNED BY ohrm_job_category.id;


--
-- Name: ohrm_job_interview; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_interview (
    id integer NOT NULL,
    candidate_vacancy_id integer,
    candidate_id integer,
    interview_name character varying(100) NOT NULL,
    interview_date date,
    interview_time time without time zone,
    note text
);


ALTER TABLE ohrm_job_interview OWNER TO admin;

--
-- Name: ohrm_job_interview_attachment; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_interview_attachment (
    id integer NOT NULL,
    interview_id integer NOT NULL,
    file_name character varying(200) NOT NULL,
    file_type character varying(200),
    file_size integer NOT NULL,
    file_content bytea,
    attachment_type integer,
    comment character varying(255)
);


ALTER TABLE ohrm_job_interview_attachment OWNER TO admin;

--
-- Name: ohrm_job_interview_attachment_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_job_interview_attachment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_job_interview_attachment_id_seq OWNER TO admin;

--
-- Name: ohrm_job_interview_attachment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_job_interview_attachment_id_seq OWNED BY ohrm_job_interview_attachment.id;


--
-- Name: ohrm_job_interview_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_job_interview_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_job_interview_id_seq OWNER TO admin;

--
-- Name: ohrm_job_interview_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_job_interview_id_seq OWNED BY ohrm_job_interview.id;


--
-- Name: ohrm_job_interview_interviewer; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_interview_interviewer (
    interview_id integer NOT NULL,
    interviewer_id integer NOT NULL
);


ALTER TABLE ohrm_job_interview_interviewer OWNER TO admin;

--
-- Name: ohrm_job_specification_attachment; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_specification_attachment (
    id integer NOT NULL,
    job_title_id integer NOT NULL,
    file_name character varying(200) NOT NULL,
    file_type character varying(200),
    file_size integer NOT NULL,
    file_content bytea
);


ALTER TABLE ohrm_job_specification_attachment OWNER TO admin;

--
-- Name: ohrm_job_specification_attachment_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_job_specification_attachment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_job_specification_attachment_id_seq OWNER TO admin;

--
-- Name: ohrm_job_specification_attachment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_job_specification_attachment_id_seq OWNED BY ohrm_job_specification_attachment.id;


--
-- Name: ohrm_job_title; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_title (
    id integer NOT NULL,
    job_title character varying(100) NOT NULL,
    job_description character varying(400),
    note character varying(400),
    is_deleted boolean DEFAULT false
);


ALTER TABLE ohrm_job_title OWNER TO admin;

--
-- Name: ohrm_job_title_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_job_title_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_job_title_id_seq OWNER TO admin;

--
-- Name: ohrm_job_title_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_job_title_id_seq OWNED BY ohrm_job_title.id;


--
-- Name: ohrm_job_vacancy; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_vacancy (
    id integer NOT NULL,
    job_title_code integer NOT NULL,
    hiring_manager_id integer,
    name character varying(100) NOT NULL,
    description text,
    no_of_positions integer,
    status integer NOT NULL,
    defined_time timestamp without time zone NOT NULL,
    updated_time timestamp without time zone NOT NULL,
    published_in_feed boolean DEFAULT false
);


ALTER TABLE ohrm_job_vacancy OWNER TO admin;

--
-- Name: ohrm_job_vacancy_attachment; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_vacancy_attachment (
    id integer NOT NULL,
    vacancy_id integer NOT NULL,
    file_name character varying(200) NOT NULL,
    file_type character varying(200),
    file_size integer NOT NULL,
    file_content bytea,
    attachment_type integer,
    comment character varying(255)
);


ALTER TABLE ohrm_job_vacancy_attachment OWNER TO admin;

--
-- Name: ohrm_job_vacancy_attachment_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_job_vacancy_attachment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_job_vacancy_attachment_id_seq OWNER TO admin;

--
-- Name: ohrm_job_vacancy_attachment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_job_vacancy_attachment_id_seq OWNED BY ohrm_job_vacancy_attachment.id;


--
-- Name: ohrm_language; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_language (
    id integer NOT NULL,
    name character varying(120)
);


ALTER TABLE ohrm_language OWNER TO admin;

--
-- Name: ohrm_language_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_language_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_language_id_seq OWNER TO admin;

--
-- Name: ohrm_language_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_language_id_seq OWNED BY ohrm_language.id;


--
-- Name: ohrm_leave; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave (
    id integer NOT NULL,
    date date,
    length_hours numeric(6,2),
    length_days numeric(6,4),
    status smallint,
    comments character varying(256),
    leave_request_id integer NOT NULL,
    leave_type_id integer NOT NULL,
    emp_number integer NOT NULL,
    start_time time without time zone,
    end_time time without time zone
);


ALTER TABLE ohrm_leave OWNER TO admin;

--
-- Name: ohrm_leave_adjustment; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_adjustment (
    id integer NOT NULL,
    emp_number integer NOT NULL,
    no_of_days numeric(19,15) NOT NULL,
    leave_type_id integer NOT NULL,
    from_date timestamp without time zone,
    to_date timestamp without time zone,
    credited_date timestamp without time zone,
    note character varying(255),
    adjustment_type integer DEFAULT 0 NOT NULL,
    created_by_id integer,
    created_by_name character varying(255),
    deleted boolean DEFAULT false
);


ALTER TABLE ohrm_leave_adjustment OWNER TO admin;

--
-- Name: ohrm_leave_adjustment_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_adjustment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_leave_adjustment_id_seq OWNER TO admin;

--
-- Name: ohrm_leave_adjustment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_adjustment_id_seq OWNED BY ohrm_leave_adjustment.id;


--
-- Name: ohrm_leave_comment; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_comment (
    id integer NOT NULL,
    leave_id integer NOT NULL,
    created timestamp without time zone,
    created_by_name character varying(255) NOT NULL,
    created_by_id integer,
    created_by_emp_number integer,
    comments character varying(255)
);


ALTER TABLE ohrm_leave_comment OWNER TO admin;

--
-- Name: ohrm_leave_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_leave_comment_id_seq OWNER TO admin;

--
-- Name: ohrm_leave_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_comment_id_seq OWNED BY ohrm_leave_comment.id;


--
-- Name: ohrm_leave_entitlement; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_entitlement (
    id integer NOT NULL,
    emp_number integer NOT NULL,
    no_of_days numeric(19,15) NOT NULL,
    days_used numeric(8,4) DEFAULT 0.0000 NOT NULL,
    leave_type_id integer NOT NULL,
    from_date timestamp without time zone NOT NULL,
    to_date timestamp without time zone,
    credited_date timestamp without time zone,
    note character varying(255),
    entitlement_type integer NOT NULL,
    created_by_id integer,
    created_by_name character varying(255),
    deleted boolean DEFAULT false NOT NULL
);


ALTER TABLE ohrm_leave_entitlement OWNER TO admin;

--
-- Name: ohrm_leave_entitlement_adjustment; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_entitlement_adjustment (
    id integer NOT NULL,
    adjustment_id integer NOT NULL,
    entitlement_id integer NOT NULL,
    length_days numeric(4,2)
);


ALTER TABLE ohrm_leave_entitlement_adjustment OWNER TO admin;

--
-- Name: ohrm_leave_entitlement_adjustment_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_entitlement_adjustment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_leave_entitlement_adjustment_id_seq OWNER TO admin;

--
-- Name: ohrm_leave_entitlement_adjustment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_entitlement_adjustment_id_seq OWNED BY ohrm_leave_entitlement_adjustment.id;


--
-- Name: ohrm_leave_entitlement_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_entitlement_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_leave_entitlement_id_seq OWNER TO admin;

--
-- Name: ohrm_leave_entitlement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_entitlement_id_seq OWNED BY ohrm_leave_entitlement.id;


--
-- Name: ohrm_leave_entitlement_type; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_entitlement_type (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    is_editable boolean DEFAULT false NOT NULL
);


ALTER TABLE ohrm_leave_entitlement_type OWNER TO admin;

--
-- Name: ohrm_leave_entitlement_type_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_entitlement_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_leave_entitlement_type_id_seq OWNER TO admin;

--
-- Name: ohrm_leave_entitlement_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_entitlement_type_id_seq OWNED BY ohrm_leave_entitlement_type.id;


--
-- Name: ohrm_leave_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_leave_id_seq OWNER TO admin;

--
-- Name: ohrm_leave_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_id_seq OWNED BY ohrm_leave.id;


--
-- Name: ohrm_leave_leave_entitlement; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_leave_entitlement (
    id integer NOT NULL,
    leave_id integer NOT NULL,
    entitlement_id integer NOT NULL,
    length_days numeric(6,4)
);


ALTER TABLE ohrm_leave_leave_entitlement OWNER TO admin;

--
-- Name: ohrm_leave_leave_entitlement_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_leave_entitlement_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_leave_leave_entitlement_id_seq OWNER TO admin;

--
-- Name: ohrm_leave_leave_entitlement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_leave_entitlement_id_seq OWNED BY ohrm_leave_leave_entitlement.id;


--
-- Name: ohrm_leave_period_history; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_period_history (
    id integer NOT NULL,
    leave_period_start_month integer NOT NULL,
    leave_period_start_day integer NOT NULL,
    created_at date NOT NULL
);


ALTER TABLE ohrm_leave_period_history OWNER TO admin;

--
-- Name: ohrm_leave_period_history_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_period_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_leave_period_history_id_seq OWNER TO admin;

--
-- Name: ohrm_leave_period_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_period_history_id_seq OWNED BY ohrm_leave_period_history.id;


--
-- Name: ohrm_leave_request; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_request (
    id integer NOT NULL,
    leave_type_id integer NOT NULL,
    date_applied date NOT NULL,
    emp_number integer NOT NULL,
    comments character varying(256)
);


ALTER TABLE ohrm_leave_request OWNER TO admin;

--
-- Name: ohrm_leave_request_comment; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_request_comment (
    id integer NOT NULL,
    leave_request_id integer NOT NULL,
    created timestamp without time zone,
    created_by_name character varying(255) NOT NULL,
    created_by_id integer,
    created_by_emp_number integer,
    comments character varying(255)
);


ALTER TABLE ohrm_leave_request_comment OWNER TO admin;

--
-- Name: ohrm_leave_request_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_request_comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_leave_request_comment_id_seq OWNER TO admin;

--
-- Name: ohrm_leave_request_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_request_comment_id_seq OWNED BY ohrm_leave_request_comment.id;


--
-- Name: ohrm_leave_request_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_request_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_leave_request_id_seq OWNER TO admin;

--
-- Name: ohrm_leave_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_request_id_seq OWNED BY ohrm_leave_request.id;


--
-- Name: ohrm_leave_status; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_status (
    id integer NOT NULL,
    status smallint NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE ohrm_leave_status OWNER TO admin;

--
-- Name: ohrm_leave_status_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_leave_status_id_seq OWNER TO admin;

--
-- Name: ohrm_leave_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_status_id_seq OWNED BY ohrm_leave_status.id;


--
-- Name: ohrm_leave_type; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_type (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    operational_country_id integer,
    deleted boolean DEFAULT false NOT NULL,
    exclude_in_reports_if_no_entitlement boolean DEFAULT false NOT NULL
);


ALTER TABLE ohrm_leave_type OWNER TO admin;

--
-- Name: ohrm_leave_type_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_leave_type_id_seq OWNER TO admin;

--
-- Name: ohrm_leave_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_type_id_seq OWNED BY ohrm_leave_type.id;


--
-- Name: ohrm_license; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_license (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE ohrm_license OWNER TO admin;

--
-- Name: ohrm_license_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_license_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_license_id_seq OWNER TO admin;

--
-- Name: ohrm_license_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_license_id_seq OWNED BY ohrm_license.id;


--
-- Name: ohrm_location; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_location (
    id integer NOT NULL,
    name character varying(110) NOT NULL,
    country_code character varying(3) NOT NULL,
    province character varying(60),
    city character varying(60),
    address character varying(255),
    zip_code character varying(35),
    phone character varying(35),
    fax character varying(35),
    notes character varying(255)
);


ALTER TABLE ohrm_location OWNER TO admin;

--
-- Name: ohrm_location_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_location_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_location_id_seq OWNER TO admin;

--
-- Name: ohrm_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_location_id_seq OWNED BY ohrm_location.id;


--
-- Name: ohrm_membership; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_membership (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE ohrm_membership OWNER TO admin;

--
-- Name: ohrm_membership_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_membership_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_membership_id_seq OWNER TO admin;

--
-- Name: ohrm_membership_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_membership_id_seq OWNED BY ohrm_membership.id;


--
-- Name: ohrm_menu_item; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_menu_item (
    id integer NOT NULL,
    menu_title character varying(255) NOT NULL,
    screen_id integer,
    parent_id integer,
    level numeric(3,0) NOT NULL,
    order_hint integer NOT NULL,
    url_extras character varying(255),
    status boolean DEFAULT true NOT NULL
);


ALTER TABLE ohrm_menu_item OWNER TO admin;

--
-- Name: ohrm_menu_item_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_menu_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_menu_item_id_seq OWNER TO admin;

--
-- Name: ohrm_menu_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_menu_item_id_seq OWNED BY ohrm_menu_item.id;


--
-- Name: ohrm_module; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_module (
    id integer NOT NULL,
    name character varying(120),
    status boolean DEFAULT true NOT NULL
);


ALTER TABLE ohrm_module OWNER TO admin;

--
-- Name: ohrm_module_default_page; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_module_default_page (
    id integer NOT NULL,
    module_id integer NOT NULL,
    user_role_id integer NOT NULL,
    action character varying(255),
    enable_class character varying(100),
    priority integer DEFAULT 0 NOT NULL
);


ALTER TABLE ohrm_module_default_page OWNER TO admin;

--
-- Name: COLUMN ohrm_module_default_page.priority; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN ohrm_module_default_page.priority IS 'lowest priority 0';


--
-- Name: ohrm_module_default_page_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_module_default_page_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_module_default_page_id_seq OWNER TO admin;

--
-- Name: ohrm_module_default_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_module_default_page_id_seq OWNED BY ohrm_module_default_page.id;


--
-- Name: ohrm_module_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_module_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_module_id_seq OWNER TO admin;

--
-- Name: ohrm_module_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_module_id_seq OWNED BY ohrm_module.id;


--
-- Name: ohrm_nationality; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_nationality (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE ohrm_nationality OWNER TO admin;

--
-- Name: ohrm_nationality_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_nationality_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_nationality_id_seq OWNER TO admin;

--
-- Name: ohrm_nationality_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_nationality_id_seq OWNED BY ohrm_nationality.id;


--
-- Name: ohrm_operational_country; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_operational_country (
    id integer NOT NULL,
    country_code character(2)
);


ALTER TABLE ohrm_operational_country OWNER TO admin;

--
-- Name: ohrm_operational_country_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_operational_country_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_operational_country_id_seq OWNER TO admin;

--
-- Name: ohrm_operational_country_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_operational_country_id_seq OWNED BY ohrm_operational_country.id;


--
-- Name: ohrm_organization_gen_info; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_organization_gen_info (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    tax_id character varying(30),
    registration_number character varying(30),
    phone character varying(30),
    fax character varying(30),
    email character varying(30),
    country character varying(30),
    province character varying(30),
    city character varying(30),
    zip_code character varying(30),
    street1 character varying(100),
    street2 character varying(100),
    note character varying(255)
);


ALTER TABLE ohrm_organization_gen_info OWNER TO admin;

--
-- Name: ohrm_organization_gen_info_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_organization_gen_info_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_organization_gen_info_id_seq OWNER TO admin;

--
-- Name: ohrm_organization_gen_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_organization_gen_info_id_seq OWNED BY ohrm_organization_gen_info.id;


--
-- Name: ohrm_pay_grade; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_pay_grade (
    id integer NOT NULL,
    name character varying(60)
);


ALTER TABLE ohrm_pay_grade OWNER TO admin;

--
-- Name: ohrm_pay_grade_currency; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_pay_grade_currency (
    pay_grade_id integer NOT NULL,
    currency_id character varying(6) NOT NULL,
    min_salary double precision,
    max_salary double precision
);


ALTER TABLE ohrm_pay_grade_currency OWNER TO admin;

--
-- Name: ohrm_pay_grade_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_pay_grade_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_pay_grade_id_seq OWNER TO admin;

--
-- Name: ohrm_pay_grade_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_pay_grade_id_seq OWNED BY ohrm_pay_grade.id;


--
-- Name: ohrm_project; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_project (
    project_id integer NOT NULL,
    customer_id integer NOT NULL,
    name character varying(100),
    description character varying(256),
    is_deleted boolean DEFAULT false
);


ALTER TABLE ohrm_project OWNER TO admin;

--
-- Name: ohrm_project_activity; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_project_activity (
    activity_id integer NOT NULL,
    project_id integer NOT NULL,
    name character varying(110),
    is_deleted boolean DEFAULT false
);


ALTER TABLE ohrm_project_activity OWNER TO admin;

--
-- Name: ohrm_project_activity_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_project_activity_activity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_project_activity_activity_id_seq OWNER TO admin;

--
-- Name: ohrm_project_activity_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_project_activity_activity_id_seq OWNED BY ohrm_project_activity.activity_id;


--
-- Name: ohrm_project_admin; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_project_admin (
    project_id integer NOT NULL,
    emp_number integer NOT NULL
);


ALTER TABLE ohrm_project_admin OWNER TO admin;

--
-- Name: ohrm_project_project_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_project_project_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_project_project_id_seq OWNER TO admin;

--
-- Name: ohrm_project_project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_project_project_id_seq OWNED BY ohrm_project.project_id;


--
-- Name: ohrm_report; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_report (
    report_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    report_group_id bigint NOT NULL,
    type character varying(255),
    use_filter_field boolean DEFAULT false NOT NULL
);


ALTER TABLE ohrm_report OWNER TO admin;

--
-- Name: ohrm_report_group; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_report_group (
    report_group_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    core_sql text NOT NULL
);


ALTER TABLE ohrm_report_group OWNER TO admin;

--
-- Name: ohrm_report_report_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_report_report_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_report_report_id_seq OWNER TO admin;

--
-- Name: ohrm_report_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_report_report_id_seq OWNED BY ohrm_report.report_id;


--
-- Name: ohrm_role_user_selection_rule; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_role_user_selection_rule (
    user_role_id integer NOT NULL,
    selection_rule_id integer NOT NULL,
    configurable_params text
);


ALTER TABLE ohrm_role_user_selection_rule OWNER TO admin;

--
-- Name: ohrm_screen; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_screen (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    module_id integer NOT NULL,
    action_url character varying(255) NOT NULL
);


ALTER TABLE ohrm_screen OWNER TO admin;

--
-- Name: ohrm_screen_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_screen_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_screen_id_seq OWNER TO admin;

--
-- Name: ohrm_screen_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_screen_id_seq OWNED BY ohrm_screen.id;


--
-- Name: ohrm_selected_composite_display_field; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_selected_composite_display_field (
    id bigint NOT NULL,
    composite_display_field_id bigint NOT NULL,
    report_id bigint NOT NULL
);


ALTER TABLE ohrm_selected_composite_display_field OWNER TO admin;

--
-- Name: ohrm_selected_display_field; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_selected_display_field (
    id bigint NOT NULL,
    display_field_id bigint NOT NULL,
    report_id bigint NOT NULL
);


ALTER TABLE ohrm_selected_display_field OWNER TO admin;

--
-- Name: ohrm_selected_display_field_group; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_selected_display_field_group (
    id integer NOT NULL,
    report_id bigint NOT NULL,
    display_field_group_id integer NOT NULL
);


ALTER TABLE ohrm_selected_display_field_group OWNER TO admin;

--
-- Name: ohrm_selected_display_field_group_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_selected_display_field_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_selected_display_field_group_id_seq OWNER TO admin;

--
-- Name: ohrm_selected_display_field_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_selected_display_field_group_id_seq OWNED BY ohrm_selected_display_field_group.id;


--
-- Name: ohrm_selected_display_field_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_selected_display_field_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_selected_display_field_id_seq OWNER TO admin;

--
-- Name: ohrm_selected_display_field_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_selected_display_field_id_seq OWNED BY ohrm_selected_display_field.id;


--
-- Name: ohrm_selected_filter_field; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_selected_filter_field (
    report_id bigint NOT NULL,
    filter_field_id bigint NOT NULL,
    filter_field_order bigint NOT NULL,
    value1 character varying(255),
    value2 character varying(255),
    where_condition character varying(255),
    type character varying(255) NOT NULL
);


ALTER TABLE ohrm_selected_filter_field OWNER TO admin;

--
-- Name: ohrm_selected_group_field; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_selected_group_field (
    group_field_id bigint NOT NULL,
    summary_display_field_id bigint NOT NULL,
    report_id bigint NOT NULL
);


ALTER TABLE ohrm_selected_group_field OWNER TO admin;

--
-- Name: ohrm_skill; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_skill (
    id integer NOT NULL,
    name character varying(120),
    description text
);


ALTER TABLE ohrm_skill OWNER TO admin;

--
-- Name: ohrm_skill_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_skill_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_skill_id_seq OWNER TO admin;

--
-- Name: ohrm_skill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_skill_id_seq OWNED BY ohrm_skill.id;


--
-- Name: ohrm_subunit; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_subunit (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    unit_id character varying(100),
    description character varying(400),
    lft smallint,
    rgt smallint,
    level smallint
);


ALTER TABLE ohrm_subunit OWNER TO admin;

--
-- Name: ohrm_subunit_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_subunit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_subunit_id_seq OWNER TO admin;

--
-- Name: ohrm_subunit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_subunit_id_seq OWNED BY ohrm_subunit.id;


--
-- Name: ohrm_summary_display_field; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_summary_display_field (
    summary_display_field_id bigint NOT NULL,
    function character varying(1000) NOT NULL,
    label character varying(255) NOT NULL,
    field_alias character varying(255),
    sort_order character varying(255),
    sort_field character varying(255),
    element_type character varying(255) NOT NULL,
    element_property character varying(1000) NOT NULL,
    width character varying(255) NOT NULL,
    is_exportable character varying(10),
    text_alignment_style character varying(20),
    display_field_group_id integer,
    default_value character varying(255),
    is_sortable boolean DEFAULT false NOT NULL,
    is_value_list boolean DEFAULT false NOT NULL
);


ALTER TABLE ohrm_summary_display_field OWNER TO admin;

--
-- Name: ohrm_timesheet; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_timesheet (
    timesheet_id bigint NOT NULL,
    state character varying(255) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    employee_id bigint NOT NULL
);


ALTER TABLE ohrm_timesheet OWNER TO admin;

--
-- Name: ohrm_timesheet_action_log; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_timesheet_action_log (
    timesheet_action_log_id bigint NOT NULL,
    comment character varying(255),
    action character varying(255),
    date_time date NOT NULL,
    performed_by integer NOT NULL,
    timesheet_id bigint NOT NULL
);


ALTER TABLE ohrm_timesheet_action_log OWNER TO admin;

--
-- Name: ohrm_timesheet_item; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_timesheet_item (
    timesheet_item_id bigint NOT NULL,
    timesheet_id bigint NOT NULL,
    date date NOT NULL,
    duration bigint,
    comment text,
    project_id bigint NOT NULL,
    employee_id bigint NOT NULL,
    activity_id bigint NOT NULL
);


ALTER TABLE ohrm_timesheet_item OWNER TO admin;

--
-- Name: ohrm_upgrade_history; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_upgrade_history (
    id integer NOT NULL,
    start_version character varying(30),
    end_version character varying(30),
    start_increment integer NOT NULL,
    end_increment integer NOT NULL,
    upgraded_date timestamp without time zone
);


ALTER TABLE ohrm_upgrade_history OWNER TO admin;

--
-- Name: ohrm_upgrade_history_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_upgrade_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_upgrade_history_id_seq OWNER TO admin;

--
-- Name: ohrm_upgrade_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_upgrade_history_id_seq OWNED BY ohrm_upgrade_history.id;


--
-- Name: ohrm_user; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_user (
    id integer NOT NULL,
    user_role_id integer NOT NULL,
    emp_number integer,
    user_name character varying(40),
    user_password character varying(40),
    date_entered timestamp without time zone,
    date_modified timestamp without time zone,
    modified_user_id integer,
    created_by integer,
    deleted boolean DEFAULT false NOT NULL,
    status boolean DEFAULT true NOT NULL
);


ALTER TABLE ohrm_user OWNER TO admin;

--
-- Name: ohrm_user_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_user_id_seq OWNER TO admin;

--
-- Name: ohrm_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_user_id_seq OWNED BY ohrm_user.id;


--
-- Name: ohrm_user_role; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_user_role (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    display_name character varying(255) NOT NULL,
    is_assignable boolean DEFAULT false,
    is_predefined boolean DEFAULT false
);


ALTER TABLE ohrm_user_role OWNER TO admin;

--
-- Name: ohrm_user_role_data_group; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_user_role_data_group (
    id integer NOT NULL,
    user_role_id integer,
    data_group_id integer,
    can_read boolean DEFAULT false,
    can_create boolean DEFAULT false,
    can_update boolean DEFAULT false,
    can_delete boolean DEFAULT false,
    self boolean DEFAULT false
);


ALTER TABLE ohrm_user_role_data_group OWNER TO admin;

--
-- Name: ohrm_user_role_data_group_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_user_role_data_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_user_role_data_group_id_seq OWNER TO admin;

--
-- Name: ohrm_user_role_data_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_user_role_data_group_id_seq OWNED BY ohrm_user_role_data_group.id;


--
-- Name: ohrm_user_role_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_user_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_user_role_id_seq OWNER TO admin;

--
-- Name: ohrm_user_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_user_role_id_seq OWNED BY ohrm_user_role.id;


--
-- Name: ohrm_user_role_screen; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_user_role_screen (
    id integer NOT NULL,
    user_role_id integer NOT NULL,
    screen_id integer NOT NULL,
    can_read boolean DEFAULT false NOT NULL,
    can_create boolean DEFAULT false NOT NULL,
    can_update boolean DEFAULT false NOT NULL,
    can_delete boolean DEFAULT false NOT NULL
);


ALTER TABLE ohrm_user_role_screen OWNER TO admin;

--
-- Name: ohrm_user_role_screen_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_user_role_screen_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_user_role_screen_id_seq OWNER TO admin;

--
-- Name: ohrm_user_role_screen_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_user_role_screen_id_seq OWNED BY ohrm_user_role_screen.id;


--
-- Name: ohrm_user_selection_rule; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_user_selection_rule (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    implementation_class character varying(255) NOT NULL,
    rule_xml_data text
);


ALTER TABLE ohrm_user_selection_rule OWNER TO admin;

--
-- Name: ohrm_user_selection_rule_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_user_selection_rule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_user_selection_rule_id_seq OWNER TO admin;

--
-- Name: ohrm_user_selection_rule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_user_selection_rule_id_seq OWNED BY ohrm_user_selection_rule.id;


--
-- Name: ohrm_work_shift; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_work_shift (
    id integer NOT NULL,
    name character varying(250) NOT NULL,
    hours_per_day numeric(4,2) NOT NULL
);


ALTER TABLE ohrm_work_shift OWNER TO admin;

--
-- Name: ohrm_work_shift_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_work_shift_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_work_shift_id_seq OWNER TO admin;

--
-- Name: ohrm_work_shift_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_work_shift_id_seq OWNED BY ohrm_work_shift.id;


--
-- Name: ohrm_work_week; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_work_week (
    id integer NOT NULL,
    operational_country_id integer,
    sat numeric(3,0) DEFAULT 0 NOT NULL,
    sun numeric(3,0) DEFAULT 0 NOT NULL,
    mon numeric(3,0) DEFAULT 0 NOT NULL,
    tue numeric(3,0) DEFAULT 0 NOT NULL,
    wed numeric(3,0) DEFAULT 0 NOT NULL,
    thu numeric(3,0) DEFAULT 0 NOT NULL,
    fri numeric(3,0) DEFAULT 0 NOT NULL
);


ALTER TABLE ohrm_work_week OWNER TO admin;

--
-- Name: ohrm_work_week_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_work_week_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_work_week_id_seq OWNER TO admin;

--
-- Name: ohrm_work_week_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_work_week_id_seq OWNED BY ohrm_work_week.id;


--
-- Name: ohrm_workflow_state_machine; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_workflow_state_machine (
    id bigint NOT NULL,
    workflow character varying(255) NOT NULL,
    state character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    action character varying(255) NOT NULL,
    resulting_state character varying(255) NOT NULL,
    roles_to_notify text,
    priority integer DEFAULT 0 NOT NULL
);


ALTER TABLE ohrm_workflow_state_machine OWNER TO admin;

--
-- Name: COLUMN ohrm_workflow_state_machine.priority; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN ohrm_workflow_state_machine.priority IS 'lowest priority 0';


--
-- Name: ohrm_workflow_state_machine_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_workflow_state_machine_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ohrm_workflow_state_machine_id_seq OWNER TO admin;

--
-- Name: ohrm_workflow_state_machine_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_workflow_state_machine_id_seq OWNED BY ohrm_workflow_state_machine.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_basicsalary ALTER COLUMN id SET DEFAULT nextval('hs_hr_emp_basicsalary_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_directdebit ALTER COLUMN id SET DEFAULT nextval('hs_hr_emp_directdebit_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_performance_review_comments ALTER COLUMN id SET DEFAULT nextval('hs_hr_performance_review_comments_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_province ALTER COLUMN id SET DEFAULT nextval('hs_hr_province_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_unique_id ALTER COLUMN id SET DEFAULT nextval('hs_hr_unique_id_id_seq'::regclass);


--
-- Name: composite_display_field_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_composite_display_field ALTER COLUMN composite_display_field_id SET DEFAULT nextval('ohrm_composite_display_field_composite_display_field_id_seq'::regclass);


--
-- Name: customer_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_customer ALTER COLUMN customer_id SET DEFAULT nextval('ohrm_customer_customer_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_data_group ALTER COLUMN id SET DEFAULT nextval('ohrm_data_group_id_seq'::regclass);


--
-- Name: display_field_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_display_field ALTER COLUMN display_field_id SET DEFAULT nextval('ohrm_display_field_display_field_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_display_field_group ALTER COLUMN id SET DEFAULT nextval('ohrm_display_field_group_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_education ALTER COLUMN id SET DEFAULT nextval('ohrm_education_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_email ALTER COLUMN id SET DEFAULT nextval('ohrm_email_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_email_configuration ALTER COLUMN id SET DEFAULT nextval('ohrm_email_configuration_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_email_notification ALTER COLUMN id SET DEFAULT nextval('ohrm_email_notification_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_email_processor ALTER COLUMN id SET DEFAULT nextval('ohrm_email_processor_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_email_subscriber ALTER COLUMN id SET DEFAULT nextval('ohrm_email_subscriber_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_email_template ALTER COLUMN id SET DEFAULT nextval('ohrm_email_template_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_emp_education ALTER COLUMN id SET DEFAULT nextval('ohrm_emp_education_id_seq'::regclass);


--
-- Name: reporting_method_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_emp_reporting_method ALTER COLUMN reporting_method_id SET DEFAULT nextval('ohrm_emp_reporting_method_reporting_method_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_emp_termination ALTER COLUMN id SET DEFAULT nextval('ohrm_emp_termination_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_emp_termination_reason ALTER COLUMN id SET DEFAULT nextval('ohrm_emp_termination_reason_id_seq'::regclass);


--
-- Name: work_shift_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_employee_work_shift ALTER COLUMN work_shift_id SET DEFAULT nextval('ohrm_employee_work_shift_work_shift_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_employment_status ALTER COLUMN id SET DEFAULT nextval('ohrm_employment_status_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_holiday ALTER COLUMN id SET DEFAULT nextval('ohrm_holiday_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_home_page ALTER COLUMN id SET DEFAULT nextval('ohrm_home_page_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_candidate_attachment ALTER COLUMN id SET DEFAULT nextval('ohrm_job_candidate_attachment_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_candidate_history ALTER COLUMN id SET DEFAULT nextval('ohrm_job_candidate_history_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_category ALTER COLUMN id SET DEFAULT nextval('ohrm_job_category_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_interview ALTER COLUMN id SET DEFAULT nextval('ohrm_job_interview_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_interview_attachment ALTER COLUMN id SET DEFAULT nextval('ohrm_job_interview_attachment_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_specification_attachment ALTER COLUMN id SET DEFAULT nextval('ohrm_job_specification_attachment_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_title ALTER COLUMN id SET DEFAULT nextval('ohrm_job_title_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_vacancy_attachment ALTER COLUMN id SET DEFAULT nextval('ohrm_job_vacancy_attachment_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_language ALTER COLUMN id SET DEFAULT nextval('ohrm_language_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_adjustment ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_adjustment_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_comment ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_comment_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_entitlement ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_entitlement_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_entitlement_adjustment ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_entitlement_adjustment_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_entitlement_type ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_entitlement_type_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_leave_entitlement ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_leave_entitlement_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_period_history ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_period_history_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_request ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_request_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_request_comment ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_request_comment_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_status ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_status_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_type ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_type_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_license ALTER COLUMN id SET DEFAULT nextval('ohrm_license_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_location ALTER COLUMN id SET DEFAULT nextval('ohrm_location_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_membership ALTER COLUMN id SET DEFAULT nextval('ohrm_membership_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_menu_item ALTER COLUMN id SET DEFAULT nextval('ohrm_menu_item_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_module ALTER COLUMN id SET DEFAULT nextval('ohrm_module_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_module_default_page ALTER COLUMN id SET DEFAULT nextval('ohrm_module_default_page_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_nationality ALTER COLUMN id SET DEFAULT nextval('ohrm_nationality_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_operational_country ALTER COLUMN id SET DEFAULT nextval('ohrm_operational_country_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_organization_gen_info ALTER COLUMN id SET DEFAULT nextval('ohrm_organization_gen_info_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_pay_grade ALTER COLUMN id SET DEFAULT nextval('ohrm_pay_grade_id_seq'::regclass);


--
-- Name: project_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_project ALTER COLUMN project_id SET DEFAULT nextval('ohrm_project_project_id_seq'::regclass);


--
-- Name: activity_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_project_activity ALTER COLUMN activity_id SET DEFAULT nextval('ohrm_project_activity_activity_id_seq'::regclass);


--
-- Name: report_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_report ALTER COLUMN report_id SET DEFAULT nextval('ohrm_report_report_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_screen ALTER COLUMN id SET DEFAULT nextval('ohrm_screen_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_selected_display_field ALTER COLUMN id SET DEFAULT nextval('ohrm_selected_display_field_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_selected_display_field_group ALTER COLUMN id SET DEFAULT nextval('ohrm_selected_display_field_group_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_skill ALTER COLUMN id SET DEFAULT nextval('ohrm_skill_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_subunit ALTER COLUMN id SET DEFAULT nextval('ohrm_subunit_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_upgrade_history ALTER COLUMN id SET DEFAULT nextval('ohrm_upgrade_history_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_user ALTER COLUMN id SET DEFAULT nextval('ohrm_user_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_user_role ALTER COLUMN id SET DEFAULT nextval('ohrm_user_role_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_user_role_data_group ALTER COLUMN id SET DEFAULT nextval('ohrm_user_role_data_group_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_user_role_screen ALTER COLUMN id SET DEFAULT nextval('ohrm_user_role_screen_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_user_selection_rule ALTER COLUMN id SET DEFAULT nextval('ohrm_user_selection_rule_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_work_shift ALTER COLUMN id SET DEFAULT nextval('ohrm_work_shift_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_work_week ALTER COLUMN id SET DEFAULT nextval('ohrm_work_week_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_workflow_state_machine ALTER COLUMN id SET DEFAULT nextval('ohrm_workflow_state_machine_id_seq'::regclass);


--
-- Name: pk_hs_hr_config; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_config
    ADD CONSTRAINT pk_hs_hr_config PRIMARY KEY (key);


--
-- Name: pk_hs_hr_country; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_country
    ADD CONSTRAINT pk_hs_hr_country PRIMARY KEY (cou_code);


--
-- Name: pk_hs_hr_currency_type; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_currency_type
    ADD CONSTRAINT pk_hs_hr_currency_type PRIMARY KEY (currency_id);


--
-- Name: pk_hs_hr_custom_export; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_custom_export
    ADD CONSTRAINT pk_hs_hr_custom_export PRIMARY KEY (export_id);


--
-- Name: pk_hs_hr_custom_fields; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_custom_fields
    ADD CONSTRAINT pk_hs_hr_custom_fields PRIMARY KEY (field_num);


--
-- Name: pk_hs_hr_custom_import; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_custom_import
    ADD CONSTRAINT pk_hs_hr_custom_import PRIMARY KEY (import_id);


--
-- Name: pk_hs_hr_district; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_district
    ADD CONSTRAINT pk_hs_hr_district PRIMARY KEY (district_code);


--
-- Name: pk_hs_hr_emp_attachment; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_attachment
    ADD CONSTRAINT pk_hs_hr_emp_attachment PRIMARY KEY (emp_number, eattach_id);


--
-- Name: pk_hs_hr_emp_basicsalary; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_basicsalary
    ADD CONSTRAINT pk_hs_hr_emp_basicsalary PRIMARY KEY (id);


--
-- Name: pk_hs_hr_emp_children; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_children
    ADD CONSTRAINT pk_hs_hr_emp_children PRIMARY KEY (emp_number, ec_seqno);


--
-- Name: pk_hs_hr_emp_contract_extend; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_contract_extend
    ADD CONSTRAINT pk_hs_hr_emp_contract_extend PRIMARY KEY (emp_number, econ_extend_id);


--
-- Name: pk_hs_hr_emp_dependents; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_dependents
    ADD CONSTRAINT pk_hs_hr_emp_dependents PRIMARY KEY (emp_number, ed_seqno);


--
-- Name: pk_hs_hr_emp_directdebit; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_directdebit
    ADD CONSTRAINT pk_hs_hr_emp_directdebit PRIMARY KEY (id);


--
-- Name: pk_hs_hr_emp_emergency_contacts; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_emergency_contacts
    ADD CONSTRAINT pk_hs_hr_emp_emergency_contacts PRIMARY KEY (emp_number, eec_seqno);


--
-- Name: pk_hs_hr_emp_history_of_ealier_pos; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_history_of_ealier_pos
    ADD CONSTRAINT pk_hs_hr_emp_history_of_ealier_pos PRIMARY KEY (emp_number, emp_seqno);


--
-- Name: pk_hs_hr_emp_language; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_language
    ADD CONSTRAINT pk_hs_hr_emp_language PRIMARY KEY (emp_number, lang_id, fluency);


--
-- Name: pk_hs_hr_emp_locations; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_locations
    ADD CONSTRAINT pk_hs_hr_emp_locations PRIMARY KEY (emp_number, location_id);


--
-- Name: pk_hs_hr_emp_member_detail; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_member_detail
    ADD CONSTRAINT pk_hs_hr_emp_member_detail PRIMARY KEY (emp_number, membship_code);


--
-- Name: pk_hs_hr_emp_passport; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_passport
    ADD CONSTRAINT pk_hs_hr_emp_passport PRIMARY KEY (emp_number, ep_seqno);


--
-- Name: pk_hs_hr_emp_picture; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_picture
    ADD CONSTRAINT pk_hs_hr_emp_picture PRIMARY KEY (emp_number);


--
-- Name: pk_hs_hr_emp_reportto; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_reportto
    ADD CONSTRAINT pk_hs_hr_emp_reportto PRIMARY KEY (erep_sup_emp_number, erep_sub_emp_number, erep_reporting_mode);


--
-- Name: pk_hs_hr_emp_us_tax; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_us_tax
    ADD CONSTRAINT pk_hs_hr_emp_us_tax PRIMARY KEY (emp_number);


--
-- Name: pk_hs_hr_emp_work_experience; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_work_experience
    ADD CONSTRAINT pk_hs_hr_emp_work_experience PRIMARY KEY (emp_number, eexp_seqno);


--
-- Name: pk_hs_hr_employee; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_employee
    ADD CONSTRAINT pk_hs_hr_employee PRIMARY KEY (emp_number);


--
-- Name: pk_hs_hr_jobtit_empstat; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_jobtit_empstat
    ADD CONSTRAINT pk_hs_hr_jobtit_empstat PRIMARY KEY (jobtit_code, estat_code);


--
-- Name: pk_hs_hr_kpi; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_kpi
    ADD CONSTRAINT pk_hs_hr_kpi PRIMARY KEY (id);


--
-- Name: pk_hs_hr_module; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_module
    ADD CONSTRAINT pk_hs_hr_module PRIMARY KEY (mod_id);


--
-- Name: pk_hs_hr_pay_period; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_pay_period
    ADD CONSTRAINT pk_hs_hr_pay_period PRIMARY KEY (id);


--
-- Name: pk_hs_hr_payperiod; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_payperiod
    ADD CONSTRAINT pk_hs_hr_payperiod PRIMARY KEY (payperiod_code);


--
-- Name: pk_hs_hr_performance_review; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_performance_review
    ADD CONSTRAINT pk_hs_hr_performance_review PRIMARY KEY (id);


--
-- Name: pk_hs_hr_performance_review_comments; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_performance_review_comments
    ADD CONSTRAINT pk_hs_hr_performance_review_comments PRIMARY KEY (id);


--
-- Name: pk_hs_hr_province; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_province
    ADD CONSTRAINT pk_hs_hr_province PRIMARY KEY (id);


--
-- Name: pk_hs_hr_unique_id; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_unique_id
    ADD CONSTRAINT pk_hs_hr_unique_id PRIMARY KEY (id);


--
-- Name: pk_ohrm_advanced_report; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_advanced_report
    ADD CONSTRAINT pk_ohrm_advanced_report PRIMARY KEY (id);


--
-- Name: pk_ohrm_attendance_record; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_attendance_record
    ADD CONSTRAINT pk_ohrm_attendance_record PRIMARY KEY (id);


--
-- Name: pk_ohrm_available_group_field; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_available_group_field
    ADD CONSTRAINT pk_ohrm_available_group_field PRIMARY KEY (report_group_id, group_field_id);


--
-- Name: pk_ohrm_composite_display_field; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_composite_display_field
    ADD CONSTRAINT pk_ohrm_composite_display_field PRIMARY KEY (composite_display_field_id);


--
-- Name: pk_ohrm_customer; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_customer
    ADD CONSTRAINT pk_ohrm_customer PRIMARY KEY (customer_id);


--
-- Name: pk_ohrm_data_group; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_data_group
    ADD CONSTRAINT pk_ohrm_data_group PRIMARY KEY (id);


--
-- Name: pk_ohrm_display_field; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_display_field
    ADD CONSTRAINT pk_ohrm_display_field PRIMARY KEY (display_field_id);


--
-- Name: pk_ohrm_display_field_group; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_display_field_group
    ADD CONSTRAINT pk_ohrm_display_field_group PRIMARY KEY (id);


--
-- Name: pk_ohrm_education; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_education
    ADD CONSTRAINT pk_ohrm_education PRIMARY KEY (id);


--
-- Name: pk_ohrm_email_configuration; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_email_configuration
    ADD CONSTRAINT pk_ohrm_email_configuration PRIMARY KEY (id);


--
-- Name: pk_ohrm_email_notification; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_email_notification
    ADD CONSTRAINT pk_ohrm_email_notification PRIMARY KEY (id);


--
-- Name: pk_ohrm_email_processor; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_email_processor
    ADD CONSTRAINT pk_ohrm_email_processor PRIMARY KEY (id);


--
-- Name: pk_ohrm_email_subscriber; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_email_subscriber
    ADD CONSTRAINT pk_ohrm_email_subscriber PRIMARY KEY (id);


--
-- Name: pk_ohrm_email_template; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_email_template
    ADD CONSTRAINT pk_ohrm_email_template PRIMARY KEY (id);


--
-- Name: pk_ohrm_emp_education; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_emp_education
    ADD CONSTRAINT pk_ohrm_emp_education PRIMARY KEY (id);


--
-- Name: pk_ohrm_emp_license; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_emp_license
    ADD CONSTRAINT pk_ohrm_emp_license PRIMARY KEY (emp_number, license_id);


--
-- Name: pk_ohrm_emp_reporting_method; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_emp_reporting_method
    ADD CONSTRAINT pk_ohrm_emp_reporting_method PRIMARY KEY (reporting_method_id);


--
-- Name: pk_ohrm_emp_termination; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_emp_termination
    ADD CONSTRAINT pk_ohrm_emp_termination PRIMARY KEY (id);


--
-- Name: pk_ohrm_emp_termination_reason; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_emp_termination_reason
    ADD CONSTRAINT pk_ohrm_emp_termination_reason PRIMARY KEY (id);


--
-- Name: pk_ohrm_employee_work_shift; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_employee_work_shift
    ADD CONSTRAINT pk_ohrm_employee_work_shift PRIMARY KEY (work_shift_id, emp_number);


--
-- Name: pk_ohrm_employment_status; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_employment_status
    ADD CONSTRAINT pk_ohrm_employment_status PRIMARY KEY (id);


--
-- Name: pk_ohrm_filter_field; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_filter_field
    ADD CONSTRAINT pk_ohrm_filter_field PRIMARY KEY (filter_field_id);


--
-- Name: pk_ohrm_group_field; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_group_field
    ADD CONSTRAINT pk_ohrm_group_field PRIMARY KEY (group_field_id);


--
-- Name: pk_ohrm_holiday; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_holiday
    ADD CONSTRAINT pk_ohrm_holiday PRIMARY KEY (id);


--
-- Name: pk_ohrm_home_page; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_home_page
    ADD CONSTRAINT pk_ohrm_home_page PRIMARY KEY (id);


--
-- Name: pk_ohrm_job_candidate; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_candidate
    ADD CONSTRAINT pk_ohrm_job_candidate PRIMARY KEY (id);


--
-- Name: pk_ohrm_job_candidate_attachment; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_candidate_attachment
    ADD CONSTRAINT pk_ohrm_job_candidate_attachment PRIMARY KEY (id);


--
-- Name: pk_ohrm_job_candidate_history; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_candidate_history
    ADD CONSTRAINT pk_ohrm_job_candidate_history PRIMARY KEY (id);


--
-- Name: pk_ohrm_job_candidate_vacancy; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_candidate_vacancy
    ADD CONSTRAINT pk_ohrm_job_candidate_vacancy PRIMARY KEY (candidate_id, vacancy_id);


--
-- Name: pk_ohrm_job_category; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_category
    ADD CONSTRAINT pk_ohrm_job_category PRIMARY KEY (id);


--
-- Name: pk_ohrm_job_interview; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_interview
    ADD CONSTRAINT pk_ohrm_job_interview PRIMARY KEY (id);


--
-- Name: pk_ohrm_job_interview_attachment; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_interview_attachment
    ADD CONSTRAINT pk_ohrm_job_interview_attachment PRIMARY KEY (id);


--
-- Name: pk_ohrm_job_interview_interviewer; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_interview_interviewer
    ADD CONSTRAINT pk_ohrm_job_interview_interviewer PRIMARY KEY (interview_id, interviewer_id);


--
-- Name: pk_ohrm_job_specification_attachment; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_specification_attachment
    ADD CONSTRAINT pk_ohrm_job_specification_attachment PRIMARY KEY (id);


--
-- Name: pk_ohrm_job_title; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_title
    ADD CONSTRAINT pk_ohrm_job_title PRIMARY KEY (id);


--
-- Name: pk_ohrm_job_vacancy; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_vacancy
    ADD CONSTRAINT pk_ohrm_job_vacancy PRIMARY KEY (id);


--
-- Name: pk_ohrm_job_vacancy_attachment; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_vacancy_attachment
    ADD CONSTRAINT pk_ohrm_job_vacancy_attachment PRIMARY KEY (id);


--
-- Name: pk_ohrm_language; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_language
    ADD CONSTRAINT pk_ohrm_language PRIMARY KEY (id);


--
-- Name: pk_ohrm_leave; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave
    ADD CONSTRAINT pk_ohrm_leave PRIMARY KEY (id);


--
-- Name: pk_ohrm_leave_adjustment; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_adjustment
    ADD CONSTRAINT pk_ohrm_leave_adjustment PRIMARY KEY (id);


--
-- Name: pk_ohrm_leave_comment; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_comment
    ADD CONSTRAINT pk_ohrm_leave_comment PRIMARY KEY (id);


--
-- Name: pk_ohrm_leave_entitlement; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_entitlement
    ADD CONSTRAINT pk_ohrm_leave_entitlement PRIMARY KEY (id);


--
-- Name: pk_ohrm_leave_entitlement_adjustment; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_entitlement_adjustment
    ADD CONSTRAINT pk_ohrm_leave_entitlement_adjustment PRIMARY KEY (id);


--
-- Name: pk_ohrm_leave_entitlement_type; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_entitlement_type
    ADD CONSTRAINT pk_ohrm_leave_entitlement_type PRIMARY KEY (id);


--
-- Name: pk_ohrm_leave_leave_entitlement; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_leave_entitlement
    ADD CONSTRAINT pk_ohrm_leave_leave_entitlement PRIMARY KEY (id);


--
-- Name: pk_ohrm_leave_period_history; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_period_history
    ADD CONSTRAINT pk_ohrm_leave_period_history PRIMARY KEY (id);


--
-- Name: pk_ohrm_leave_request; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_request
    ADD CONSTRAINT pk_ohrm_leave_request PRIMARY KEY (id);


--
-- Name: pk_ohrm_leave_request_comment; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_request_comment
    ADD CONSTRAINT pk_ohrm_leave_request_comment PRIMARY KEY (id);


--
-- Name: pk_ohrm_leave_status; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_status
    ADD CONSTRAINT pk_ohrm_leave_status PRIMARY KEY (id);


--
-- Name: pk_ohrm_leave_type; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_type
    ADD CONSTRAINT pk_ohrm_leave_type PRIMARY KEY (id);


--
-- Name: pk_ohrm_license; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_license
    ADD CONSTRAINT pk_ohrm_license PRIMARY KEY (id);


--
-- Name: pk_ohrm_location; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_location
    ADD CONSTRAINT pk_ohrm_location PRIMARY KEY (id);


--
-- Name: pk_ohrm_membership; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_membership
    ADD CONSTRAINT pk_ohrm_membership PRIMARY KEY (id);


--
-- Name: pk_ohrm_menu_item; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_menu_item
    ADD CONSTRAINT pk_ohrm_menu_item PRIMARY KEY (id);


--
-- Name: pk_ohrm_module; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_module
    ADD CONSTRAINT pk_ohrm_module PRIMARY KEY (id);


--
-- Name: pk_ohrm_module_default_page; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_module_default_page
    ADD CONSTRAINT pk_ohrm_module_default_page PRIMARY KEY (id);


--
-- Name: pk_ohrm_nationality; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_nationality
    ADD CONSTRAINT pk_ohrm_nationality PRIMARY KEY (id);


--
-- Name: pk_ohrm_operational_country; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_operational_country
    ADD CONSTRAINT pk_ohrm_operational_country PRIMARY KEY (id);


--
-- Name: pk_ohrm_organization_gen_info; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_organization_gen_info
    ADD CONSTRAINT pk_ohrm_organization_gen_info PRIMARY KEY (id);


--
-- Name: pk_ohrm_pay_grade; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_pay_grade
    ADD CONSTRAINT pk_ohrm_pay_grade PRIMARY KEY (id);


--
-- Name: pk_ohrm_pay_grade_currency; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_pay_grade_currency
    ADD CONSTRAINT pk_ohrm_pay_grade_currency PRIMARY KEY (pay_grade_id, currency_id);


--
-- Name: pk_ohrm_project; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_project
    ADD CONSTRAINT pk_ohrm_project PRIMARY KEY (project_id, customer_id);


--
-- Name: pk_ohrm_project_activity; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_project_activity
    ADD CONSTRAINT pk_ohrm_project_activity PRIMARY KEY (activity_id);


--
-- Name: pk_ohrm_project_admin; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_project_admin
    ADD CONSTRAINT pk_ohrm_project_admin PRIMARY KEY (project_id, emp_number);


--
-- Name: pk_ohrm_report; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_report
    ADD CONSTRAINT pk_ohrm_report PRIMARY KEY (report_id);


--
-- Name: pk_ohrm_report_group; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_report_group
    ADD CONSTRAINT pk_ohrm_report_group PRIMARY KEY (report_group_id);


--
-- Name: pk_ohrm_role_user_selection_rule; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_role_user_selection_rule
    ADD CONSTRAINT pk_ohrm_role_user_selection_rule PRIMARY KEY (user_role_id, selection_rule_id);


--
-- Name: pk_ohrm_screen; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_screen
    ADD CONSTRAINT pk_ohrm_screen PRIMARY KEY (id);


--
-- Name: pk_ohrm_selected_composite_display_field; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_selected_composite_display_field
    ADD CONSTRAINT pk_ohrm_selected_composite_display_field PRIMARY KEY (id, composite_display_field_id, report_id);


--
-- Name: pk_ohrm_selected_display_field; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_selected_display_field
    ADD CONSTRAINT pk_ohrm_selected_display_field PRIMARY KEY (id, display_field_id, report_id);


--
-- Name: pk_ohrm_selected_display_field_group; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_selected_display_field_group
    ADD CONSTRAINT pk_ohrm_selected_display_field_group PRIMARY KEY (id);


--
-- Name: pk_ohrm_selected_filter_field; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_selected_filter_field
    ADD CONSTRAINT pk_ohrm_selected_filter_field PRIMARY KEY (report_id, filter_field_id);


--
-- Name: pk_ohrm_selected_group_field; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_selected_group_field
    ADD CONSTRAINT pk_ohrm_selected_group_field PRIMARY KEY (group_field_id, summary_display_field_id, report_id);


--
-- Name: pk_ohrm_skill; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_skill
    ADD CONSTRAINT pk_ohrm_skill PRIMARY KEY (id);


--
-- Name: pk_ohrm_subunit; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_subunit
    ADD CONSTRAINT pk_ohrm_subunit PRIMARY KEY (id);


--
-- Name: pk_ohrm_summary_display_field; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_summary_display_field
    ADD CONSTRAINT pk_ohrm_summary_display_field PRIMARY KEY (summary_display_field_id);


--
-- Name: pk_ohrm_timesheet; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_timesheet
    ADD CONSTRAINT pk_ohrm_timesheet PRIMARY KEY (timesheet_id);


--
-- Name: pk_ohrm_timesheet_action_log; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_timesheet_action_log
    ADD CONSTRAINT pk_ohrm_timesheet_action_log PRIMARY KEY (timesheet_action_log_id);


--
-- Name: pk_ohrm_timesheet_item; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_timesheet_item
    ADD CONSTRAINT pk_ohrm_timesheet_item PRIMARY KEY (timesheet_item_id);


--
-- Name: pk_ohrm_upgrade_history; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_upgrade_history
    ADD CONSTRAINT pk_ohrm_upgrade_history PRIMARY KEY (id);


--
-- Name: pk_ohrm_user; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_user
    ADD CONSTRAINT pk_ohrm_user PRIMARY KEY (id);


--
-- Name: pk_ohrm_user_role; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_user_role
    ADD CONSTRAINT pk_ohrm_user_role PRIMARY KEY (id);


--
-- Name: pk_ohrm_user_role_data_group; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_user_role_data_group
    ADD CONSTRAINT pk_ohrm_user_role_data_group PRIMARY KEY (id);


--
-- Name: pk_ohrm_user_role_screen; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_user_role_screen
    ADD CONSTRAINT pk_ohrm_user_role_screen PRIMARY KEY (id);


--
-- Name: pk_ohrm_user_selection_rule; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_user_selection_rule
    ADD CONSTRAINT pk_ohrm_user_selection_rule PRIMARY KEY (id);


--
-- Name: pk_ohrm_work_shift; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_work_shift
    ADD CONSTRAINT pk_ohrm_work_shift PRIMARY KEY (id);


--
-- Name: pk_ohrm_work_week; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_work_week
    ADD CONSTRAINT pk_ohrm_work_week PRIMARY KEY (id);


--
-- Name: pk_ohrm_workflow_state_machine; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_workflow_state_machine
    ADD CONSTRAINT pk_ohrm_workflow_state_machine PRIMARY KEY (id);


--
-- Name: fk_ohrm_holiday_ohrm_operational_country; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX fk_ohrm_holiday_ohrm_operational_country ON ohrm_holiday USING btree (operational_country_id);


--
-- Name: fk_ohrm_operational_country_hs_hr_country; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX fk_ohrm_operational_country_hs_hr_country ON ohrm_operational_country USING btree (country_code);


--
-- Name: hs_hr_custom_export_emp_number; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_custom_export_emp_number ON hs_hr_custom_export USING btree (export_id);


--
-- Name: hs_hr_custom_fields_emp_number; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_custom_fields_emp_number ON hs_hr_custom_fields USING btree (field_num);


--
-- Name: hs_hr_custom_fields_screen; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_custom_fields_screen ON hs_hr_custom_fields USING btree (screen);


--
-- Name: hs_hr_custom_import_emp_number; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_custom_import_emp_number ON hs_hr_custom_import USING btree (import_id);


--
-- Name: hs_hr_emp_attachment_screen; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_emp_attachment_screen ON hs_hr_emp_attachment USING btree (screen);


--
-- Name: hs_hr_emp_basicsalary_currency_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_emp_basicsalary_currency_id ON hs_hr_emp_basicsalary USING btree (currency_id);


--
-- Name: hs_hr_emp_basicsalary_emp_number; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_emp_basicsalary_emp_number ON hs_hr_emp_basicsalary USING btree (emp_number);


--
-- Name: hs_hr_emp_basicsalary_payperiod_code; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_emp_basicsalary_payperiod_code ON hs_hr_emp_basicsalary USING btree (payperiod_code);


--
-- Name: hs_hr_emp_basicsalary_sal_grd_code; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_emp_basicsalary_sal_grd_code ON hs_hr_emp_basicsalary USING btree (sal_grd_code);


--
-- Name: hs_hr_emp_directdebit_salary_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_emp_directdebit_salary_id ON hs_hr_emp_directdebit USING btree (salary_id);


--
-- Name: hs_hr_emp_language_lang_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_emp_language_lang_id ON hs_hr_emp_language USING btree (lang_id);


--
-- Name: hs_hr_emp_locations_location_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_emp_locations_location_id ON hs_hr_emp_locations USING btree (location_id);


--
-- Name: hs_hr_emp_member_detail_membship_code; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_emp_member_detail_membship_code ON hs_hr_emp_member_detail USING btree (membship_code);


--
-- Name: hs_hr_emp_reportto_erep_reporting_mode; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_emp_reportto_erep_reporting_mode ON hs_hr_emp_reportto USING btree (erep_reporting_mode);


--
-- Name: hs_hr_emp_reportto_erep_sub_emp_number; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_emp_reportto_erep_sub_emp_number ON hs_hr_emp_reportto USING btree (erep_sub_emp_number);


--
-- Name: hs_hr_emp_skill_emp_number; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_emp_skill_emp_number ON hs_hr_emp_skill USING btree (emp_number);


--
-- Name: hs_hr_emp_skill_skill_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_emp_skill_skill_id ON hs_hr_emp_skill USING btree (skill_id);


--
-- Name: hs_hr_employee_eeo_cat_code; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_employee_eeo_cat_code ON hs_hr_employee USING btree (eeo_cat_code);


--
-- Name: hs_hr_employee_emp_status; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_employee_emp_status ON hs_hr_employee USING btree (emp_status);


--
-- Name: hs_hr_employee_job_title_code; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_employee_job_title_code ON hs_hr_employee USING btree (job_title_code);


--
-- Name: hs_hr_employee_nation_code; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_employee_nation_code ON hs_hr_employee USING btree (nation_code);


--
-- Name: hs_hr_employee_termination_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_employee_termination_id ON hs_hr_employee USING btree (termination_id);


--
-- Name: hs_hr_employee_work_station; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_employee_work_station ON hs_hr_employee USING btree (work_station);


--
-- Name: hs_hr_jobtit_empstat_estat_code; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_jobtit_empstat_estat_code ON hs_hr_jobtit_empstat USING btree (estat_code);


--
-- Name: hs_hr_mailnotifications_notification_type_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_mailnotifications_notification_type_id ON hs_hr_mailnotifications USING btree (notification_type_id);


--
-- Name: hs_hr_mailnotifications_user_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX hs_hr_mailnotifications_user_id ON hs_hr_mailnotifications USING btree (user_id);


--
-- Name: hs_hr_unique_id_table_field; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE UNIQUE INDEX hs_hr_unique_id_table_field ON hs_hr_unique_id USING btree (table_name, field_name);


--
-- Name: ohrm_attendance_record_emp_id_state; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_attendance_record_emp_id_state ON ohrm_attendance_record USING btree (employee_id, state);


--
-- Name: ohrm_attendance_record_emp_id_time; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_attendance_record_emp_id_time ON ohrm_attendance_record USING btree (employee_id, punch_in_utc_time, punch_out_utc_time);


--
-- Name: ohrm_available_group_field_group_field_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_available_group_field_group_field_id ON ohrm_available_group_field USING btree (group_field_id);


--
-- Name: ohrm_available_group_field_report_group_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_available_group_field_report_group_id ON ohrm_available_group_field USING btree (report_group_id);


--
-- Name: ohrm_composite_display_field_display_field_group_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_composite_display_field_display_field_group_id ON ohrm_composite_display_field USING btree (display_field_group_id);


--
-- Name: ohrm_composite_display_field_report_group_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_composite_display_field_report_group_id ON ohrm_composite_display_field USING btree (report_group_id);


--
-- Name: ohrm_data_group_name; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE UNIQUE INDEX ohrm_data_group_name ON ohrm_data_group USING btree (name);


--
-- Name: ohrm_display_field_display_field_group_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_display_field_display_field_group_id ON ohrm_display_field USING btree (display_field_group_id);


--
-- Name: ohrm_display_field_group_report_group_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_display_field_group_report_group_id ON ohrm_display_field_group USING btree (report_group_id);


--
-- Name: ohrm_display_field_report_group_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_display_field_report_group_id ON ohrm_display_field USING btree (report_group_id);


--
-- Name: ohrm_email_processor_email_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_email_processor_email_id ON ohrm_email_processor USING btree (email_id);


--
-- Name: ohrm_email_subscriber_notification_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_email_subscriber_notification_id ON ohrm_email_subscriber USING btree (notification_id);


--
-- Name: ohrm_email_template_email_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_email_template_email_id ON ohrm_email_template USING btree (email_id);


--
-- Name: ohrm_emp_education_education_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_emp_education_education_id ON ohrm_emp_education USING btree (education_id);


--
-- Name: ohrm_emp_education_emp_number; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_emp_education_emp_number ON ohrm_emp_education USING btree (emp_number);


--
-- Name: ohrm_emp_license_license_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_emp_license_license_id ON ohrm_emp_license USING btree (license_id);


--
-- Name: ohrm_emp_termination_emp_number; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_emp_termination_emp_number ON ohrm_emp_termination USING btree (emp_number);


--
-- Name: ohrm_emp_termination_reason_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_emp_termination_reason_id ON ohrm_emp_termination USING btree (reason_id);


--
-- Name: ohrm_employee_work_shift_emp_number; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_employee_work_shift_emp_number ON ohrm_employee_work_shift USING btree (emp_number);


--
-- Name: ohrm_filter_field_report_group_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_filter_field_report_group_id ON ohrm_filter_field USING btree (report_group_id);


--
-- Name: ohrm_home_page_user_role_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_home_page_user_role_id ON ohrm_home_page USING btree (user_role_id);


--
-- Name: ohrm_job_candidate_added_person; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_job_candidate_added_person ON ohrm_job_candidate USING btree (added_person);


--
-- Name: ohrm_job_candidate_attachment_candidate_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_job_candidate_attachment_candidate_id ON ohrm_job_candidate_attachment USING btree (candidate_id);


--
-- Name: ohrm_job_candidate_history_candidate_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_job_candidate_history_candidate_id ON ohrm_job_candidate_history USING btree (candidate_id);


--
-- Name: ohrm_job_candidate_history_interview_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_job_candidate_history_interview_id ON ohrm_job_candidate_history USING btree (interview_id);


--
-- Name: ohrm_job_candidate_history_performed_by; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_job_candidate_history_performed_by ON ohrm_job_candidate_history USING btree (performed_by);


--
-- Name: ohrm_job_candidate_history_vacancy_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_job_candidate_history_vacancy_id ON ohrm_job_candidate_history USING btree (vacancy_id);


--
-- Name: ohrm_job_candidate_vacancy_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE UNIQUE INDEX ohrm_job_candidate_vacancy_id ON ohrm_job_candidate_vacancy USING btree (id);


--
-- Name: ohrm_job_candidate_vacancy_vacancy_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_job_candidate_vacancy_vacancy_id ON ohrm_job_candidate_vacancy USING btree (vacancy_id);


--
-- Name: ohrm_job_interview_attachment_interview_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_job_interview_attachment_interview_id ON ohrm_job_interview_attachment USING btree (interview_id);


--
-- Name: ohrm_job_interview_candidate_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_job_interview_candidate_id ON ohrm_job_interview USING btree (candidate_id);


--
-- Name: ohrm_job_interview_candidate_vacancy_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_job_interview_candidate_vacancy_id ON ohrm_job_interview USING btree (candidate_vacancy_id);


--
-- Name: ohrm_job_interview_interviewer_interviewer_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_job_interview_interviewer_interviewer_id ON ohrm_job_interview_interviewer USING btree (interviewer_id);


--
-- Name: ohrm_job_specification_attachment_job_title_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_job_specification_attachment_job_title_id ON ohrm_job_specification_attachment USING btree (job_title_id);


--
-- Name: ohrm_job_vacancy_attachment_vacancy_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_job_vacancy_attachment_vacancy_id ON ohrm_job_vacancy_attachment USING btree (vacancy_id);


--
-- Name: ohrm_job_vacancy_hiring_manager_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_job_vacancy_hiring_manager_id ON ohrm_job_vacancy USING btree (hiring_manager_id);


--
-- Name: ohrm_job_vacancy_job_title_code; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_job_vacancy_job_title_code ON ohrm_job_vacancy USING btree (job_title_code);


--
-- Name: ohrm_leave_adjustment_adjustment_type; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_adjustment_adjustment_type ON ohrm_leave_adjustment USING btree (adjustment_type);


--
-- Name: ohrm_leave_adjustment_created_by_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_adjustment_created_by_id ON ohrm_leave_adjustment USING btree (created_by_id);


--
-- Name: ohrm_leave_adjustment_emp_number; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_adjustment_emp_number ON ohrm_leave_adjustment USING btree (emp_number);


--
-- Name: ohrm_leave_adjustment_leave_type_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_adjustment_leave_type_id ON ohrm_leave_adjustment USING btree (leave_type_id);


--
-- Name: ohrm_leave_comment_created_by_emp_number; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_comment_created_by_emp_number ON ohrm_leave_comment USING btree (created_by_emp_number);


--
-- Name: ohrm_leave_comment_created_by_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_comment_created_by_id ON ohrm_leave_comment USING btree (created_by_id);


--
-- Name: ohrm_leave_comment_leave_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_comment_leave_id ON ohrm_leave_comment USING btree (leave_id);


--
-- Name: ohrm_leave_entitlement_adjustment_adjustment_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_entitlement_adjustment_adjustment_id ON ohrm_leave_entitlement_adjustment USING btree (adjustment_id);


--
-- Name: ohrm_leave_entitlement_adjustment_entitlement_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_entitlement_adjustment_entitlement_id ON ohrm_leave_entitlement_adjustment USING btree (entitlement_id);


--
-- Name: ohrm_leave_entitlement_created_by_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_entitlement_created_by_id ON ohrm_leave_entitlement USING btree (created_by_id);


--
-- Name: ohrm_leave_entitlement_emp_number; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_entitlement_emp_number ON ohrm_leave_entitlement USING btree (emp_number);


--
-- Name: ohrm_leave_entitlement_entitlement_type; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_entitlement_entitlement_type ON ohrm_leave_entitlement USING btree (entitlement_type);


--
-- Name: ohrm_leave_entitlement_leave_type_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_entitlement_leave_type_id ON ohrm_leave_entitlement USING btree (leave_type_id);


--
-- Name: ohrm_leave_leave_entitlement_entitlement_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_leave_entitlement_entitlement_id ON ohrm_leave_leave_entitlement USING btree (entitlement_id);


--
-- Name: ohrm_leave_leave_entitlement_leave_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_leave_entitlement_leave_id ON ohrm_leave_leave_entitlement USING btree (leave_id);


--
-- Name: ohrm_leave_leave_request_type_emp; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_leave_request_type_emp ON ohrm_leave USING btree (leave_request_id, leave_type_id, emp_number);


--
-- Name: ohrm_leave_leave_type_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_leave_type_id ON ohrm_leave USING btree (leave_type_id);


--
-- Name: ohrm_leave_request_comment_created_by_emp_number; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_request_comment_created_by_emp_number ON ohrm_leave_request_comment USING btree (created_by_emp_number);


--
-- Name: ohrm_leave_request_comment_created_by_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_request_comment_created_by_id ON ohrm_leave_request_comment USING btree (created_by_id);


--
-- Name: ohrm_leave_request_comment_leave_request_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_request_comment_leave_request_id ON ohrm_leave_request_comment USING btree (leave_request_id);


--
-- Name: ohrm_leave_request_emp_number; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_request_emp_number ON ohrm_leave_request USING btree (emp_number);


--
-- Name: ohrm_leave_request_leave_type_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_request_leave_type_id ON ohrm_leave_request USING btree (leave_type_id);


--
-- Name: ohrm_leave_request_status; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_request_status ON ohrm_leave USING btree (leave_request_id, status);


--
-- Name: ohrm_leave_type_operational_country_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_leave_type_operational_country_id ON ohrm_leave_type USING btree (operational_country_id);


--
-- Name: ohrm_location_country_code; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_location_country_code ON ohrm_location USING btree (country_code);


--
-- Name: ohrm_menu_item_screen_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_menu_item_screen_id ON ohrm_menu_item USING btree (screen_id);


--
-- Name: ohrm_module_default_page_module_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_module_default_page_module_id ON ohrm_module_default_page USING btree (module_id);


--
-- Name: ohrm_module_default_page_user_role_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_module_default_page_user_role_id ON ohrm_module_default_page USING btree (user_role_id);


--
-- Name: ohrm_pay_grade_currency_currency_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_pay_grade_currency_currency_id ON ohrm_pay_grade_currency USING btree (currency_id);


--
-- Name: ohrm_pay_grade_name; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE UNIQUE INDEX ohrm_pay_grade_name ON ohrm_pay_grade USING btree (name);


--
-- Name: ohrm_project_activity_project_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_project_activity_project_id ON ohrm_project_activity USING btree (project_id);


--
-- Name: ohrm_project_admin_emp_number; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_project_admin_emp_number ON ohrm_project_admin USING btree (emp_number);


--
-- Name: ohrm_project_customer_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_project_customer_id ON ohrm_project USING btree (customer_id);


--
-- Name: ohrm_report_report_group_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_report_report_group_id ON ohrm_report USING btree (report_group_id);


--
-- Name: ohrm_screen_module_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_screen_module_id ON ohrm_screen USING btree (module_id);


--
-- Name: ohrm_selected_composite_display_field_composite_display_field_i; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_selected_composite_display_field_composite_display_field_i ON ohrm_selected_composite_display_field USING btree (composite_display_field_id);


--
-- Name: ohrm_selected_composite_display_field_report_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_selected_composite_display_field_report_id ON ohrm_selected_composite_display_field USING btree (report_id);


--
-- Name: ohrm_selected_display_field_display_field_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_selected_display_field_display_field_id ON ohrm_selected_display_field USING btree (display_field_id);


--
-- Name: ohrm_selected_display_field_group_display_field_group_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_selected_display_field_group_display_field_group_id ON ohrm_selected_display_field_group USING btree (display_field_group_id);


--
-- Name: ohrm_selected_display_field_group_report_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_selected_display_field_group_report_id ON ohrm_selected_display_field_group USING btree (report_id);


--
-- Name: ohrm_selected_display_field_report_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_selected_display_field_report_id ON ohrm_selected_display_field USING btree (report_id);


--
-- Name: ohrm_selected_filter_field_filter_field_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_selected_filter_field_filter_field_id ON ohrm_selected_filter_field USING btree (filter_field_id);


--
-- Name: ohrm_selected_filter_field_report_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_selected_filter_field_report_id ON ohrm_selected_filter_field USING btree (report_id);


--
-- Name: ohrm_selected_group_field_group_field_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_selected_group_field_group_field_id ON ohrm_selected_group_field USING btree (group_field_id);


--
-- Name: ohrm_selected_group_field_report_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_selected_group_field_report_id ON ohrm_selected_group_field USING btree (report_id);


--
-- Name: ohrm_selected_group_field_summary_display_field_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_selected_group_field_summary_display_field_id ON ohrm_selected_group_field USING btree (summary_display_field_id);


--
-- Name: ohrm_subunit_name; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE UNIQUE INDEX ohrm_subunit_name ON ohrm_subunit USING btree (name);


--
-- Name: ohrm_summary_display_field_display_field_group_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_summary_display_field_display_field_group_id ON ohrm_summary_display_field USING btree (display_field_group_id);


--
-- Name: ohrm_timesheet_action_log_performed_by; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_timesheet_action_log_performed_by ON ohrm_timesheet_action_log USING btree (performed_by);


--
-- Name: ohrm_timesheet_action_log_timesheet_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_timesheet_action_log_timesheet_id ON ohrm_timesheet_action_log USING btree (timesheet_id);


--
-- Name: ohrm_timesheet_item_activity_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_timesheet_item_activity_id ON ohrm_timesheet_item USING btree (activity_id);


--
-- Name: ohrm_timesheet_item_timesheet_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_timesheet_item_timesheet_id ON ohrm_timesheet_item USING btree (timesheet_id);


--
-- Name: ohrm_user_created_by; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_user_created_by ON ohrm_user USING btree (created_by);


--
-- Name: ohrm_user_emp_number; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_user_emp_number ON ohrm_user USING btree (emp_number);


--
-- Name: ohrm_user_modified_user_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_user_modified_user_id ON ohrm_user USING btree (modified_user_id);


--
-- Name: ohrm_user_role_data_group_data_group_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_user_role_data_group_data_group_id ON ohrm_user_role_data_group USING btree (data_group_id);


--
-- Name: ohrm_user_role_data_group_user_role_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_user_role_data_group_user_role_id ON ohrm_user_role_data_group USING btree (user_role_id);


--
-- Name: ohrm_user_role_screen_screen_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_user_role_screen_screen_id ON ohrm_user_role_screen USING btree (screen_id);


--
-- Name: ohrm_user_role_screen_user_role_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_user_role_screen_user_role_id ON ohrm_user_role_screen USING btree (user_role_id);


--
-- Name: ohrm_user_role_user_role_name; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE UNIQUE INDEX ohrm_user_role_user_role_name ON ohrm_user_role USING btree (name);


--
-- Name: ohrm_user_user_name; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE UNIQUE INDEX ohrm_user_user_name ON ohrm_user USING btree (user_name);


--
-- Name: ohrm_user_user_role_id; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX ohrm_user_user_role_id ON ohrm_user USING btree (user_role_id);


--
-- Name: fk_ohrm_holiday_ohrm_operational_country; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_holiday
    ADD CONSTRAINT fk_ohrm_holiday_ohrm_operational_country FOREIGN KEY (operational_country_id) REFERENCES ohrm_operational_country(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_ohrm_operational_country_hs_hr_country; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_operational_country
    ADD CONSTRAINT fk_ohrm_operational_country_hs_hr_country FOREIGN KEY (country_code) REFERENCES hs_hr_country(cou_code) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_ohrm_work_week_ohrm_operational_country; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_work_week
    ADD CONSTRAINT fk_ohrm_work_week_ohrm_operational_country FOREIGN KEY (operational_country_id) REFERENCES ohrm_operational_country(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hs_hr_emp_attachment_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_attachment
    ADD CONSTRAINT hs_hr_emp_attachment_ibfk_1 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_basicsalary_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_basicsalary
    ADD CONSTRAINT hs_hr_emp_basicsalary_ibfk_1 FOREIGN KEY (sal_grd_code) REFERENCES ohrm_pay_grade(id) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_basicsalary_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_basicsalary
    ADD CONSTRAINT hs_hr_emp_basicsalary_ibfk_2 FOREIGN KEY (currency_id) REFERENCES hs_hr_currency_type(currency_id) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_basicsalary_ibfk_3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_basicsalary
    ADD CONSTRAINT hs_hr_emp_basicsalary_ibfk_3 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_basicsalary_ibfk_4; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_basicsalary
    ADD CONSTRAINT hs_hr_emp_basicsalary_ibfk_4 FOREIGN KEY (payperiod_code) REFERENCES hs_hr_payperiod(payperiod_code) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_children_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_children
    ADD CONSTRAINT hs_hr_emp_children_ibfk_1 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_contract_extend_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_contract_extend
    ADD CONSTRAINT hs_hr_emp_contract_extend_ibfk_1 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_dependents_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_dependents
    ADD CONSTRAINT hs_hr_emp_dependents_ibfk_1 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_directdebit_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_directdebit
    ADD CONSTRAINT hs_hr_emp_directdebit_ibfk_1 FOREIGN KEY (salary_id) REFERENCES hs_hr_emp_basicsalary(id) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_emergency_contacts_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_emergency_contacts
    ADD CONSTRAINT hs_hr_emp_emergency_contacts_ibfk_1 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_history_of_ealier_pos_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_history_of_ealier_pos
    ADD CONSTRAINT hs_hr_emp_history_of_ealier_pos_ibfk_1 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_language_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_language
    ADD CONSTRAINT hs_hr_emp_language_ibfk_1 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_language_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_language
    ADD CONSTRAINT hs_hr_emp_language_ibfk_2 FOREIGN KEY (lang_id) REFERENCES ohrm_language(id) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_locations_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_locations
    ADD CONSTRAINT hs_hr_emp_locations_ibfk_1 FOREIGN KEY (location_id) REFERENCES ohrm_location(id) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_locations_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_locations
    ADD CONSTRAINT hs_hr_emp_locations_ibfk_2 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_member_detail_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_member_detail
    ADD CONSTRAINT hs_hr_emp_member_detail_ibfk_1 FOREIGN KEY (membship_code) REFERENCES ohrm_membership(id) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_member_detail_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_member_detail
    ADD CONSTRAINT hs_hr_emp_member_detail_ibfk_2 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_passport_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_passport
    ADD CONSTRAINT hs_hr_emp_passport_ibfk_1 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_picture_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_picture
    ADD CONSTRAINT hs_hr_emp_picture_ibfk_1 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_reportto_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_reportto
    ADD CONSTRAINT hs_hr_emp_reportto_ibfk_1 FOREIGN KEY (erep_sup_emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_reportto_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_reportto
    ADD CONSTRAINT hs_hr_emp_reportto_ibfk_2 FOREIGN KEY (erep_sub_emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_reportto_ibfk_3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_reportto
    ADD CONSTRAINT hs_hr_emp_reportto_ibfk_3 FOREIGN KEY (erep_reporting_mode) REFERENCES ohrm_emp_reporting_method(reporting_method_id) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_skill_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_skill
    ADD CONSTRAINT hs_hr_emp_skill_ibfk_1 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_skill_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_skill
    ADD CONSTRAINT hs_hr_emp_skill_ibfk_2 FOREIGN KEY (skill_id) REFERENCES ohrm_skill(id) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_us_tax_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_us_tax
    ADD CONSTRAINT hs_hr_emp_us_tax_ibfk_1 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: hs_hr_emp_work_experience_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_work_experience
    ADD CONSTRAINT hs_hr_emp_work_experience_ibfk_1 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: hs_hr_employee_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_employee
    ADD CONSTRAINT hs_hr_employee_ibfk_1 FOREIGN KEY (work_station) REFERENCES ohrm_subunit(id) ON DELETE SET NULL;


--
-- Name: hs_hr_employee_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_employee
    ADD CONSTRAINT hs_hr_employee_ibfk_2 FOREIGN KEY (nation_code) REFERENCES ohrm_nationality(id) ON DELETE SET NULL;


--
-- Name: hs_hr_employee_ibfk_3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_employee
    ADD CONSTRAINT hs_hr_employee_ibfk_3 FOREIGN KEY (job_title_code) REFERENCES ohrm_job_title(id) ON DELETE SET NULL;


--
-- Name: hs_hr_employee_ibfk_4; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_employee
    ADD CONSTRAINT hs_hr_employee_ibfk_4 FOREIGN KEY (emp_status) REFERENCES ohrm_employment_status(id) ON DELETE SET NULL;


--
-- Name: hs_hr_employee_ibfk_5; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_employee
    ADD CONSTRAINT hs_hr_employee_ibfk_5 FOREIGN KEY (eeo_cat_code) REFERENCES ohrm_job_category(id) ON DELETE SET NULL;


--
-- Name: hs_hr_employee_ibfk_6; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_employee
    ADD CONSTRAINT hs_hr_employee_ibfk_6 FOREIGN KEY (termination_id) REFERENCES ohrm_emp_termination(id) ON DELETE SET NULL;


--
-- Name: hs_hr_jobtit_empstat_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_jobtit_empstat
    ADD CONSTRAINT hs_hr_jobtit_empstat_ibfk_1 FOREIGN KEY (jobtit_code) REFERENCES ohrm_job_title(id) ON DELETE CASCADE;


--
-- Name: hs_hr_jobtit_empstat_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_jobtit_empstat
    ADD CONSTRAINT hs_hr_jobtit_empstat_ibfk_2 FOREIGN KEY (estat_code) REFERENCES ohrm_employment_status(id) ON DELETE CASCADE;


--
-- Name: hs_hr_mailnotifications_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_mailnotifications
    ADD CONSTRAINT hs_hr_mailnotifications_ibfk_1 FOREIGN KEY (user_id) REFERENCES ohrm_user(id) ON DELETE CASCADE;


--
-- Name: ohrm_available_group_field_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_available_group_field
    ADD CONSTRAINT ohrm_available_group_field_ibfk_1 FOREIGN KEY (group_field_id) REFERENCES ohrm_group_field(group_field_id);


--
-- Name: ohrm_composite_display_field_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_composite_display_field
    ADD CONSTRAINT ohrm_composite_display_field_ibfk_1 FOREIGN KEY (report_group_id) REFERENCES ohrm_report_group(report_group_id) ON DELETE CASCADE;


--
-- Name: ohrm_composite_display_field_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_composite_display_field
    ADD CONSTRAINT ohrm_composite_display_field_ibfk_2 FOREIGN KEY (display_field_group_id) REFERENCES ohrm_display_field_group(id) ON DELETE SET NULL;


--
-- Name: ohrm_display_field_group_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_display_field_group
    ADD CONSTRAINT ohrm_display_field_group_ibfk_1 FOREIGN KEY (report_group_id) REFERENCES ohrm_report_group(report_group_id) ON DELETE CASCADE;


--
-- Name: ohrm_display_field_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_display_field
    ADD CONSTRAINT ohrm_display_field_ibfk_1 FOREIGN KEY (report_group_id) REFERENCES ohrm_report_group(report_group_id) ON DELETE CASCADE;


--
-- Name: ohrm_display_field_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_display_field
    ADD CONSTRAINT ohrm_display_field_ibfk_2 FOREIGN KEY (display_field_group_id) REFERENCES ohrm_display_field_group(id) ON DELETE SET NULL;


--
-- Name: ohrm_email_subscriber_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_email_subscriber
    ADD CONSTRAINT ohrm_email_subscriber_ibfk_1 FOREIGN KEY (notification_id) REFERENCES ohrm_email_notification(id) ON DELETE CASCADE;


--
-- Name: ohrm_emp_education_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_emp_education
    ADD CONSTRAINT ohrm_emp_education_ibfk_1 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: ohrm_emp_education_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_emp_education
    ADD CONSTRAINT ohrm_emp_education_ibfk_2 FOREIGN KEY (education_id) REFERENCES ohrm_education(id) ON DELETE CASCADE;


--
-- Name: ohrm_emp_license_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_emp_license
    ADD CONSTRAINT ohrm_emp_license_ibfk_1 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: ohrm_emp_license_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_emp_license
    ADD CONSTRAINT ohrm_emp_license_ibfk_2 FOREIGN KEY (license_id) REFERENCES ohrm_license(id) ON DELETE CASCADE;


--
-- Name: ohrm_emp_termination_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_emp_termination
    ADD CONSTRAINT ohrm_emp_termination_ibfk_1 FOREIGN KEY (reason_id) REFERENCES ohrm_emp_termination_reason(id) ON DELETE SET NULL;


--
-- Name: ohrm_emp_termination_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_emp_termination
    ADD CONSTRAINT ohrm_emp_termination_ibfk_2 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: ohrm_employee_work_shift_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_employee_work_shift
    ADD CONSTRAINT ohrm_employee_work_shift_ibfk_1 FOREIGN KEY (work_shift_id) REFERENCES ohrm_work_shift(id) ON DELETE CASCADE;


--
-- Name: ohrm_employee_work_shift_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_employee_work_shift
    ADD CONSTRAINT ohrm_employee_work_shift_ibfk_2 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: ohrm_filter_field_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_filter_field
    ADD CONSTRAINT ohrm_filter_field_ibfk_1 FOREIGN KEY (report_group_id) REFERENCES ohrm_report_group(report_group_id) ON DELETE CASCADE;


--
-- Name: ohrm_home_page_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_home_page
    ADD CONSTRAINT ohrm_home_page_ibfk_1 FOREIGN KEY (user_role_id) REFERENCES ohrm_user_role(id) ON DELETE CASCADE;


--
-- Name: ohrm_job_candidate_attachment_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_candidate_attachment
    ADD CONSTRAINT ohrm_job_candidate_attachment_ibfk_1 FOREIGN KEY (candidate_id) REFERENCES ohrm_job_candidate(id) ON DELETE CASCADE;


--
-- Name: ohrm_job_candidate_history_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_candidate_history
    ADD CONSTRAINT ohrm_job_candidate_history_ibfk_1 FOREIGN KEY (candidate_id) REFERENCES ohrm_job_candidate(id) ON DELETE CASCADE;


--
-- Name: ohrm_job_candidate_history_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_candidate_history
    ADD CONSTRAINT ohrm_job_candidate_history_ibfk_2 FOREIGN KEY (vacancy_id) REFERENCES ohrm_job_vacancy(id) ON DELETE SET NULL;


--
-- Name: ohrm_job_candidate_history_ibfk_3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_candidate_history
    ADD CONSTRAINT ohrm_job_candidate_history_ibfk_3 FOREIGN KEY (interview_id) REFERENCES ohrm_job_interview(id) ON DELETE SET NULL;


--
-- Name: ohrm_job_candidate_history_ibfk_4; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_candidate_history
    ADD CONSTRAINT ohrm_job_candidate_history_ibfk_4 FOREIGN KEY (performed_by) REFERENCES hs_hr_employee(emp_number) ON DELETE SET NULL;


--
-- Name: ohrm_job_candidate_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_candidate
    ADD CONSTRAINT ohrm_job_candidate_ibfk_1 FOREIGN KEY (added_person) REFERENCES hs_hr_employee(emp_number) ON DELETE SET NULL;


--
-- Name: ohrm_job_candidate_vacancy_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_candidate_vacancy
    ADD CONSTRAINT ohrm_job_candidate_vacancy_ibfk_1 FOREIGN KEY (candidate_id) REFERENCES ohrm_job_candidate(id) ON DELETE CASCADE;


--
-- Name: ohrm_job_candidate_vacancy_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_candidate_vacancy
    ADD CONSTRAINT ohrm_job_candidate_vacancy_ibfk_2 FOREIGN KEY (vacancy_id) REFERENCES ohrm_job_vacancy(id) ON DELETE CASCADE;


--
-- Name: ohrm_job_interview_attachment_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_interview_attachment
    ADD CONSTRAINT ohrm_job_interview_attachment_ibfk_1 FOREIGN KEY (interview_id) REFERENCES ohrm_job_interview(id) ON DELETE CASCADE;


--
-- Name: ohrm_job_interview_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_interview
    ADD CONSTRAINT ohrm_job_interview_ibfk_1 FOREIGN KEY (candidate_vacancy_id) REFERENCES ohrm_job_candidate_vacancy(id) ON DELETE SET NULL;


--
-- Name: ohrm_job_interview_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_interview
    ADD CONSTRAINT ohrm_job_interview_ibfk_2 FOREIGN KEY (candidate_id) REFERENCES ohrm_job_candidate(id) ON DELETE CASCADE;


--
-- Name: ohrm_job_interview_interviewer_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_interview_interviewer
    ADD CONSTRAINT ohrm_job_interview_interviewer_ibfk_1 FOREIGN KEY (interview_id) REFERENCES ohrm_job_interview(id) ON DELETE CASCADE;


--
-- Name: ohrm_job_interview_interviewer_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_interview_interviewer
    ADD CONSTRAINT ohrm_job_interview_interviewer_ibfk_2 FOREIGN KEY (interviewer_id) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: ohrm_job_specification_attachment_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_specification_attachment
    ADD CONSTRAINT ohrm_job_specification_attachment_ibfk_1 FOREIGN KEY (job_title_id) REFERENCES ohrm_job_title(id) ON DELETE CASCADE;


--
-- Name: ohrm_job_vacancy_attachment_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_vacancy_attachment
    ADD CONSTRAINT ohrm_job_vacancy_attachment_ibfk_1 FOREIGN KEY (vacancy_id) REFERENCES ohrm_job_vacancy(id) ON DELETE CASCADE;


--
-- Name: ohrm_job_vacancy_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_vacancy
    ADD CONSTRAINT ohrm_job_vacancy_ibfk_1 FOREIGN KEY (job_title_code) REFERENCES ohrm_job_title(id) ON DELETE CASCADE;


--
-- Name: ohrm_job_vacancy_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_vacancy
    ADD CONSTRAINT ohrm_job_vacancy_ibfk_2 FOREIGN KEY (hiring_manager_id) REFERENCES hs_hr_employee(emp_number) ON DELETE SET NULL;


--
-- Name: ohrm_leave_adjustment_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_adjustment
    ADD CONSTRAINT ohrm_leave_adjustment_ibfk_1 FOREIGN KEY (leave_type_id) REFERENCES ohrm_leave_type(id) ON DELETE CASCADE;


--
-- Name: ohrm_leave_adjustment_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_adjustment
    ADD CONSTRAINT ohrm_leave_adjustment_ibfk_2 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: ohrm_leave_adjustment_ibfk_3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_adjustment
    ADD CONSTRAINT ohrm_leave_adjustment_ibfk_3 FOREIGN KEY (created_by_id) REFERENCES ohrm_user(id) ON DELETE SET NULL;


--
-- Name: ohrm_leave_adjustment_ibfk_4; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_adjustment
    ADD CONSTRAINT ohrm_leave_adjustment_ibfk_4 FOREIGN KEY (adjustment_type) REFERENCES ohrm_leave_entitlement_type(id) ON DELETE CASCADE;


--
-- Name: ohrm_leave_comment_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_comment
    ADD CONSTRAINT ohrm_leave_comment_ibfk_1 FOREIGN KEY (leave_id) REFERENCES ohrm_leave(id) ON DELETE CASCADE;


--
-- Name: ohrm_leave_comment_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_comment
    ADD CONSTRAINT ohrm_leave_comment_ibfk_2 FOREIGN KEY (created_by_id) REFERENCES ohrm_user(id) ON DELETE SET NULL;


--
-- Name: ohrm_leave_comment_ibfk_3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_comment
    ADD CONSTRAINT ohrm_leave_comment_ibfk_3 FOREIGN KEY (created_by_emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: ohrm_leave_entitlement_adjustment_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_entitlement_adjustment
    ADD CONSTRAINT ohrm_leave_entitlement_adjustment_ibfk_1 FOREIGN KEY (entitlement_id) REFERENCES ohrm_leave_entitlement(id) ON DELETE CASCADE;


--
-- Name: ohrm_leave_entitlement_adjustment_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_entitlement_adjustment
    ADD CONSTRAINT ohrm_leave_entitlement_adjustment_ibfk_2 FOREIGN KEY (adjustment_id) REFERENCES ohrm_leave_adjustment(id) ON DELETE CASCADE;


--
-- Name: ohrm_leave_entitlement_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_entitlement
    ADD CONSTRAINT ohrm_leave_entitlement_ibfk_1 FOREIGN KEY (leave_type_id) REFERENCES ohrm_leave_type(id) ON DELETE CASCADE;


--
-- Name: ohrm_leave_entitlement_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_entitlement
    ADD CONSTRAINT ohrm_leave_entitlement_ibfk_2 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: ohrm_leave_entitlement_ibfk_3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_entitlement
    ADD CONSTRAINT ohrm_leave_entitlement_ibfk_3 FOREIGN KEY (entitlement_type) REFERENCES ohrm_leave_entitlement_type(id) ON DELETE CASCADE;


--
-- Name: ohrm_leave_entitlement_ibfk_4; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_entitlement
    ADD CONSTRAINT ohrm_leave_entitlement_ibfk_4 FOREIGN KEY (created_by_id) REFERENCES ohrm_user(id) ON DELETE SET NULL;


--
-- Name: ohrm_leave_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave
    ADD CONSTRAINT ohrm_leave_ibfk_1 FOREIGN KEY (leave_request_id) REFERENCES ohrm_leave_request(id) ON DELETE CASCADE;


--
-- Name: ohrm_leave_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave
    ADD CONSTRAINT ohrm_leave_ibfk_2 FOREIGN KEY (leave_type_id) REFERENCES ohrm_leave_type(id) ON DELETE CASCADE;


--
-- Name: ohrm_leave_leave_entitlement_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_leave_entitlement
    ADD CONSTRAINT ohrm_leave_leave_entitlement_ibfk_1 FOREIGN KEY (entitlement_id) REFERENCES ohrm_leave_entitlement(id) ON DELETE CASCADE;


--
-- Name: ohrm_leave_leave_entitlement_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_leave_entitlement
    ADD CONSTRAINT ohrm_leave_leave_entitlement_ibfk_2 FOREIGN KEY (leave_id) REFERENCES ohrm_leave(id) ON DELETE CASCADE;


--
-- Name: ohrm_leave_request_comment_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_request_comment
    ADD CONSTRAINT ohrm_leave_request_comment_ibfk_1 FOREIGN KEY (leave_request_id) REFERENCES ohrm_leave_request(id) ON DELETE CASCADE;


--
-- Name: ohrm_leave_request_comment_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_request_comment
    ADD CONSTRAINT ohrm_leave_request_comment_ibfk_2 FOREIGN KEY (created_by_id) REFERENCES ohrm_user(id) ON DELETE SET NULL;


--
-- Name: ohrm_leave_request_comment_ibfk_3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_request_comment
    ADD CONSTRAINT ohrm_leave_request_comment_ibfk_3 FOREIGN KEY (created_by_emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: ohrm_leave_request_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_request
    ADD CONSTRAINT ohrm_leave_request_ibfk_1 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: ohrm_leave_request_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_request
    ADD CONSTRAINT ohrm_leave_request_ibfk_2 FOREIGN KEY (leave_type_id) REFERENCES ohrm_leave_type(id) ON DELETE CASCADE;


--
-- Name: ohrm_leave_type_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_type
    ADD CONSTRAINT ohrm_leave_type_ibfk_1 FOREIGN KEY (operational_country_id) REFERENCES ohrm_operational_country(id) ON DELETE SET NULL;


--
-- Name: ohrm_location_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_location
    ADD CONSTRAINT ohrm_location_ibfk_1 FOREIGN KEY (country_code) REFERENCES hs_hr_country(cou_code) ON DELETE CASCADE;


--
-- Name: ohrm_menu_item_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_menu_item
    ADD CONSTRAINT ohrm_menu_item_ibfk_1 FOREIGN KEY (screen_id) REFERENCES ohrm_screen(id) ON DELETE CASCADE;


--
-- Name: ohrm_module_default_page_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_module_default_page
    ADD CONSTRAINT ohrm_module_default_page_ibfk_1 FOREIGN KEY (user_role_id) REFERENCES ohrm_user_role(id) ON DELETE CASCADE;


--
-- Name: ohrm_module_default_page_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_module_default_page
    ADD CONSTRAINT ohrm_module_default_page_ibfk_2 FOREIGN KEY (module_id) REFERENCES ohrm_module(id) ON DELETE CASCADE;


--
-- Name: ohrm_pay_grade_currency_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_pay_grade_currency
    ADD CONSTRAINT ohrm_pay_grade_currency_ibfk_1 FOREIGN KEY (currency_id) REFERENCES hs_hr_currency_type(currency_id) ON DELETE CASCADE;


--
-- Name: ohrm_pay_grade_currency_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_pay_grade_currency
    ADD CONSTRAINT ohrm_pay_grade_currency_ibfk_2 FOREIGN KEY (pay_grade_id) REFERENCES ohrm_pay_grade(id) ON DELETE CASCADE;


--
-- Name: ohrm_project_admin_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_project_admin
    ADD CONSTRAINT ohrm_project_admin_ibfk_2 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: ohrm_report_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_report
    ADD CONSTRAINT ohrm_report_ibfk_1 FOREIGN KEY (report_group_id) REFERENCES ohrm_report_group(report_group_id) ON DELETE CASCADE;


--
-- Name: ohrm_screen_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_screen
    ADD CONSTRAINT ohrm_screen_ibfk_1 FOREIGN KEY (module_id) REFERENCES ohrm_module(id) ON DELETE CASCADE;


--
-- Name: ohrm_selected_composite_display_field_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_selected_composite_display_field
    ADD CONSTRAINT ohrm_selected_composite_display_field_ibfk_1 FOREIGN KEY (report_id) REFERENCES ohrm_report(report_id) ON DELETE CASCADE;


--
-- Name: ohrm_selected_composite_display_field_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_selected_composite_display_field
    ADD CONSTRAINT ohrm_selected_composite_display_field_ibfk_2 FOREIGN KEY (composite_display_field_id) REFERENCES ohrm_composite_display_field(composite_display_field_id) ON DELETE CASCADE;


--
-- Name: ohrm_selected_display_field_group_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_selected_display_field_group
    ADD CONSTRAINT ohrm_selected_display_field_group_ibfk_1 FOREIGN KEY (report_id) REFERENCES ohrm_report(report_id) ON DELETE CASCADE;


--
-- Name: ohrm_selected_display_field_group_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_selected_display_field_group
    ADD CONSTRAINT ohrm_selected_display_field_group_ibfk_2 FOREIGN KEY (display_field_group_id) REFERENCES ohrm_display_field_group(id) ON DELETE CASCADE;


--
-- Name: ohrm_selected_display_field_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_selected_display_field
    ADD CONSTRAINT ohrm_selected_display_field_ibfk_1 FOREIGN KEY (report_id) REFERENCES ohrm_report(report_id) ON DELETE CASCADE;


--
-- Name: ohrm_selected_display_field_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_selected_display_field
    ADD CONSTRAINT ohrm_selected_display_field_ibfk_2 FOREIGN KEY (display_field_id) REFERENCES ohrm_display_field(display_field_id) ON DELETE CASCADE;


--
-- Name: ohrm_selected_filter_field_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_selected_filter_field
    ADD CONSTRAINT ohrm_selected_filter_field_ibfk_1 FOREIGN KEY (report_id) REFERENCES ohrm_report(report_id) ON DELETE CASCADE;


--
-- Name: ohrm_selected_filter_field_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_selected_filter_field
    ADD CONSTRAINT ohrm_selected_filter_field_ibfk_2 FOREIGN KEY (filter_field_id) REFERENCES ohrm_filter_field(filter_field_id) ON DELETE CASCADE;


--
-- Name: ohrm_selected_group_field_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_selected_group_field
    ADD CONSTRAINT ohrm_selected_group_field_ibfk_1 FOREIGN KEY (report_id) REFERENCES ohrm_report(report_id) ON DELETE CASCADE;


--
-- Name: ohrm_selected_group_field_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_selected_group_field
    ADD CONSTRAINT ohrm_selected_group_field_ibfk_2 FOREIGN KEY (group_field_id) REFERENCES ohrm_group_field(group_field_id) ON DELETE CASCADE;


--
-- Name: ohrm_selected_group_field_ibfk_3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_selected_group_field
    ADD CONSTRAINT ohrm_selected_group_field_ibfk_3 FOREIGN KEY (summary_display_field_id) REFERENCES ohrm_summary_display_field(summary_display_field_id);


--
-- Name: ohrm_summary_display_field_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_summary_display_field
    ADD CONSTRAINT ohrm_summary_display_field_ibfk_1 FOREIGN KEY (display_field_group_id) REFERENCES ohrm_display_field_group(id) ON DELETE SET NULL;


--
-- Name: ohrm_timesheet_action_log_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_timesheet_action_log
    ADD CONSTRAINT ohrm_timesheet_action_log_ibfk_1 FOREIGN KEY (performed_by) REFERENCES ohrm_user(id) ON DELETE CASCADE;


--
-- Name: ohrm_user_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_user
    ADD CONSTRAINT ohrm_user_ibfk_1 FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- Name: ohrm_user_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_user
    ADD CONSTRAINT ohrm_user_ibfk_2 FOREIGN KEY (user_role_id) REFERENCES ohrm_user_role(id);


--
-- Name: ohrm_user_role_data_group_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_user_role_data_group
    ADD CONSTRAINT ohrm_user_role_data_group_ibfk_1 FOREIGN KEY (user_role_id) REFERENCES ohrm_user_role(id) ON DELETE CASCADE;


--
-- Name: ohrm_user_role_data_group_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_user_role_data_group
    ADD CONSTRAINT ohrm_user_role_data_group_ibfk_2 FOREIGN KEY (data_group_id) REFERENCES ohrm_data_group(id) ON DELETE CASCADE;


--
-- Name: ohrm_user_role_screen_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_user_role_screen
    ADD CONSTRAINT ohrm_user_role_screen_ibfk_1 FOREIGN KEY (user_role_id) REFERENCES ohrm_user_role(id) ON DELETE CASCADE;


--
-- Name: ohrm_user_role_screen_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_user_role_screen
    ADD CONSTRAINT ohrm_user_role_screen_ibfk_2 FOREIGN KEY (screen_id) REFERENCES ohrm_screen(id) ON DELETE CASCADE;


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA ohrm FROM PUBLIC;
REVOKE ALL ON SCHEMA ohrm FROM postgres;
GRANT ALL ON SCHEMA ohrm TO postgres;
GRANT ALL ON SCHEMA ohrm TO PUBLIC;


--
-- PostgreSQL database dump complete
--

