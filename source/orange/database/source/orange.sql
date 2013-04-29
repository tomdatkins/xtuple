--
-- PostgreSQL database dump
--

-- Dumped from database version 9.1.2
-- Dumped by pg_dump version 9.2.2
-- Started on 2013-04-25 09:54:20 EDT

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 357 (class 3079 OID 11907)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 3614 (class 0 OID 0)
-- Dependencies: 357
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 161 (class 1259 OID 4716646)
-- Name: hs_hr_config; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_config (
    key character varying(100) DEFAULT ''::character varying NOT NULL,
    value character varying(512) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public.hs_hr_config OWNER TO admin;

--
-- TOC entry 167 (class 1259 OID 4716681)
-- Name: hs_hr_country; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_country (
    cou_code character(2) DEFAULT ''::bpchar NOT NULL,
    name character varying(80) DEFAULT ''::character varying NOT NULL,
    cou_name character varying(80) DEFAULT ''::character varying NOT NULL,
    iso3 character(3) DEFAULT NULL::bpchar,
    numcode numeric
);


ALTER TABLE public.hs_hr_country OWNER TO admin;

--
-- TOC entry 168 (class 1259 OID 4716693)
-- Name: hs_hr_currency_type; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_currency_type (
    code numeric DEFAULT 0::numeric NOT NULL,
    currency_id character(3) DEFAULT ''::bpchar NOT NULL,
    currency_name character varying(70) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public.hs_hr_currency_type OWNER TO admin;

--
-- TOC entry 233 (class 1259 OID 4737728)
-- Name: hs_hr_custom_export; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_custom_export (
    export_id integer NOT NULL,
    name character varying(250) NOT NULL,
    fields text,
    headings text
);


ALTER TABLE public.hs_hr_custom_export OWNER TO admin;

--
-- TOC entry 231 (class 1259 OID 4737714)
-- Name: hs_hr_custom_fields; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_custom_fields (
    field_num integer NOT NULL,
    name character varying(250) NOT NULL,
    type integer NOT NULL,
    screen character varying(100),
    extra_data character varying(250) DEFAULT NULL::character varying
);


ALTER TABLE public.hs_hr_custom_fields OWNER TO admin;

--
-- TOC entry 234 (class 1259 OID 4737736)
-- Name: hs_hr_custom_import; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_custom_import (
    import_id integer NOT NULL,
    name character varying(250) NOT NULL,
    fields text,
    has_heading smallint DEFAULT 0
);


ALTER TABLE public.hs_hr_custom_import OWNER TO admin;

--
-- TOC entry 171 (class 1259 OID 4737266)
-- Name: hs_hr_district; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_district (
    district_code character varying(13) DEFAULT ''::character varying NOT NULL,
    district_name character varying(50) DEFAULT NULL::character varying,
    province_code character varying(13) DEFAULT NULL::character varying
);


ALTER TABLE public.hs_hr_district OWNER TO admin;

--
-- TOC entry 178 (class 1259 OID 4737321)
-- Name: hs_hr_emp_attachment; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_attachment (
    emp_number integer DEFAULT 0 NOT NULL,
    eattach_id integer DEFAULT 0 NOT NULL,
    eattach_desc character varying(200) DEFAULT NULL::character varying,
    eattach_filename character varying(100) DEFAULT NULL::character varying,
    eattach_size integer DEFAULT 0,
    eattach_attachment bytea,
    eattach_type character varying(200) DEFAULT NULL::character varying,
    screen character varying(100) DEFAULT ''::character varying,
    attached_by integer,
    attached_by_name character varying(200),
    attached_time timestamp without time zone DEFAULT now()
);


ALTER TABLE public.hs_hr_emp_attachment OWNER TO admin;

--
-- TOC entry 174 (class 1259 OID 4737283)
-- Name: hs_hr_emp_basicsalary; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_basicsalary (
    id integer NOT NULL,
    emp_number integer DEFAULT 0 NOT NULL,
    sal_grd_code integer,
    currency_id character varying(6) DEFAULT ''::character varying NOT NULL,
    ebsal_basic_salary character varying(100) DEFAULT NULL::character varying,
    payperiod_code character varying(13) DEFAULT NULL::character varying,
    salary_component character varying(100),
    comments character varying(255)
);


ALTER TABLE public.hs_hr_emp_basicsalary OWNER TO admin;

--
-- TOC entry 173 (class 1259 OID 4737281)
-- Name: hs_hr_emp_basicsalary_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE hs_hr_emp_basicsalary_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hs_hr_emp_basicsalary_id_seq OWNER TO admin;

--
-- TOC entry 3615 (class 0 OID 0)
-- Dependencies: 173
-- Name: hs_hr_emp_basicsalary_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE hs_hr_emp_basicsalary_id_seq OWNED BY hs_hr_emp_basicsalary.id;


--
-- TOC entry 179 (class 1259 OID 4737337)
-- Name: hs_hr_emp_children; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_children (
    emp_number integer DEFAULT 0 NOT NULL,
    ec_seqno numeric(2,0) DEFAULT 0::numeric NOT NULL,
    ec_name character varying(100) DEFAULT ''::character varying,
    ec_date_of_birth date
);


ALTER TABLE public.hs_hr_emp_children OWNER TO admin;

--
-- TOC entry 175 (class 1259 OID 4737293)
-- Name: hs_hr_emp_contract_extend; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_contract_extend (
    emp_number integer DEFAULT 0 NOT NULL,
    econ_extend_id numeric(10,0) DEFAULT 0::numeric NOT NULL,
    econ_extend_start_date timestamp without time zone,
    econ_extend_end_date timestamp without time zone
);


ALTER TABLE public.hs_hr_emp_contract_extend OWNER TO admin;

--
-- TOC entry 180 (class 1259 OID 4737345)
-- Name: hs_hr_emp_dependents; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_dependents (
    emp_number integer DEFAULT 0 NOT NULL,
    ed_seqno numeric(2,0) DEFAULT 0::numeric NOT NULL,
    ed_name character varying(100) DEFAULT ''::character varying,
    ed_relationship_type text,
    ed_relationship character varying(100) DEFAULT ''::character varying,
    ed_date_of_birth date
);


ALTER TABLE public.hs_hr_emp_dependents OWNER TO admin;

--
-- TOC entry 187 (class 1259 OID 4737410)
-- Name: hs_hr_emp_directdebit; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_directdebit (
    id integer NOT NULL,
    salary_id integer NOT NULL,
    dd_routing_num integer NOT NULL,
    dd_account character varying(100) DEFAULT ''::character varying NOT NULL,
    dd_amount numeric(11,2) NOT NULL,
    dd_account_type character varying(20) DEFAULT ''::character varying NOT NULL,
    dd_transaction_type character varying(20) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public.hs_hr_emp_directdebit OWNER TO admin;

--
-- TOC entry 186 (class 1259 OID 4737408)
-- Name: hs_hr_emp_directdebit_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE hs_hr_emp_directdebit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hs_hr_emp_directdebit_id_seq OWNER TO admin;

--
-- TOC entry 3616 (class 0 OID 0)
-- Dependencies: 186
-- Name: hs_hr_emp_directdebit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE hs_hr_emp_directdebit_id_seq OWNED BY hs_hr_emp_directdebit.id;


--
-- TOC entry 181 (class 1259 OID 4737357)
-- Name: hs_hr_emp_emergency_contacts; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_emergency_contacts (
    emp_number integer DEFAULT 0 NOT NULL,
    eec_seqno numeric(2,0) DEFAULT 0::numeric NOT NULL,
    eec_name character varying(100) DEFAULT ''::character varying,
    eec_relationship character varying(100) DEFAULT ''::character varying,
    eec_home_no character varying(100) DEFAULT ''::character varying,
    eec_mobile_no character varying(100) DEFAULT ''::character varying,
    eec_office_no character varying(100) DEFAULT ''::character varying
);


ALTER TABLE public.hs_hr_emp_emergency_contacts OWNER TO admin;

--
-- TOC entry 182 (class 1259 OID 4737372)
-- Name: hs_hr_emp_history_of_ealier_pos; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_history_of_ealier_pos (
    emp_number integer DEFAULT 0 NOT NULL,
    emp_seqno numeric(2,0) DEFAULT 0::numeric NOT NULL,
    ehoep_job_title character varying(100) DEFAULT ''::character varying,
    ehoep_years character varying(100) DEFAULT ''::character varying
);


ALTER TABLE public.hs_hr_emp_history_of_ealier_pos OWNER TO admin;

--
-- TOC entry 176 (class 1259 OID 4737300)
-- Name: hs_hr_emp_language; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_language (
    emp_number integer DEFAULT 0 NOT NULL,
    lang_id integer NOT NULL,
    fluency smallint DEFAULT 0::smallint NOT NULL,
    competency smallint DEFAULT 0::smallint,
    comments character varying(100)
);


ALTER TABLE public.hs_hr_emp_language OWNER TO admin;

--
-- TOC entry 235 (class 1259 OID 4737745)
-- Name: hs_hr_emp_locations; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_locations (
    emp_number integer NOT NULL,
    location_id integer NOT NULL
);


ALTER TABLE public.hs_hr_emp_locations OWNER TO admin;

--
-- TOC entry 184 (class 1259 OID 4737387)
-- Name: hs_hr_emp_member_detail; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_member_detail (
    emp_number integer DEFAULT 0 NOT NULL,
    membship_code integer DEFAULT 0 NOT NULL,
    ememb_subscript_ownership character varying(20) DEFAULT NULL::character varying,
    ememb_subscript_amount numeric(15,2) DEFAULT NULL::numeric,
    ememb_subs_currency character varying(20) DEFAULT NULL::character varying,
    ememb_commence_date date,
    ememb_renewal_date date
);


ALTER TABLE public.hs_hr_emp_member_detail OWNER TO admin;

--
-- TOC entry 185 (class 1259 OID 4737397)
-- Name: hs_hr_emp_passport; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_passport (
    emp_number integer DEFAULT 0 NOT NULL,
    ep_seqno numeric(2,0) DEFAULT 0::numeric NOT NULL,
    ep_passport_num character varying(100) DEFAULT ''::character varying NOT NULL,
    ep_passportissueddate timestamp without time zone,
    ep_passportexpiredate timestamp without time zone,
    ep_comments character varying(255) DEFAULT NULL::character varying,
    ep_passport_type_flg smallint,
    ep_i9_status character varying(100) DEFAULT ''::character varying,
    ep_i9_review_date date,
    cou_code character varying(6) DEFAULT NULL::character varying
);


ALTER TABLE public.hs_hr_emp_passport OWNER TO admin;

--
-- TOC entry 189 (class 1259 OID 4737425)
-- Name: hs_hr_emp_picture; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_picture (
    emp_number integer DEFAULT 0 NOT NULL,
    epic_picture bytea,
    epic_filename character varying(100) DEFAULT NULL::character varying,
    epic_type character varying(50) DEFAULT NULL::character varying,
    epic_file_size character varying(20) DEFAULT NULL::character varying,
    epic_file_width character varying(20) DEFAULT NULL::character varying,
    epic_file_height character varying(20) DEFAULT NULL::character varying
);


ALTER TABLE public.hs_hr_emp_picture OWNER TO admin;

--
-- TOC entry 192 (class 1259 OID 4737451)
-- Name: hs_hr_emp_reportto; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_reportto (
    erep_sup_emp_number integer DEFAULT 0 NOT NULL,
    erep_sub_emp_number integer DEFAULT 0 NOT NULL,
    erep_reporting_mode integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.hs_hr_emp_reportto OWNER TO admin;

--
-- TOC entry 188 (class 1259 OID 4737419)
-- Name: hs_hr_emp_skill; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_skill (
    emp_number integer DEFAULT 0 NOT NULL,
    skill_id integer NOT NULL,
    years_of_exp numeric(2,0) DEFAULT NULL::numeric,
    comments character varying(100) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public.hs_hr_emp_skill OWNER TO admin;

--
-- TOC entry 177 (class 1259 OID 4737308)
-- Name: hs_hr_emp_us_tax; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_us_tax (
    emp_number integer DEFAULT 0 NOT NULL,
    tax_federal_status character varying(13) DEFAULT NULL::character varying,
    tax_federal_exceptions integer DEFAULT 0,
    tax_state character varying(13) DEFAULT NULL::character varying,
    tax_state_status character varying(13) DEFAULT NULL::character varying,
    tax_state_exceptions integer DEFAULT 0,
    tax_unemp_state character varying(13) DEFAULT NULL::character varying,
    tax_work_state character varying(13) DEFAULT NULL::character varying
);


ALTER TABLE public.hs_hr_emp_us_tax OWNER TO admin;

--
-- TOC entry 195 (class 1259 OID 4737467)
-- Name: hs_hr_emp_work_experience; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_emp_work_experience (
    emp_number integer DEFAULT 0 NOT NULL,
    eexp_seqno numeric(10,0) DEFAULT 0::numeric NOT NULL,
    eexp_employer character varying(100) DEFAULT NULL::character varying,
    eexp_jobtit character varying(120) DEFAULT NULL::character varying,
    eexp_from_date timestamp without time zone,
    eexp_to_date timestamp without time zone,
    eexp_comments character varying(200) DEFAULT NULL::character varying,
    eexp_internal integer
);


ALTER TABLE public.hs_hr_emp_work_experience OWNER TO admin;

--
-- TOC entry 196 (class 1259 OID 4737477)
-- Name: hs_hr_employee; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_employee (
    emp_number integer DEFAULT 0 NOT NULL,
    employee_id character varying(50) DEFAULT NULL::character varying,
    emp_lastname character varying(100) DEFAULT ''::character varying NOT NULL,
    emp_firstname character varying(100) DEFAULT ''::character varying NOT NULL,
    emp_middle_name character varying(100) DEFAULT ''::character varying NOT NULL,
    emp_nick_name character varying(100) DEFAULT ''::character varying,
    emp_smoker smallint DEFAULT 0::smallint,
    ethnic_race_code character varying(13) DEFAULT NULL::character varying,
    emp_birthday date,
    nation_code integer,
    emp_gender smallint,
    emp_marital_status character varying(20) DEFAULT NULL::character varying,
    emp_ssn_num character varying(100) DEFAULT ''::character varying,
    emp_sin_num character varying(100) DEFAULT ''::character varying,
    emp_other_id character varying(100) DEFAULT ''::character varying,
    emp_dri_lice_num character varying(100) DEFAULT ''::character varying,
    emp_dri_lice_exp_date date,
    emp_military_service character varying(100) DEFAULT ''::character varying,
    emp_status integer,
    job_title_code integer,
    eeo_cat_code integer,
    work_station integer,
    emp_street1 character varying(100) DEFAULT ''::character varying,
    emp_street2 character varying(100) DEFAULT ''::character varying,
    city_code character varying(100) DEFAULT ''::character varying,
    coun_code character varying(100) DEFAULT ''::character varying,
    provin_code character varying(100) DEFAULT ''::character varying,
    emp_zipcode character varying(20) DEFAULT NULL::character varying,
    emp_hm_telephone character varying(50) DEFAULT NULL::character varying,
    emp_mobile character varying(50) DEFAULT NULL::character varying,
    emp_work_telephone character varying(50) DEFAULT NULL::character varying,
    emp_work_email character varying(50) DEFAULT NULL::character varying,
    sal_grd_code character varying(13) DEFAULT NULL::character varying,
    joined_date date,
    emp_oth_email character varying(50) DEFAULT NULL::character varying,
    termination_id integer,
    custom1 character varying(250) DEFAULT NULL::character varying,
    custom2 character varying(250) DEFAULT NULL::character varying,
    custom3 character varying(250) DEFAULT NULL::character varying,
    custom4 character varying(250) DEFAULT NULL::character varying,
    custom5 character varying(250) DEFAULT NULL::character varying,
    custom6 character varying(250) DEFAULT NULL::character varying,
    custom7 character varying(250) DEFAULT NULL::character varying,
    custom8 character varying(250) DEFAULT NULL::character varying,
    custom9 character varying(250) DEFAULT NULL::character varying,
    custom10 character varying(250) DEFAULT NULL::character varying
);


ALTER TABLE public.hs_hr_employee OWNER TO admin;

--
-- TOC entry 166 (class 1259 OID 4716673)
-- Name: hs_hr_jobtit_empstat; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_jobtit_empstat (
    jobtit_code numeric NOT NULL,
    estat_code numeric NOT NULL
);


ALTER TABLE public.hs_hr_jobtit_empstat OWNER TO admin;

--
-- TOC entry 236 (class 1259 OID 4737750)
-- Name: hs_hr_kpi; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_kpi (
    id integer NOT NULL,
    job_title_code character varying(13) DEFAULT NULL::character varying,
    description character varying(200) DEFAULT NULL::character varying,
    rate_min numeric,
    rate_max numeric,
    rate_default smallint,
    is_active smallint
);


ALTER TABLE public.hs_hr_kpi OWNER TO admin;

--
-- TOC entry 217 (class 1259 OID 4737648)
-- Name: hs_hr_mailnotifications; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_mailnotifications (
    user_id integer NOT NULL,
    notification_type_id integer NOT NULL,
    status integer NOT NULL,
    email character varying(100) DEFAULT NULL::character varying
);


ALTER TABLE public.hs_hr_mailnotifications OWNER TO admin;

--
-- TOC entry 203 (class 1259 OID 4737557)
-- Name: hs_hr_module; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_module (
    mod_id character varying(36) DEFAULT ''::character varying NOT NULL,
    name character varying(45) DEFAULT NULL::character varying,
    owner character varying(45) DEFAULT NULL::character varying,
    owner_email character varying(100) DEFAULT NULL::character varying,
    version character varying(36) DEFAULT NULL::character varying,
    description text
);


ALTER TABLE public.hs_hr_module OWNER TO admin;

--
-- TOC entry 232 (class 1259 OID 4737723)
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


ALTER TABLE public.hs_hr_pay_period OWNER TO admin;

--
-- TOC entry 172 (class 1259 OID 4737274)
-- Name: hs_hr_payperiod; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_payperiod (
    payperiod_code character varying(13) DEFAULT ''::character varying NOT NULL,
    payperiod_name character varying(100) DEFAULT NULL::character varying
);


ALTER TABLE public.hs_hr_payperiod OWNER TO admin;

--
-- TOC entry 237 (class 1259 OID 4737760)
-- Name: hs_hr_performance_review; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_performance_review (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    reviewer_id integer NOT NULL,
    creator_id character varying(36) DEFAULT NULL::character varying,
    job_title_code character varying(10) NOT NULL,
    sub_division_id integer,
    creation_date date NOT NULL,
    period_from date NOT NULL,
    period_to date NOT NULL,
    due_date date NOT NULL,
    state smallint,
    kpis text
);


ALTER TABLE public.hs_hr_performance_review OWNER TO admin;

--
-- TOC entry 239 (class 1259 OID 4737771)
-- Name: hs_hr_performance_review_comments; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_performance_review_comments (
    id integer NOT NULL,
    pr_id integer NOT NULL,
    employee_id integer,
    comment text,
    create_date date NOT NULL
);


ALTER TABLE public.hs_hr_performance_review_comments OWNER TO admin;

--
-- TOC entry 238 (class 1259 OID 4737769)
-- Name: hs_hr_performance_review_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE hs_hr_performance_review_comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hs_hr_performance_review_comments_id_seq OWNER TO admin;

--
-- TOC entry 3617 (class 0 OID 0)
-- Dependencies: 238
-- Name: hs_hr_performance_review_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE hs_hr_performance_review_comments_id_seq OWNED BY hs_hr_performance_review_comments.id;


--
-- TOC entry 205 (class 1259 OID 4737572)
-- Name: hs_hr_province; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_province (
    id integer NOT NULL,
    province_name character varying(40) DEFAULT ''::character varying NOT NULL,
    province_code character(2) DEFAULT ''::bpchar NOT NULL,
    cou_code character(2) DEFAULT 'us'::bpchar NOT NULL
);


ALTER TABLE public.hs_hr_province OWNER TO admin;

--
-- TOC entry 204 (class 1259 OID 4737570)
-- Name: hs_hr_province_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE hs_hr_province_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hs_hr_province_id_seq OWNER TO admin;

--
-- TOC entry 3618 (class 0 OID 0)
-- Dependencies: 204
-- Name: hs_hr_province_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE hs_hr_province_id_seq OWNED BY hs_hr_province.id;


--
-- TOC entry 226 (class 1259 OID 4737690)
-- Name: hs_hr_unique_id; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE hs_hr_unique_id (
    id integer NOT NULL,
    last_id integer NOT NULL,
    table_name character varying(50) NOT NULL,
    field_name character varying(50) NOT NULL
);


ALTER TABLE public.hs_hr_unique_id OWNER TO admin;

--
-- TOC entry 225 (class 1259 OID 4737688)
-- Name: hs_hr_unique_id_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE hs_hr_unique_id_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hs_hr_unique_id_id_seq OWNER TO admin;

--
-- TOC entry 3619 (class 0 OID 0)
-- Dependencies: 225
-- Name: hs_hr_unique_id_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE hs_hr_unique_id_id_seq OWNED BY hs_hr_unique_id.id;


--
-- TOC entry 352 (class 1259 OID 4738449)
-- Name: ohrm_advanced_report; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_advanced_report (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    definition text NOT NULL
);


ALTER TABLE public.ohrm_advanced_report OWNER TO admin;

--
-- TOC entry 245 (class 1259 OID 4737814)
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


ALTER TABLE public.ohrm_attendance_record OWNER TO admin;

--
-- TOC entry 256 (class 1259 OID 4737900)
-- Name: ohrm_available_group_field; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_available_group_field (
    report_group_id bigint NOT NULL,
    group_field_id bigint NOT NULL
);


ALTER TABLE public.ohrm_available_group_field OWNER TO admin;

--
-- TOC entry 254 (class 1259 OID 4737879)
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
    is_value_list boolean DEFAULT false NOT NULL,
    display_field_group_id integer,
    default_value character varying(255) DEFAULT NULL::character varying,
    is_encrypted boolean DEFAULT false NOT NULL,
    is_meta boolean DEFAULT false NOT NULL
);


ALTER TABLE public.ohrm_composite_display_field OWNER TO admin;

--
-- TOC entry 253 (class 1259 OID 4737877)
-- Name: ohrm_composite_display_field_composite_display_field_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_composite_display_field_composite_display_field_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_composite_display_field_composite_display_field_id_seq OWNER TO admin;

--
-- TOC entry 3620 (class 0 OID 0)
-- Dependencies: 253
-- Name: ohrm_composite_display_field_composite_display_field_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_composite_display_field_composite_display_field_id_seq OWNED BY ohrm_composite_display_field.composite_display_field_id;


--
-- TOC entry 219 (class 1259 OID 4737654)
-- Name: ohrm_customer; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_customer (
    customer_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(255) DEFAULT NULL::character varying,
    is_deleted smallint DEFAULT 0
);


ALTER TABLE public.ohrm_customer OWNER TO admin;

--
-- TOC entry 218 (class 1259 OID 4737652)
-- Name: ohrm_customer_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_customer_customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_customer_customer_id_seq OWNER TO admin;

--
-- TOC entry 3621 (class 0 OID 0)
-- Dependencies: 218
-- Name: ohrm_customer_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_customer_customer_id_seq OWNED BY ohrm_customer.customer_id;


--
-- TOC entry 326 (class 1259 OID 4738308)
-- Name: ohrm_data_group; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_data_group (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    can_read smallint,
    can_create smallint,
    can_update smallint,
    can_delete smallint
);


ALTER TABLE public.ohrm_data_group OWNER TO admin;

--
-- TOC entry 325 (class 1259 OID 4738306)
-- Name: ohrm_data_group_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_data_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_data_group_id_seq OWNER TO admin;

--
-- TOC entry 3622 (class 0 OID 0)
-- Dependencies: 325
-- Name: ohrm_data_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_data_group_id_seq OWNED BY ohrm_data_group.id;


--
-- TOC entry 252 (class 1259 OID 4737864)
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
    is_value_list boolean DEFAULT false NOT NULL,
    display_field_group_id integer,
    default_value character varying(255) DEFAULT NULL::character varying,
    is_encrypted boolean DEFAULT false NOT NULL,
    is_meta boolean DEFAULT false NOT NULL
);


ALTER TABLE public.ohrm_display_field OWNER TO admin;

--
-- TOC entry 251 (class 1259 OID 4737862)
-- Name: ohrm_display_field_display_field_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_display_field_display_field_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_display_field_display_field_id_seq OWNER TO admin;

--
-- TOC entry 3623 (class 0 OID 0)
-- Dependencies: 251
-- Name: ohrm_display_field_display_field_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_display_field_display_field_id_seq OWNED BY ohrm_display_field.display_field_id;


--
-- TOC entry 263 (class 1259 OID 4737935)
-- Name: ohrm_display_field_group; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_display_field_group (
    id integer NOT NULL,
    report_group_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    is_list boolean DEFAULT false NOT NULL
);


ALTER TABLE public.ohrm_display_field_group OWNER TO admin;

--
-- TOC entry 262 (class 1259 OID 4737933)
-- Name: ohrm_display_field_group_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_display_field_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_display_field_group_id_seq OWNER TO admin;

--
-- TOC entry 3624 (class 0 OID 0)
-- Dependencies: 262
-- Name: ohrm_display_field_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_display_field_group_id_seq OWNED BY ohrm_display_field_group.id;


--
-- TOC entry 207 (class 1259 OID 4737583)
-- Name: ohrm_education; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_education (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.ohrm_education OWNER TO admin;

--
-- TOC entry 206 (class 1259 OID 4737581)
-- Name: ohrm_education_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_education_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_education_id_seq OWNER TO admin;

--
-- TOC entry 3625 (class 0 OID 0)
-- Dependencies: 206
-- Name: ohrm_education_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_education_id_seq OWNED BY ohrm_education.id;


--
-- TOC entry 308 (class 1259 OID 4738206)
-- Name: ohrm_email; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_email (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.ohrm_email OWNER TO admin;

--
-- TOC entry 324 (class 1259 OID 4738290)
-- Name: ohrm_email_configuration; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_email_configuration (
    id integer NOT NULL,
    mail_type character varying(50) DEFAULT NULL::character varying,
    sent_as character varying(250) NOT NULL,
    sendmail_path character varying(250) DEFAULT NULL::character varying,
    smtp_host character varying(250) DEFAULT NULL::character varying,
    smtp_port integer,
    smtp_username character varying(250) DEFAULT NULL::character varying,
    smtp_password character varying(250) DEFAULT NULL::character varying,
    smtp_auth_type character varying(50) DEFAULT NULL::character varying,
    smtp_security_type character varying(50) DEFAULT NULL::character varying
);


ALTER TABLE public.ohrm_email_configuration OWNER TO admin;

--
-- TOC entry 323 (class 1259 OID 4738288)
-- Name: ohrm_email_configuration_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_email_configuration_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_email_configuration_id_seq OWNER TO admin;

--
-- TOC entry 3626 (class 0 OID 0)
-- Dependencies: 323
-- Name: ohrm_email_configuration_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_email_configuration_id_seq OWNED BY ohrm_email_configuration.id;


--
-- TOC entry 307 (class 1259 OID 4738204)
-- Name: ohrm_email_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_email_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_email_id_seq OWNER TO admin;

--
-- TOC entry 3627 (class 0 OID 0)
-- Dependencies: 307
-- Name: ohrm_email_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_email_id_seq OWNED BY ohrm_email.id;


--
-- TOC entry 304 (class 1259 OID 4738190)
-- Name: ohrm_email_notification; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_email_notification (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    is_enable integer NOT NULL
);


ALTER TABLE public.ohrm_email_notification OWNER TO admin;

--
-- TOC entry 303 (class 1259 OID 4738188)
-- Name: ohrm_email_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_email_notification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_email_notification_id_seq OWNER TO admin;

--
-- TOC entry 3628 (class 0 OID 0)
-- Dependencies: 303
-- Name: ohrm_email_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_email_notification_id_seq OWNED BY ohrm_email_notification.id;


--
-- TOC entry 312 (class 1259 OID 4738229)
-- Name: ohrm_email_processor; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_email_processor (
    id integer NOT NULL,
    email_id integer NOT NULL,
    class_name character varying(100)
);


ALTER TABLE public.ohrm_email_processor OWNER TO admin;

--
-- TOC entry 311 (class 1259 OID 4738227)
-- Name: ohrm_email_processor_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_email_processor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_email_processor_id_seq OWNER TO admin;

--
-- TOC entry 3629 (class 0 OID 0)
-- Dependencies: 311
-- Name: ohrm_email_processor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_email_processor_id_seq OWNED BY ohrm_email_processor.id;


--
-- TOC entry 306 (class 1259 OID 4738198)
-- Name: ohrm_email_subscriber; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_email_subscriber (
    id integer NOT NULL,
    notification_id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL
);


ALTER TABLE public.ohrm_email_subscriber OWNER TO admin;

--
-- TOC entry 305 (class 1259 OID 4738196)
-- Name: ohrm_email_subscriber_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_email_subscriber_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_email_subscriber_id_seq OWNER TO admin;

--
-- TOC entry 3630 (class 0 OID 0)
-- Dependencies: 305
-- Name: ohrm_email_subscriber_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_email_subscriber_id_seq OWNED BY ohrm_email_subscriber.id;


--
-- TOC entry 310 (class 1259 OID 4738216)
-- Name: ohrm_email_template; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_email_template (
    id integer NOT NULL,
    email_id integer NOT NULL,
    locale character varying(20),
    performer_role character varying(50) DEFAULT NULL::character varying,
    recipient_role character varying(50) DEFAULT NULL::character varying,
    subject character varying(255),
    body text
);


ALTER TABLE public.ohrm_email_template OWNER TO admin;

--
-- TOC entry 309 (class 1259 OID 4738214)
-- Name: ohrm_email_template_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_email_template_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_email_template_id_seq OWNER TO admin;

--
-- TOC entry 3631 (class 0 OID 0)
-- Dependencies: 309
-- Name: ohrm_email_template_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_email_template_id_seq OWNED BY ohrm_email_template.id;


--
-- TOC entry 191 (class 1259 OID 4737441)
-- Name: ohrm_emp_education; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_emp_education (
    id integer NOT NULL,
    emp_number integer NOT NULL,
    education_id integer NOT NULL,
    institute character varying(100) DEFAULT NULL::character varying,
    major character varying(100) DEFAULT NULL::character varying,
    year numeric(4,0) DEFAULT NULL::numeric,
    score character varying(25) DEFAULT NULL::character varying,
    start_date date,
    end_date date
);


ALTER TABLE public.ohrm_emp_education OWNER TO admin;

--
-- TOC entry 190 (class 1259 OID 4737439)
-- Name: ohrm_emp_education_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_emp_education_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_emp_education_id_seq OWNER TO admin;

--
-- TOC entry 3632 (class 0 OID 0)
-- Dependencies: 190
-- Name: ohrm_emp_education_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_emp_education_id_seq OWNED BY ohrm_emp_education.id;


--
-- TOC entry 183 (class 1259 OID 4737381)
-- Name: ohrm_emp_license; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_emp_license (
    emp_number integer NOT NULL,
    license_id integer NOT NULL,
    license_no character varying(50) DEFAULT NULL::character varying,
    license_issued_date date,
    license_expiry_date date
);


ALTER TABLE public.ohrm_emp_license OWNER TO admin;

--
-- TOC entry 194 (class 1259 OID 4737461)
-- Name: ohrm_emp_reporting_method; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_emp_reporting_method (
    reporting_method_id integer NOT NULL,
    reporting_method_name character varying(100) NOT NULL
);


ALTER TABLE public.ohrm_emp_reporting_method OWNER TO admin;

--
-- TOC entry 193 (class 1259 OID 4737459)
-- Name: ohrm_emp_reporting_method_reporting_method_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_emp_reporting_method_reporting_method_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_emp_reporting_method_reporting_method_id_seq OWNER TO admin;

--
-- TOC entry 3633 (class 0 OID 0)
-- Dependencies: 193
-- Name: ohrm_emp_reporting_method_reporting_method_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_emp_reporting_method_reporting_method_id_seq OWNED BY ohrm_emp_reporting_method.reporting_method_id;


--
-- TOC entry 289 (class 1259 OID 4738109)
-- Name: ohrm_emp_termination; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_emp_termination (
    id integer NOT NULL,
    emp_number integer,
    reason_id integer,
    termination_date date NOT NULL,
    note character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.ohrm_emp_termination OWNER TO admin;

--
-- TOC entry 288 (class 1259 OID 4738107)
-- Name: ohrm_emp_termination_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_emp_termination_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_emp_termination_id_seq OWNER TO admin;

--
-- TOC entry 3634 (class 0 OID 0)
-- Dependencies: 288
-- Name: ohrm_emp_termination_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_emp_termination_id_seq OWNED BY ohrm_emp_termination.id;


--
-- TOC entry 291 (class 1259 OID 4738118)
-- Name: ohrm_emp_termination_reason; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_emp_termination_reason (
    id integer NOT NULL,
    name character varying(100) DEFAULT NULL::character varying
);


ALTER TABLE public.ohrm_emp_termination_reason OWNER TO admin;

--
-- TOC entry 290 (class 1259 OID 4738116)
-- Name: ohrm_emp_termination_reason_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_emp_termination_reason_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_emp_termination_reason_id_seq OWNER TO admin;

--
-- TOC entry 3635 (class 0 OID 0)
-- Dependencies: 290
-- Name: ohrm_emp_termination_reason_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_emp_termination_reason_id_seq OWNED BY ohrm_emp_termination_reason.id;


--
-- TOC entry 230 (class 1259 OID 4737708)
-- Name: ohrm_employee_work_shift; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_employee_work_shift (
    work_shift_id integer NOT NULL,
    emp_number integer NOT NULL
);


ALTER TABLE public.ohrm_employee_work_shift OWNER TO admin;

--
-- TOC entry 229 (class 1259 OID 4737706)
-- Name: ohrm_employee_work_shift_work_shift_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_employee_work_shift_work_shift_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_employee_work_shift_work_shift_id_seq OWNER TO admin;

--
-- TOC entry 3636 (class 0 OID 0)
-- Dependencies: 229
-- Name: ohrm_employee_work_shift_work_shift_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_employee_work_shift_work_shift_id_seq OWNED BY ohrm_employee_work_shift.work_shift_id;


--
-- TOC entry 163 (class 1259 OID 4716658)
-- Name: ohrm_employment_status; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_employment_status (
    id integer NOT NULL,
    name character varying(60) NOT NULL
);


ALTER TABLE public.ohrm_employment_status OWNER TO admin;

--
-- TOC entry 162 (class 1259 OID 4716656)
-- Name: ohrm_employment_status_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_employment_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_employment_status_id_seq OWNER TO admin;

--
-- TOC entry 3637 (class 0 OID 0)
-- Dependencies: 162
-- Name: ohrm_employment_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_employment_status_id_seq OWNED BY ohrm_employment_status.id;


--
-- TOC entry 249 (class 1259 OID 4737842)
-- Name: ohrm_filter_field; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_filter_field (
    filter_field_id bigint NOT NULL,
    report_group_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    where_clause_part text NOT NULL,
    filter_field_widget character varying(255),
    condition_no integer NOT NULL,
    required character varying(10) DEFAULT NULL::character varying
);


ALTER TABLE public.ohrm_filter_field OWNER TO admin;

--
-- TOC entry 255 (class 1259 OID 4737892)
-- Name: ohrm_group_field; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_group_field (
    group_field_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    group_by_clause text NOT NULL,
    group_field_widget character varying(255)
);


ALTER TABLE public.ohrm_group_field OWNER TO admin;

--
-- TOC entry 214 (class 1259 OID 4737623)
-- Name: ohrm_holiday; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_holiday (
    id integer NOT NULL,
    description text,
    date date,
    recurring smallint DEFAULT 0,
    length integer,
    operational_country_id integer
);


ALTER TABLE public.ohrm_holiday OWNER TO admin;

--
-- TOC entry 213 (class 1259 OID 4737621)
-- Name: ohrm_holiday_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_holiday_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_holiday_id_seq OWNER TO admin;

--
-- TOC entry 3638 (class 0 OID 0)
-- Dependencies: 213
-- Name: ohrm_holiday_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_holiday_id_seq OWNED BY ohrm_holiday.id;


--
-- TOC entry 354 (class 1259 OID 4738459)
-- Name: ohrm_home_page; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_home_page (
    id integer NOT NULL,
    user_role_id integer NOT NULL,
    action character varying(255),
    enable_class character varying(100) DEFAULT NULL::character varying,
    priority integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.ohrm_home_page OWNER TO admin;

--
-- TOC entry 353 (class 1259 OID 4738457)
-- Name: ohrm_home_page_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_home_page_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_home_page_id_seq OWNER TO admin;

--
-- TOC entry 3639 (class 0 OID 0)
-- Dependencies: 353
-- Name: ohrm_home_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_home_page_id_seq OWNED BY ohrm_home_page.id;


--
-- TOC entry 267 (class 1259 OID 4737959)
-- Name: ohrm_job_candidate; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_candidate (
    id integer NOT NULL,
    first_name character varying(30) NOT NULL,
    middle_name character varying(30) DEFAULT NULL::character varying,
    last_name character varying(30) NOT NULL,
    email character varying(100) NOT NULL,
    contact_number character varying(30) DEFAULT NULL::character varying,
    status integer NOT NULL,
    comment text,
    mode_of_application integer NOT NULL,
    date_of_application date NOT NULL,
    cv_file_id integer,
    cv_text_version text,
    keywords character varying(255) DEFAULT NULL::character varying,
    added_person integer
);


ALTER TABLE public.ohrm_job_candidate OWNER TO admin;

--
-- TOC entry 270 (class 1259 OID 4737979)
-- Name: ohrm_job_candidate_attachment; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_candidate_attachment (
    id integer NOT NULL,
    candidate_id integer NOT NULL,
    file_name character varying(200) NOT NULL,
    file_type character varying(200) DEFAULT NULL::character varying,
    file_size integer NOT NULL,
    file_content bytea,
    attachment_type integer
);


ALTER TABLE public.ohrm_job_candidate_attachment OWNER TO admin;

--
-- TOC entry 269 (class 1259 OID 4737977)
-- Name: ohrm_job_candidate_attachment_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_job_candidate_attachment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_job_candidate_attachment_id_seq OWNER TO admin;

--
-- TOC entry 3640 (class 0 OID 0)
-- Dependencies: 269
-- Name: ohrm_job_candidate_attachment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_job_candidate_attachment_id_seq OWNED BY ohrm_job_candidate_attachment.id;


--
-- TOC entry 276 (class 1259 OID 4738017)
-- Name: ohrm_job_candidate_history; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_candidate_history (
    id integer NOT NULL,
    candidate_id integer NOT NULL,
    vacancy_id integer,
    candidate_vacancy_name character varying(255) DEFAULT NULL::character varying,
    interview_id integer,
    action integer NOT NULL,
    performed_by integer,
    performed_date timestamp without time zone NOT NULL,
    note text,
    interviewers character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.ohrm_job_candidate_history OWNER TO admin;

--
-- TOC entry 275 (class 1259 OID 4738015)
-- Name: ohrm_job_candidate_history_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_job_candidate_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_job_candidate_history_id_seq OWNER TO admin;

--
-- TOC entry 3641 (class 0 OID 0)
-- Dependencies: 275
-- Name: ohrm_job_candidate_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_job_candidate_history_id_seq OWNED BY ohrm_job_candidate_history.id;


--
-- TOC entry 268 (class 1259 OID 4737970)
-- Name: ohrm_job_candidate_vacancy; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_candidate_vacancy (
    id integer,
    candidate_id integer NOT NULL,
    vacancy_id integer NOT NULL,
    status character varying(100) NOT NULL,
    applied_date date NOT NULL
);


ALTER TABLE public.ohrm_job_candidate_vacancy OWNER TO admin;

--
-- TOC entry 165 (class 1259 OID 4716666)
-- Name: ohrm_job_category; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_category (
    id integer NOT NULL,
    name character varying(60) DEFAULT NULL::character varying
);


ALTER TABLE public.ohrm_job_category OWNER TO admin;

--
-- TOC entry 164 (class 1259 OID 4716664)
-- Name: ohrm_job_category_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_job_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_job_category_id_seq OWNER TO admin;

--
-- TOC entry 3642 (class 0 OID 0)
-- Dependencies: 164
-- Name: ohrm_job_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_job_category_id_seq OWNED BY ohrm_job_category.id;


--
-- TOC entry 278 (class 1259 OID 4738030)
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


ALTER TABLE public.ohrm_job_interview OWNER TO admin;

--
-- TOC entry 274 (class 1259 OID 4738004)
-- Name: ohrm_job_interview_attachment; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_interview_attachment (
    id integer NOT NULL,
    interview_id integer NOT NULL,
    file_name character varying(200) NOT NULL,
    file_type character varying(200) DEFAULT NULL::character varying,
    file_size integer NOT NULL,
    file_content bytea,
    attachment_type integer,
    comment character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.ohrm_job_interview_attachment OWNER TO admin;

--
-- TOC entry 273 (class 1259 OID 4738002)
-- Name: ohrm_job_interview_attachment_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_job_interview_attachment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_job_interview_attachment_id_seq OWNER TO admin;

--
-- TOC entry 3643 (class 0 OID 0)
-- Dependencies: 273
-- Name: ohrm_job_interview_attachment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_job_interview_attachment_id_seq OWNED BY ohrm_job_interview_attachment.id;


--
-- TOC entry 277 (class 1259 OID 4738028)
-- Name: ohrm_job_interview_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_job_interview_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_job_interview_id_seq OWNER TO admin;

--
-- TOC entry 3644 (class 0 OID 0)
-- Dependencies: 277
-- Name: ohrm_job_interview_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_job_interview_id_seq OWNED BY ohrm_job_interview.id;


--
-- TOC entry 279 (class 1259 OID 4738039)
-- Name: ohrm_job_interview_interviewer; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_interview_interviewer (
    interview_id integer NOT NULL,
    interviewer_id integer NOT NULL
);


ALTER TABLE public.ohrm_job_interview_interviewer OWNER TO admin;

--
-- TOC entry 287 (class 1259 OID 4738097)
-- Name: ohrm_job_specification_attachment; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_specification_attachment (
    id integer NOT NULL,
    job_title_id integer NOT NULL,
    file_name character varying(200) NOT NULL,
    file_type character varying(200) DEFAULT NULL::character varying,
    file_size integer NOT NULL,
    file_content bytea
);


ALTER TABLE public.ohrm_job_specification_attachment OWNER TO admin;

--
-- TOC entry 286 (class 1259 OID 4738095)
-- Name: ohrm_job_specification_attachment_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_job_specification_attachment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_job_specification_attachment_id_seq OWNER TO admin;

--
-- TOC entry 3645 (class 0 OID 0)
-- Dependencies: 286
-- Name: ohrm_job_specification_attachment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_job_specification_attachment_id_seq OWNED BY ohrm_job_specification_attachment.id;


--
-- TOC entry 285 (class 1259 OID 4738083)
-- Name: ohrm_job_title; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_title (
    id integer NOT NULL,
    job_title character varying(100) NOT NULL,
    job_description character varying(400) DEFAULT NULL::character varying,
    note character varying(400) DEFAULT NULL::character varying,
    is_deleted smallint DEFAULT 0
);


ALTER TABLE public.ohrm_job_title OWNER TO admin;

--
-- TOC entry 284 (class 1259 OID 4738081)
-- Name: ohrm_job_title_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_job_title_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_job_title_id_seq OWNER TO admin;

--
-- TOC entry 3646 (class 0 OID 0)
-- Dependencies: 284
-- Name: ohrm_job_title_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_job_title_id_seq OWNED BY ohrm_job_title.id;


--
-- TOC entry 266 (class 1259 OID 4737950)
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
    published_in_feed boolean DEFAULT false NOT NULL,
    defined_time timestamp without time zone NOT NULL,
    updated_time timestamp without time zone NOT NULL
);


ALTER TABLE public.ohrm_job_vacancy OWNER TO admin;

--
-- TOC entry 272 (class 1259 OID 4737991)
-- Name: ohrm_job_vacancy_attachment; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_job_vacancy_attachment (
    id integer NOT NULL,
    vacancy_id integer NOT NULL,
    file_name character varying(200) NOT NULL,
    file_type character varying(200) DEFAULT NULL::character varying,
    file_size integer NOT NULL,
    file_content bytea,
    attachment_type integer,
    comment character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.ohrm_job_vacancy_attachment OWNER TO admin;

--
-- TOC entry 271 (class 1259 OID 4737989)
-- Name: ohrm_job_vacancy_attachment_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_job_vacancy_attachment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_job_vacancy_attachment_id_seq OWNER TO admin;

--
-- TOC entry 3647 (class 0 OID 0)
-- Dependencies: 271
-- Name: ohrm_job_vacancy_attachment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_job_vacancy_attachment_id_seq OWNED BY ohrm_job_vacancy_attachment.id;


--
-- TOC entry 198 (class 1259 OID 4737523)
-- Name: ohrm_language; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_language (
    id integer NOT NULL,
    name character varying(120) DEFAULT NULL::character varying
);


ALTER TABLE public.ohrm_language OWNER TO admin;

--
-- TOC entry 197 (class 1259 OID 4737521)
-- Name: ohrm_language_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_language_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_language_id_seq OWNER TO admin;

--
-- TOC entry 3648 (class 0 OID 0)
-- Dependencies: 197
-- Name: ohrm_language_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_language_id_seq OWNED BY ohrm_language.id;


--
-- TOC entry 340 (class 1259 OID 4738385)
-- Name: ohrm_leave; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave (
    id integer NOT NULL,
    date date,
    length_hours numeric(6,2) DEFAULT NULL::numeric,
    length_days numeric(6,4) DEFAULT NULL::numeric,
    status smallint,
    comments character varying(256) DEFAULT NULL::character varying,
    leave_request_id integer NOT NULL,
    leave_type_id integer NOT NULL,
    emp_number integer NOT NULL,
    start_time time without time zone,
    end_time time without time zone
);


ALTER TABLE public.ohrm_leave OWNER TO admin;

--
-- TOC entry 336 (class 1259 OID 4738362)
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
    note character varying(255) DEFAULT NULL::character varying,
    adjustment_type integer DEFAULT 0 NOT NULL,
    deleted smallint DEFAULT 0 NOT NULL,
    created_by_id integer,
    created_by_name character varying(255)
);


ALTER TABLE public.ohrm_leave_adjustment OWNER TO admin;

--
-- TOC entry 335 (class 1259 OID 4738360)
-- Name: ohrm_leave_adjustment_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_adjustment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_leave_adjustment_id_seq OWNER TO admin;

--
-- TOC entry 3649 (class 0 OID 0)
-- Dependencies: 335
-- Name: ohrm_leave_adjustment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_adjustment_id_seq OWNED BY ohrm_leave_adjustment.id;


--
-- TOC entry 342 (class 1259 OID 4738396)
-- Name: ohrm_leave_comment; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_comment (
    id integer NOT NULL,
    leave_id integer NOT NULL,
    created timestamp without time zone,
    created_by_name character varying(255) NOT NULL,
    created_by_id integer,
    created_by_emp_number integer,
    comments character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.ohrm_leave_comment OWNER TO admin;

--
-- TOC entry 341 (class 1259 OID 4738394)
-- Name: ohrm_leave_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_leave_comment_id_seq OWNER TO admin;

--
-- TOC entry 3650 (class 0 OID 0)
-- Dependencies: 341
-- Name: ohrm_leave_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_comment_id_seq OWNED BY ohrm_leave_comment.id;


--
-- TOC entry 334 (class 1259 OID 4738348)
-- Name: ohrm_leave_entitlement; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_entitlement (
    id integer NOT NULL,
    emp_number integer NOT NULL,
    no_of_days numeric(19,15) NOT NULL,
    days_used numeric(8,4) DEFAULT 0 NOT NULL,
    leave_type_id integer NOT NULL,
    from_date timestamp without time zone NOT NULL,
    to_date timestamp without time zone,
    credited_date timestamp without time zone,
    note character varying(255) DEFAULT NULL::character varying,
    entitlement_type integer NOT NULL,
    deleted smallint DEFAULT 0 NOT NULL,
    created_by_id integer,
    created_by_name character varying(255)
);


ALTER TABLE public.ohrm_leave_entitlement OWNER TO admin;

--
-- TOC entry 347 (class 1259 OID 4738426)
-- Name: ohrm_leave_entitlement_adjustment; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_entitlement_adjustment (
    id integer NOT NULL,
    adjustment_id integer NOT NULL,
    entitlement_id integer NOT NULL,
    length_days numeric(4,2) DEFAULT NULL::numeric
);


ALTER TABLE public.ohrm_leave_entitlement_adjustment OWNER TO admin;

--
-- TOC entry 346 (class 1259 OID 4738424)
-- Name: ohrm_leave_entitlement_adjustment_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_entitlement_adjustment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_leave_entitlement_adjustment_id_seq OWNER TO admin;

--
-- TOC entry 3651 (class 0 OID 0)
-- Dependencies: 346
-- Name: ohrm_leave_entitlement_adjustment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_entitlement_adjustment_id_seq OWNED BY ohrm_leave_entitlement_adjustment.id;


--
-- TOC entry 333 (class 1259 OID 4738346)
-- Name: ohrm_leave_entitlement_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_entitlement_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_leave_entitlement_id_seq OWNER TO admin;

--
-- TOC entry 3652 (class 0 OID 0)
-- Dependencies: 333
-- Name: ohrm_leave_entitlement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_entitlement_id_seq OWNED BY ohrm_leave_entitlement.id;


--
-- TOC entry 332 (class 1259 OID 4738339)
-- Name: ohrm_leave_entitlement_type; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_entitlement_type (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    is_editable smallint DEFAULT 0 NOT NULL
);


ALTER TABLE public.ohrm_leave_entitlement_type OWNER TO admin;

--
-- TOC entry 331 (class 1259 OID 4738337)
-- Name: ohrm_leave_entitlement_type_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_entitlement_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_leave_entitlement_type_id_seq OWNER TO admin;

--
-- TOC entry 3653 (class 0 OID 0)
-- Dependencies: 331
-- Name: ohrm_leave_entitlement_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_entitlement_type_id_seq OWNED BY ohrm_leave_entitlement_type.id;


--
-- TOC entry 339 (class 1259 OID 4738383)
-- Name: ohrm_leave_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_leave_id_seq OWNER TO admin;

--
-- TOC entry 3654 (class 0 OID 0)
-- Dependencies: 339
-- Name: ohrm_leave_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_id_seq OWNED BY ohrm_leave.id;


--
-- TOC entry 345 (class 1259 OID 4738417)
-- Name: ohrm_leave_leave_entitlement; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_leave_entitlement (
    id integer NOT NULL,
    leave_id integer NOT NULL,
    entitlement_id integer NOT NULL,
    length_days numeric(6,4) DEFAULT NULL::numeric
);


ALTER TABLE public.ohrm_leave_leave_entitlement OWNER TO admin;

--
-- TOC entry 344 (class 1259 OID 4738415)
-- Name: ohrm_leave_leave_entitlement_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_leave_entitlement_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_leave_leave_entitlement_id_seq OWNER TO admin;

--
-- TOC entry 3655 (class 0 OID 0)
-- Dependencies: 344
-- Name: ohrm_leave_leave_entitlement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_leave_entitlement_id_seq OWNED BY ohrm_leave_leave_entitlement.id;


--
-- TOC entry 349 (class 1259 OID 4738435)
-- Name: ohrm_leave_period_history; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_period_history (
    id integer NOT NULL,
    leave_period_start_month integer NOT NULL,
    leave_period_start_day integer NOT NULL,
    created_at date NOT NULL
);


ALTER TABLE public.ohrm_leave_period_history OWNER TO admin;

--
-- TOC entry 348 (class 1259 OID 4738433)
-- Name: ohrm_leave_period_history_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_period_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_leave_period_history_id_seq OWNER TO admin;

--
-- TOC entry 3656 (class 0 OID 0)
-- Dependencies: 348
-- Name: ohrm_leave_period_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_period_history_id_seq OWNED BY ohrm_leave_period_history.id;


--
-- TOC entry 338 (class 1259 OID 4738376)
-- Name: ohrm_leave_request; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_request (
    id integer NOT NULL,
    leave_type_id integer NOT NULL,
    date_applied date NOT NULL,
    emp_number integer NOT NULL,
    comments character varying(256) DEFAULT NULL::character varying
);


ALTER TABLE public.ohrm_leave_request OWNER TO admin;

--
-- TOC entry 343 (class 1259 OID 4738406)
-- Name: ohrm_leave_request_comment; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_request_comment (
    id integer NOT NULL,
    leave_request_id integer NOT NULL,
    created timestamp without time zone,
    created_by_name character varying(255) NOT NULL,
    created_by_id integer,
    created_by_emp_number integer,
    comments character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.ohrm_leave_request_comment OWNER TO admin;

--
-- TOC entry 337 (class 1259 OID 4738374)
-- Name: ohrm_leave_request_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_request_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_leave_request_id_seq OWNER TO admin;

--
-- TOC entry 3657 (class 0 OID 0)
-- Dependencies: 337
-- Name: ohrm_leave_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_request_id_seq OWNED BY ohrm_leave_request.id;


--
-- TOC entry 351 (class 1259 OID 4738443)
-- Name: ohrm_leave_status; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_status (
    id integer NOT NULL,
    status smallint NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.ohrm_leave_status OWNER TO admin;

--
-- TOC entry 350 (class 1259 OID 4738441)
-- Name: ohrm_leave_status_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_leave_status_id_seq OWNER TO admin;

--
-- TOC entry 3658 (class 0 OID 0)
-- Dependencies: 350
-- Name: ohrm_leave_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_status_id_seq OWNED BY ohrm_leave_status.id;


--
-- TOC entry 330 (class 1259 OID 4738329)
-- Name: ohrm_leave_type; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_leave_type (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    deleted smallint DEFAULT 0 NOT NULL,
    exclude_in_reports_if_no_entitlement smallint DEFAULT 0 NOT NULL,
    operational_country_id integer
);


ALTER TABLE public.ohrm_leave_type OWNER TO admin;

--
-- TOC entry 329 (class 1259 OID 4738327)
-- Name: ohrm_leave_type_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_leave_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_leave_type_id_seq OWNER TO admin;

--
-- TOC entry 3659 (class 0 OID 0)
-- Dependencies: 329
-- Name: ohrm_leave_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_leave_type_id_seq OWNED BY ohrm_leave_type.id;


--
-- TOC entry 170 (class 1259 OID 4737260)
-- Name: ohrm_license; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_license (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.ohrm_license OWNER TO admin;

--
-- TOC entry 169 (class 1259 OID 4737258)
-- Name: ohrm_license_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_license_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_license_id_seq OWNER TO admin;

--
-- TOC entry 3660 (class 0 OID 0)
-- Dependencies: 169
-- Name: ohrm_license_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_license_id_seq OWNED BY ohrm_license.id;


--
-- TOC entry 200 (class 1259 OID 4737532)
-- Name: ohrm_location; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_location (
    id integer NOT NULL,
    name character varying(110) NOT NULL,
    country_code character varying(3) NOT NULL,
    province character varying(60) DEFAULT NULL::character varying,
    city character varying(60) DEFAULT NULL::character varying,
    address character varying(255) DEFAULT NULL::character varying,
    zip_code character varying(35) DEFAULT NULL::character varying,
    phone character varying(35) DEFAULT NULL::character varying,
    fax character varying(35) DEFAULT NULL::character varying,
    notes character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.ohrm_location OWNER TO admin;

--
-- TOC entry 199 (class 1259 OID 4737530)
-- Name: ohrm_location_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_location_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_location_id_seq OWNER TO admin;

--
-- TOC entry 3661 (class 0 OID 0)
-- Dependencies: 199
-- Name: ohrm_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_location_id_seq OWNED BY ohrm_location.id;


--
-- TOC entry 300 (class 1259 OID 4738174)
-- Name: ohrm_membership; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_membership (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.ohrm_membership OWNER TO admin;

--
-- TOC entry 299 (class 1259 OID 4738172)
-- Name: ohrm_membership_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_membership_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_membership_id_seq OWNER TO admin;

--
-- TOC entry 3662 (class 0 OID 0)
-- Dependencies: 299
-- Name: ohrm_membership_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_membership_id_seq OWNED BY ohrm_membership.id;


--
-- TOC entry 320 (class 1259 OID 4738267)
-- Name: ohrm_menu_item; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_menu_item (
    id integer NOT NULL,
    menu_title character varying(255) NOT NULL,
    screen_id integer,
    parent_id integer,
    level smallint NOT NULL,
    order_hint integer NOT NULL,
    url_extras character varying(255) DEFAULT NULL::character varying,
    status smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.ohrm_menu_item OWNER TO admin;

--
-- TOC entry 319 (class 1259 OID 4738265)
-- Name: ohrm_menu_item_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_menu_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_menu_item_id_seq OWNER TO admin;

--
-- TOC entry 3663 (class 0 OID 0)
-- Dependencies: 319
-- Name: ohrm_menu_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_menu_item_id_seq OWNED BY ohrm_menu_item.id;


--
-- TOC entry 314 (class 1259 OID 4738237)
-- Name: ohrm_module; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_module (
    id integer NOT NULL,
    name character varying(120) DEFAULT NULL::character varying,
    status smallint DEFAULT 1
);


ALTER TABLE public.ohrm_module OWNER TO admin;

--
-- TOC entry 356 (class 1259 OID 4738469)
-- Name: ohrm_module_default_page; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_module_default_page (
    id integer NOT NULL,
    module_id integer NOT NULL,
    user_role_id integer NOT NULL,
    action character varying(255),
    enable_class character varying(100) DEFAULT NULL::character varying,
    priority integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.ohrm_module_default_page OWNER TO admin;

--
-- TOC entry 355 (class 1259 OID 4738467)
-- Name: ohrm_module_default_page_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_module_default_page_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_module_default_page_id_seq OWNER TO admin;

--
-- TOC entry 3664 (class 0 OID 0)
-- Dependencies: 355
-- Name: ohrm_module_default_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_module_default_page_id_seq OWNED BY ohrm_module_default_page.id;


--
-- TOC entry 313 (class 1259 OID 4738235)
-- Name: ohrm_module_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_module_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_module_id_seq OWNER TO admin;

--
-- TOC entry 3665 (class 0 OID 0)
-- Dependencies: 313
-- Name: ohrm_module_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_module_id_seq OWNED BY ohrm_module.id;


--
-- TOC entry 302 (class 1259 OID 4738182)
-- Name: ohrm_nationality; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_nationality (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.ohrm_nationality OWNER TO admin;

--
-- TOC entry 301 (class 1259 OID 4738180)
-- Name: ohrm_nationality_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_nationality_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_nationality_id_seq OWNER TO admin;

--
-- TOC entry 3666 (class 0 OID 0)
-- Dependencies: 301
-- Name: ohrm_nationality_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_nationality_id_seq OWNED BY ohrm_nationality.id;


--
-- TOC entry 202 (class 1259 OID 4737550)
-- Name: ohrm_operational_country; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_operational_country (
    id integer NOT NULL,
    country_code character(2) DEFAULT NULL::bpchar
);


ALTER TABLE public.ohrm_operational_country OWNER TO admin;

--
-- TOC entry 201 (class 1259 OID 4737548)
-- Name: ohrm_operational_country_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_operational_country_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_operational_country_id_seq OWNER TO admin;

--
-- TOC entry 3667 (class 0 OID 0)
-- Dependencies: 201
-- Name: ohrm_operational_country_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_operational_country_id_seq OWNED BY ohrm_operational_country.id;


--
-- TOC entry 283 (class 1259 OID 4738060)
-- Name: ohrm_organization_gen_info; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_organization_gen_info (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    tax_id character varying(30) DEFAULT NULL::character varying,
    registration_number character varying(30) DEFAULT NULL::character varying,
    phone character varying(30) DEFAULT NULL::character varying,
    fax character varying(30) DEFAULT NULL::character varying,
    email character varying(30) DEFAULT NULL::character varying,
    country character varying(30) DEFAULT NULL::character varying,
    province character varying(30) DEFAULT NULL::character varying,
    city character varying(30) DEFAULT NULL::character varying,
    zip_code character varying(30) DEFAULT NULL::character varying,
    street1 character varying(100) DEFAULT NULL::character varying,
    street2 character varying(100) DEFAULT NULL::character varying,
    note character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.ohrm_organization_gen_info OWNER TO admin;

--
-- TOC entry 282 (class 1259 OID 4738058)
-- Name: ohrm_organization_gen_info_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_organization_gen_info_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_organization_gen_info_id_seq OWNER TO admin;

--
-- TOC entry 3668 (class 0 OID 0)
-- Dependencies: 282
-- Name: ohrm_organization_gen_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_organization_gen_info_id_seq OWNED BY ohrm_organization_gen_info.id;


--
-- TOC entry 212 (class 1259 OID 4737612)
-- Name: ohrm_pay_grade; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_pay_grade (
    id integer NOT NULL,
    name character varying(60) DEFAULT NULL::character varying
);


ALTER TABLE public.ohrm_pay_grade OWNER TO admin;

--
-- TOC entry 210 (class 1259 OID 4737601)
-- Name: ohrm_pay_grade_currency; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_pay_grade_currency (
    pay_grade_id integer NOT NULL,
    currency_id character varying(6) DEFAULT ''::character varying NOT NULL,
    min_salary numeric,
    max_salary numeric
);


ALTER TABLE public.ohrm_pay_grade_currency OWNER TO admin;

--
-- TOC entry 211 (class 1259 OID 4737610)
-- Name: ohrm_pay_grade_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_pay_grade_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_pay_grade_id_seq OWNER TO admin;

--
-- TOC entry 3669 (class 0 OID 0)
-- Dependencies: 211
-- Name: ohrm_pay_grade_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_pay_grade_id_seq OWNED BY ohrm_pay_grade.id;


--
-- TOC entry 221 (class 1259 OID 4737664)
-- Name: ohrm_project; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_project (
    project_id integer NOT NULL,
    customer_id integer NOT NULL,
    name character varying(100) DEFAULT NULL::character varying,
    description character varying(256) DEFAULT NULL::character varying,
    is_deleted smallint DEFAULT 0
);


ALTER TABLE public.ohrm_project OWNER TO admin;

--
-- TOC entry 223 (class 1259 OID 4737675)
-- Name: ohrm_project_activity; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_project_activity (
    activity_id integer NOT NULL,
    project_id integer NOT NULL,
    name character varying(110) DEFAULT NULL::character varying,
    is_deleted smallint DEFAULT 0
);


ALTER TABLE public.ohrm_project_activity OWNER TO admin;

--
-- TOC entry 222 (class 1259 OID 4737673)
-- Name: ohrm_project_activity_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_project_activity_activity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_project_activity_activity_id_seq OWNER TO admin;

--
-- TOC entry 3670 (class 0 OID 0)
-- Dependencies: 222
-- Name: ohrm_project_activity_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_project_activity_activity_id_seq OWNED BY ohrm_project_activity.activity_id;


--
-- TOC entry 224 (class 1259 OID 4737683)
-- Name: ohrm_project_admin; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_project_admin (
    project_id integer NOT NULL,
    emp_number integer NOT NULL
);


ALTER TABLE public.ohrm_project_admin OWNER TO admin;

--
-- TOC entry 220 (class 1259 OID 4737662)
-- Name: ohrm_project_project_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_project_project_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_project_project_id_seq OWNER TO admin;

--
-- TOC entry 3671 (class 0 OID 0)
-- Dependencies: 220
-- Name: ohrm_project_project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_project_project_id_seq OWNED BY ohrm_project.project_id;


--
-- TOC entry 248 (class 1259 OID 4737832)
-- Name: ohrm_report; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_report (
    report_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    report_group_id bigint NOT NULL,
    use_filter_field boolean NOT NULL,
    type character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.ohrm_report OWNER TO admin;

--
-- TOC entry 246 (class 1259 OID 4737822)
-- Name: ohrm_report_group; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_report_group (
    report_group_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    core_sql text NOT NULL
);


ALTER TABLE public.ohrm_report_group OWNER TO admin;

--
-- TOC entry 247 (class 1259 OID 4737830)
-- Name: ohrm_report_report_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_report_report_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_report_report_id_seq OWNER TO admin;

--
-- TOC entry 3672 (class 0 OID 0)
-- Dependencies: 247
-- Name: ohrm_report_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_report_report_id_seq OWNED BY ohrm_report.report_id;


--
-- TOC entry 298 (class 1259 OID 4738164)
-- Name: ohrm_role_user_selection_rule; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_role_user_selection_rule (
    user_role_id integer NOT NULL,
    selection_rule_id integer NOT NULL,
    configurable_params text
);


ALTER TABLE public.ohrm_role_user_selection_rule OWNER TO admin;

--
-- TOC entry 316 (class 1259 OID 4738247)
-- Name: ohrm_screen; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_screen (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    module_id integer NOT NULL,
    action_url character varying(255) NOT NULL
);


ALTER TABLE public.ohrm_screen OWNER TO admin;

--
-- TOC entry 315 (class 1259 OID 4738245)
-- Name: ohrm_screen_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_screen_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_screen_id_seq OWNER TO admin;

--
-- TOC entry 3673 (class 0 OID 0)
-- Dependencies: 315
-- Name: ohrm_screen_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_screen_id_seq OWNED BY ohrm_screen.id;


--
-- TOC entry 259 (class 1259 OID 4737913)
-- Name: ohrm_selected_composite_display_field; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_selected_composite_display_field (
    id bigint NOT NULL,
    composite_display_field_id bigint NOT NULL,
    report_id bigint NOT NULL
);


ALTER TABLE public.ohrm_selected_composite_display_field OWNER TO admin;

--
-- TOC entry 258 (class 1259 OID 4737907)
-- Name: ohrm_selected_display_field; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_selected_display_field (
    id bigint NOT NULL,
    display_field_id bigint NOT NULL,
    report_id bigint NOT NULL
);


ALTER TABLE public.ohrm_selected_display_field OWNER TO admin;

--
-- TOC entry 265 (class 1259 OID 4737944)
-- Name: ohrm_selected_display_field_group; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_selected_display_field_group (
    id integer NOT NULL,
    report_id bigint NOT NULL,
    display_field_group_id integer NOT NULL
);


ALTER TABLE public.ohrm_selected_display_field_group OWNER TO admin;

--
-- TOC entry 264 (class 1259 OID 4737942)
-- Name: ohrm_selected_display_field_group_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_selected_display_field_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_selected_display_field_group_id_seq OWNER TO admin;

--
-- TOC entry 3674 (class 0 OID 0)
-- Dependencies: 264
-- Name: ohrm_selected_display_field_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_selected_display_field_group_id_seq OWNED BY ohrm_selected_display_field_group.id;


--
-- TOC entry 257 (class 1259 OID 4737905)
-- Name: ohrm_selected_display_field_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_selected_display_field_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_selected_display_field_id_seq OWNER TO admin;

--
-- TOC entry 3675 (class 0 OID 0)
-- Dependencies: 257
-- Name: ohrm_selected_display_field_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_selected_display_field_id_seq OWNED BY ohrm_selected_display_field.id;


--
-- TOC entry 250 (class 1259 OID 4737851)
-- Name: ohrm_selected_filter_field; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_selected_filter_field (
    report_id bigint NOT NULL,
    filter_field_id bigint NOT NULL,
    filter_field_order bigint NOT NULL,
    value1 character varying(255) DEFAULT NULL::character varying,
    value2 character varying(255) DEFAULT NULL::character varying,
    where_condition character varying(255) DEFAULT NULL::character varying,
    type character varying(255) NOT NULL
);


ALTER TABLE public.ohrm_selected_filter_field OWNER TO admin;

--
-- TOC entry 261 (class 1259 OID 4737928)
-- Name: ohrm_selected_group_field; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_selected_group_field (
    group_field_id bigint NOT NULL,
    summary_display_field_id bigint NOT NULL,
    report_id bigint NOT NULL
);


ALTER TABLE public.ohrm_selected_group_field OWNER TO admin;

--
-- TOC entry 209 (class 1259 OID 4737591)
-- Name: ohrm_skill; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_skill (
    id integer NOT NULL,
    name character varying(120) DEFAULT NULL::character varying,
    description text
);


ALTER TABLE public.ohrm_skill OWNER TO admin;

--
-- TOC entry 208 (class 1259 OID 4737589)
-- Name: ohrm_skill_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_skill_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_skill_id_seq OWNER TO admin;

--
-- TOC entry 3676 (class 0 OID 0)
-- Dependencies: 208
-- Name: ohrm_skill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_skill_id_seq OWNED BY ohrm_skill.id;


--
-- TOC entry 281 (class 1259 OID 4738046)
-- Name: ohrm_subunit; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_subunit (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    unit_id character varying(100) DEFAULT NULL::character varying,
    description character varying(400),
    lft smallint,
    rgt smallint,
    level smallint
);


ALTER TABLE public.ohrm_subunit OWNER TO admin;

--
-- TOC entry 280 (class 1259 OID 4738044)
-- Name: ohrm_subunit_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_subunit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_subunit_id_seq OWNER TO admin;

--
-- TOC entry 3677 (class 0 OID 0)
-- Dependencies: 280
-- Name: ohrm_subunit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_subunit_id_seq OWNED BY ohrm_subunit.id;


--
-- TOC entry 260 (class 1259 OID 4737918)
-- Name: ohrm_summary_display_field; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_summary_display_field (
    summary_display_field_id bigint NOT NULL,
    function character varying(1000) NOT NULL,
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
    is_value_list boolean DEFAULT false NOT NULL,
    display_field_group_id integer,
    default_value character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.ohrm_summary_display_field OWNER TO admin;

--
-- TOC entry 240 (class 1259 OID 4737780)
-- Name: ohrm_timesheet; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_timesheet (
    timesheet_id bigint NOT NULL,
    state character varying(255) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    employee_id bigint NOT NULL
);


ALTER TABLE public.ohrm_timesheet OWNER TO admin;

--
-- TOC entry 242 (class 1259 OID 4737793)
-- Name: ohrm_timesheet_action_log; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_timesheet_action_log (
    timesheet_action_log_id bigint NOT NULL,
    comment character varying(255) DEFAULT NULL::character varying,
    action character varying(255),
    date_time date NOT NULL,
    performed_by integer NOT NULL,
    timesheet_id bigint NOT NULL
);


ALTER TABLE public.ohrm_timesheet_action_log OWNER TO admin;

--
-- TOC entry 241 (class 1259 OID 4737785)
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


ALTER TABLE public.ohrm_timesheet_item OWNER TO admin;

--
-- TOC entry 322 (class 1259 OID 4738280)
-- Name: ohrm_upgrade_history; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_upgrade_history (
    id integer NOT NULL,
    start_version character varying(30) DEFAULT NULL::character varying,
    end_version character varying(30) DEFAULT NULL::character varying,
    start_increment integer NOT NULL,
    end_increment integer NOT NULL,
    upgraded_date timestamp without time zone
);


ALTER TABLE public.ohrm_upgrade_history OWNER TO admin;

--
-- TOC entry 321 (class 1259 OID 4738278)
-- Name: ohrm_upgrade_history_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_upgrade_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_upgrade_history_id_seq OWNER TO admin;

--
-- TOC entry 3678 (class 0 OID 0)
-- Dependencies: 321
-- Name: ohrm_upgrade_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_upgrade_history_id_seq OWNED BY ohrm_upgrade_history.id;


--
-- TOC entry 293 (class 1259 OID 4738127)
-- Name: ohrm_user; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_user (
    id integer NOT NULL,
    user_role_id integer NOT NULL,
    emp_number integer,
    user_name character varying(40),
    user_password character varying(40) DEFAULT NULL::character varying,
    deleted smallint DEFAULT 0::smallint NOT NULL,
    status smallint DEFAULT 1::smallint NOT NULL,
    date_entered timestamp without time zone,
    date_modified timestamp without time zone,
    modified_user_id integer,
    created_by integer
);


ALTER TABLE public.ohrm_user OWNER TO admin;

--
-- TOC entry 292 (class 1259 OID 4738125)
-- Name: ohrm_user_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_user_id_seq OWNER TO admin;

--
-- TOC entry 3679 (class 0 OID 0)
-- Dependencies: 292
-- Name: ohrm_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_user_id_seq OWNED BY ohrm_user.id;


--
-- TOC entry 295 (class 1259 OID 4738140)
-- Name: ohrm_user_role; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_user_role (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    display_name character varying(255) NOT NULL,
    is_assignable smallint DEFAULT 0,
    is_predefined smallint DEFAULT 0
);


ALTER TABLE public.ohrm_user_role OWNER TO admin;

--
-- TOC entry 328 (class 1259 OID 4738321)
-- Name: ohrm_user_role_data_group; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_user_role_data_group (
    id integer NOT NULL,
    user_role_id integer,
    data_group_id integer,
    can_read smallint,
    can_create smallint,
    can_update smallint,
    can_delete smallint,
    self smallint
);


ALTER TABLE public.ohrm_user_role_data_group OWNER TO admin;

--
-- TOC entry 327 (class 1259 OID 4738319)
-- Name: ohrm_user_role_data_group_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_user_role_data_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_user_role_data_group_id_seq OWNER TO admin;

--
-- TOC entry 3680 (class 0 OID 0)
-- Dependencies: 327
-- Name: ohrm_user_role_data_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_user_role_data_group_id_seq OWNED BY ohrm_user_role_data_group.id;


--
-- TOC entry 294 (class 1259 OID 4738138)
-- Name: ohrm_user_role_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_user_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_user_role_id_seq OWNER TO admin;

--
-- TOC entry 3681 (class 0 OID 0)
-- Dependencies: 294
-- Name: ohrm_user_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_user_role_id_seq OWNED BY ohrm_user_role.id;


--
-- TOC entry 318 (class 1259 OID 4738255)
-- Name: ohrm_user_role_screen; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_user_role_screen (
    id integer NOT NULL,
    user_role_id integer NOT NULL,
    screen_id integer NOT NULL,
    can_read smallint DEFAULT 0::smallint NOT NULL,
    can_create smallint DEFAULT 0::smallint NOT NULL,
    can_update smallint DEFAULT 0::smallint NOT NULL,
    can_delete smallint DEFAULT 0::smallint NOT NULL
);


ALTER TABLE public.ohrm_user_role_screen OWNER TO admin;

--
-- TOC entry 317 (class 1259 OID 4738253)
-- Name: ohrm_user_role_screen_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_user_role_screen_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_user_role_screen_id_seq OWNER TO admin;

--
-- TOC entry 3682 (class 0 OID 0)
-- Dependencies: 317
-- Name: ohrm_user_role_screen_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_user_role_screen_id_seq OWNED BY ohrm_user_role_screen.id;


--
-- TOC entry 297 (class 1259 OID 4738155)
-- Name: ohrm_user_selection_rule; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_user_selection_rule (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    implementation_class character varying(255) NOT NULL,
    rule_xml_data text
);


ALTER TABLE public.ohrm_user_selection_rule OWNER TO admin;

--
-- TOC entry 296 (class 1259 OID 4738153)
-- Name: ohrm_user_selection_rule_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_user_selection_rule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_user_selection_rule_id_seq OWNER TO admin;

--
-- TOC entry 3683 (class 0 OID 0)
-- Dependencies: 296
-- Name: ohrm_user_selection_rule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_user_selection_rule_id_seq OWNED BY ohrm_user_selection_rule.id;


--
-- TOC entry 228 (class 1259 OID 4737700)
-- Name: ohrm_work_shift; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_work_shift (
    id integer NOT NULL,
    name character varying(250) NOT NULL,
    hours_per_day numeric(4,2) NOT NULL
);


ALTER TABLE public.ohrm_work_shift OWNER TO admin;

--
-- TOC entry 227 (class 1259 OID 4737698)
-- Name: ohrm_work_shift_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_work_shift_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_work_shift_id_seq OWNER TO admin;

--
-- TOC entry 3684 (class 0 OID 0)
-- Dependencies: 227
-- Name: ohrm_work_shift_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_work_shift_id_seq OWNED BY ohrm_work_shift.id;


--
-- TOC entry 216 (class 1259 OID 4737635)
-- Name: ohrm_work_week; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE ohrm_work_week (
    id integer NOT NULL,
    operational_country_id integer,
    mon smallint DEFAULT 0 NOT NULL,
    tue smallint DEFAULT 0 NOT NULL,
    wed smallint DEFAULT 0 NOT NULL,
    thu smallint DEFAULT 0 NOT NULL,
    fri smallint DEFAULT 0 NOT NULL,
    sat smallint DEFAULT 0 NOT NULL,
    sun smallint DEFAULT 0 NOT NULL
);


ALTER TABLE public.ohrm_work_week OWNER TO admin;

--
-- TOC entry 215 (class 1259 OID 4737633)
-- Name: ohrm_work_week_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_work_week_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_work_week_id_seq OWNER TO admin;

--
-- TOC entry 3685 (class 0 OID 0)
-- Dependencies: 215
-- Name: ohrm_work_week_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_work_week_id_seq OWNED BY ohrm_work_week.id;


--
-- TOC entry 244 (class 1259 OID 4737804)
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


ALTER TABLE public.ohrm_workflow_state_machine OWNER TO admin;

--
-- TOC entry 243 (class 1259 OID 4737802)
-- Name: ohrm_workflow_state_machine_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE ohrm_workflow_state_machine_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohrm_workflow_state_machine_id_seq OWNER TO admin;

--
-- TOC entry 3686 (class 0 OID 0)
-- Dependencies: 243
-- Name: ohrm_workflow_state_machine_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE ohrm_workflow_state_machine_id_seq OWNED BY ohrm_workflow_state_machine.id;


--
-- TOC entry 2821 (class 2604 OID 4737286)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_basicsalary ALTER COLUMN id SET DEFAULT nextval('hs_hr_emp_basicsalary_id_seq'::regclass);


--
-- TOC entry 2877 (class 2604 OID 4737413)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_emp_directdebit ALTER COLUMN id SET DEFAULT nextval('hs_hr_emp_directdebit_id_seq'::regclass);


--
-- TOC entry 2996 (class 2604 OID 4737774)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_performance_review_comments ALTER COLUMN id SET DEFAULT nextval('hs_hr_performance_review_comments_id_seq'::regclass);


--
-- TOC entry 2957 (class 2604 OID 4737575)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_province ALTER COLUMN id SET DEFAULT nextval('hs_hr_province_id_seq'::regclass);


--
-- TOC entry 2988 (class 2604 OID 4737693)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY hs_hr_unique_id ALTER COLUMN id SET DEFAULT nextval('hs_hr_unique_id_id_seq'::regclass);


--
-- TOC entry 3011 (class 2604 OID 4737882)
-- Name: composite_display_field_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_composite_display_field ALTER COLUMN composite_display_field_id SET DEFAULT nextval('ohrm_composite_display_field_composite_display_field_id_seq'::regclass);


--
-- TOC entry 2978 (class 2604 OID 4737657)
-- Name: customer_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_customer ALTER COLUMN customer_id SET DEFAULT nextval('ohrm_customer_customer_id_seq'::regclass);


--
-- TOC entry 3103 (class 2604 OID 4738311)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_data_group ALTER COLUMN id SET DEFAULT nextval('ohrm_data_group_id_seq'::regclass);


--
-- TOC entry 3006 (class 2604 OID 4737867)
-- Name: display_field_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_display_field ALTER COLUMN display_field_id SET DEFAULT nextval('ohrm_display_field_display_field_id_seq'::regclass);


--
-- TOC entry 3019 (class 2604 OID 4737938)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_display_field_group ALTER COLUMN id SET DEFAULT nextval('ohrm_display_field_group_id_seq'::regclass);


--
-- TOC entry 2961 (class 2604 OID 4737586)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_education ALTER COLUMN id SET DEFAULT nextval('ohrm_education_id_seq'::regclass);


--
-- TOC entry 3075 (class 2604 OID 4738209)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_email ALTER COLUMN id SET DEFAULT nextval('ohrm_email_id_seq'::regclass);


--
-- TOC entry 3095 (class 2604 OID 4738293)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_email_configuration ALTER COLUMN id SET DEFAULT nextval('ohrm_email_configuration_id_seq'::regclass);


--
-- TOC entry 3073 (class 2604 OID 4738193)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_email_notification ALTER COLUMN id SET DEFAULT nextval('ohrm_email_notification_id_seq'::regclass);


--
-- TOC entry 3079 (class 2604 OID 4738232)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_email_processor ALTER COLUMN id SET DEFAULT nextval('ohrm_email_processor_id_seq'::regclass);


--
-- TOC entry 3074 (class 2604 OID 4738201)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_email_subscriber ALTER COLUMN id SET DEFAULT nextval('ohrm_email_subscriber_id_seq'::regclass);


--
-- TOC entry 3076 (class 2604 OID 4738219)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_email_template ALTER COLUMN id SET DEFAULT nextval('ohrm_email_template_id_seq'::regclass);


--
-- TOC entry 2890 (class 2604 OID 4737444)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_emp_education ALTER COLUMN id SET DEFAULT nextval('ohrm_emp_education_id_seq'::regclass);


--
-- TOC entry 2898 (class 2604 OID 4737464)
-- Name: reporting_method_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_emp_reporting_method ALTER COLUMN reporting_method_id SET DEFAULT nextval('ohrm_emp_reporting_method_reporting_method_id_seq'::regclass);


--
-- TOC entry 3059 (class 2604 OID 4738112)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_emp_termination ALTER COLUMN id SET DEFAULT nextval('ohrm_emp_termination_id_seq'::regclass);


--
-- TOC entry 3061 (class 2604 OID 4738121)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_emp_termination_reason ALTER COLUMN id SET DEFAULT nextval('ohrm_emp_termination_reason_id_seq'::regclass);


--
-- TOC entry 2990 (class 2604 OID 4737711)
-- Name: work_shift_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_employee_work_shift ALTER COLUMN work_shift_id SET DEFAULT nextval('ohrm_employee_work_shift_work_shift_id_seq'::regclass);


--
-- TOC entry 2805 (class 2604 OID 4716661)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_employment_status ALTER COLUMN id SET DEFAULT nextval('ohrm_employment_status_id_seq'::regclass);


--
-- TOC entry 2967 (class 2604 OID 4737626)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_holiday ALTER COLUMN id SET DEFAULT nextval('ohrm_holiday_id_seq'::regclass);


--
-- TOC entry 3133 (class 2604 OID 4738462)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_home_page ALTER COLUMN id SET DEFAULT nextval('ohrm_home_page_id_seq'::regclass);


--
-- TOC entry 3026 (class 2604 OID 4737982)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_candidate_attachment ALTER COLUMN id SET DEFAULT nextval('ohrm_job_candidate_attachment_id_seq'::regclass);


--
-- TOC entry 3034 (class 2604 OID 4738020)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_candidate_history ALTER COLUMN id SET DEFAULT nextval('ohrm_job_candidate_history_id_seq'::regclass);


--
-- TOC entry 2806 (class 2604 OID 4716669)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_category ALTER COLUMN id SET DEFAULT nextval('ohrm_job_category_id_seq'::regclass);


--
-- TOC entry 3037 (class 2604 OID 4738033)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_interview ALTER COLUMN id SET DEFAULT nextval('ohrm_job_interview_id_seq'::regclass);


--
-- TOC entry 3031 (class 2604 OID 4738007)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_interview_attachment ALTER COLUMN id SET DEFAULT nextval('ohrm_job_interview_attachment_id_seq'::regclass);


--
-- TOC entry 3057 (class 2604 OID 4738100)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_specification_attachment ALTER COLUMN id SET DEFAULT nextval('ohrm_job_specification_attachment_id_seq'::regclass);


--
-- TOC entry 3053 (class 2604 OID 4738086)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_title ALTER COLUMN id SET DEFAULT nextval('ohrm_job_title_id_seq'::regclass);


--
-- TOC entry 3028 (class 2604 OID 4737994)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_job_vacancy_attachment ALTER COLUMN id SET DEFAULT nextval('ohrm_job_vacancy_attachment_id_seq'::regclass);


--
-- TOC entry 2940 (class 2604 OID 4737526)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_language ALTER COLUMN id SET DEFAULT nextval('ohrm_language_id_seq'::regclass);


--
-- TOC entry 3120 (class 2604 OID 4738388)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_id_seq'::regclass);


--
-- TOC entry 3114 (class 2604 OID 4738365)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_adjustment ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_adjustment_id_seq'::regclass);


--
-- TOC entry 3124 (class 2604 OID 4738399)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_comment ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_comment_id_seq'::regclass);


--
-- TOC entry 3110 (class 2604 OID 4738351)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_entitlement ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_entitlement_id_seq'::regclass);


--
-- TOC entry 3129 (class 2604 OID 4738429)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_entitlement_adjustment ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_entitlement_adjustment_id_seq'::regclass);


--
-- TOC entry 3108 (class 2604 OID 4738342)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_entitlement_type ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_entitlement_type_id_seq'::regclass);


--
-- TOC entry 3127 (class 2604 OID 4738420)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_leave_entitlement ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_leave_entitlement_id_seq'::regclass);


--
-- TOC entry 3131 (class 2604 OID 4738438)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_period_history ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_period_history_id_seq'::regclass);


--
-- TOC entry 3118 (class 2604 OID 4738379)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_request ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_request_id_seq'::regclass);


--
-- TOC entry 3132 (class 2604 OID 4738446)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_status ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_status_id_seq'::regclass);


--
-- TOC entry 3105 (class 2604 OID 4738332)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_type ALTER COLUMN id SET DEFAULT nextval('ohrm_leave_type_id_seq'::regclass);


--
-- TOC entry 2815 (class 2604 OID 4737263)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_license ALTER COLUMN id SET DEFAULT nextval('ohrm_license_id_seq'::regclass);


--
-- TOC entry 2942 (class 2604 OID 4737535)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_location ALTER COLUMN id SET DEFAULT nextval('ohrm_location_id_seq'::regclass);


--
-- TOC entry 3071 (class 2604 OID 4738177)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_membership ALTER COLUMN id SET DEFAULT nextval('ohrm_membership_id_seq'::regclass);


--
-- TOC entry 3089 (class 2604 OID 4738270)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_menu_item ALTER COLUMN id SET DEFAULT nextval('ohrm_menu_item_id_seq'::regclass);


--
-- TOC entry 3080 (class 2604 OID 4738240)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_module ALTER COLUMN id SET DEFAULT nextval('ohrm_module_id_seq'::regclass);


--
-- TOC entry 3136 (class 2604 OID 4738472)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_module_default_page ALTER COLUMN id SET DEFAULT nextval('ohrm_module_default_page_id_seq'::regclass);


--
-- TOC entry 3072 (class 2604 OID 4738185)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_nationality ALTER COLUMN id SET DEFAULT nextval('ohrm_nationality_id_seq'::regclass);


--
-- TOC entry 2950 (class 2604 OID 4737553)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_operational_country ALTER COLUMN id SET DEFAULT nextval('ohrm_operational_country_id_seq'::regclass);


--
-- TOC entry 3040 (class 2604 OID 4738063)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_organization_gen_info ALTER COLUMN id SET DEFAULT nextval('ohrm_organization_gen_info_id_seq'::regclass);


--
-- TOC entry 2965 (class 2604 OID 4737615)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_pay_grade ALTER COLUMN id SET DEFAULT nextval('ohrm_pay_grade_id_seq'::regclass);


--
-- TOC entry 2981 (class 2604 OID 4737667)
-- Name: project_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_project ALTER COLUMN project_id SET DEFAULT nextval('ohrm_project_project_id_seq'::regclass);


--
-- TOC entry 2985 (class 2604 OID 4737678)
-- Name: activity_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_project_activity ALTER COLUMN activity_id SET DEFAULT nextval('ohrm_project_activity_activity_id_seq'::regclass);


--
-- TOC entry 3000 (class 2604 OID 4737835)
-- Name: report_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_report ALTER COLUMN report_id SET DEFAULT nextval('ohrm_report_report_id_seq'::regclass);


--
-- TOC entry 3083 (class 2604 OID 4738250)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_screen ALTER COLUMN id SET DEFAULT nextval('ohrm_screen_id_seq'::regclass);


--
-- TOC entry 3016 (class 2604 OID 4737910)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_selected_display_field ALTER COLUMN id SET DEFAULT nextval('ohrm_selected_display_field_id_seq'::regclass);


--
-- TOC entry 3021 (class 2604 OID 4737947)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_selected_display_field_group ALTER COLUMN id SET DEFAULT nextval('ohrm_selected_display_field_group_id_seq'::regclass);


--
-- TOC entry 2962 (class 2604 OID 4737594)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_skill ALTER COLUMN id SET DEFAULT nextval('ohrm_skill_id_seq'::regclass);


--
-- TOC entry 3038 (class 2604 OID 4738049)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_subunit ALTER COLUMN id SET DEFAULT nextval('ohrm_subunit_id_seq'::regclass);


--
-- TOC entry 3092 (class 2604 OID 4738283)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_upgrade_history ALTER COLUMN id SET DEFAULT nextval('ohrm_upgrade_history_id_seq'::regclass);


--
-- TOC entry 3063 (class 2604 OID 4738130)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_user ALTER COLUMN id SET DEFAULT nextval('ohrm_user_id_seq'::regclass);


--
-- TOC entry 3067 (class 2604 OID 4738143)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_user_role ALTER COLUMN id SET DEFAULT nextval('ohrm_user_role_id_seq'::regclass);


--
-- TOC entry 3104 (class 2604 OID 4738324)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_user_role_data_group ALTER COLUMN id SET DEFAULT nextval('ohrm_user_role_data_group_id_seq'::regclass);


--
-- TOC entry 3084 (class 2604 OID 4738258)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_user_role_screen ALTER COLUMN id SET DEFAULT nextval('ohrm_user_role_screen_id_seq'::regclass);


--
-- TOC entry 3070 (class 2604 OID 4738158)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_user_selection_rule ALTER COLUMN id SET DEFAULT nextval('ohrm_user_selection_rule_id_seq'::regclass);


--
-- TOC entry 2989 (class 2604 OID 4737703)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_work_shift ALTER COLUMN id SET DEFAULT nextval('ohrm_work_shift_id_seq'::regclass);


--
-- TOC entry 2969 (class 2604 OID 4737638)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_work_week ALTER COLUMN id SET DEFAULT nextval('ohrm_work_week_id_seq'::regclass);


--
-- TOC entry 2998 (class 2604 OID 4737807)
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_workflow_state_machine ALTER COLUMN id SET DEFAULT nextval('ohrm_workflow_state_machine_id_seq'::regclass);


--
-- TOC entry 3411 (class 0 OID 4716646)
-- Dependencies: 161
-- Data for Name: hs_hr_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_config (key, value) FROM stdin;
\.


--
-- TOC entry 3417 (class 0 OID 4716681)
-- Dependencies: 167
-- Data for Name: hs_hr_country; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_country (cou_code, name, cou_name, iso3, numcode) FROM stdin;
\.


--
-- TOC entry 3418 (class 0 OID 4716693)
-- Dependencies: 168
-- Data for Name: hs_hr_currency_type; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_currency_type (code, currency_id, currency_name) FROM stdin;
\.


--
-- TOC entry 3483 (class 0 OID 4737728)
-- Dependencies: 233
-- Data for Name: hs_hr_custom_export; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_custom_export (export_id, name, fields, headings) FROM stdin;
\.


--
-- TOC entry 3481 (class 0 OID 4737714)
-- Dependencies: 231
-- Data for Name: hs_hr_custom_fields; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_custom_fields (field_num, name, type, screen, extra_data) FROM stdin;
\.


--
-- TOC entry 3484 (class 0 OID 4737736)
-- Dependencies: 234
-- Data for Name: hs_hr_custom_import; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_custom_import (import_id, name, fields, has_heading) FROM stdin;
\.


--
-- TOC entry 3421 (class 0 OID 4737266)
-- Dependencies: 171
-- Data for Name: hs_hr_district; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_district (district_code, district_name, province_code) FROM stdin;
\.


--
-- TOC entry 3428 (class 0 OID 4737321)
-- Dependencies: 178
-- Data for Name: hs_hr_emp_attachment; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_emp_attachment (emp_number, eattach_id, eattach_desc, eattach_filename, eattach_size, eattach_attachment, eattach_type, screen, attached_by, attached_by_name, attached_time) FROM stdin;
\.


--
-- TOC entry 3424 (class 0 OID 4737283)
-- Dependencies: 174
-- Data for Name: hs_hr_emp_basicsalary; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_emp_basicsalary (id, emp_number, sal_grd_code, currency_id, ebsal_basic_salary, payperiod_code, salary_component, comments) FROM stdin;
\.


--
-- TOC entry 3687 (class 0 OID 0)
-- Dependencies: 173
-- Name: hs_hr_emp_basicsalary_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('hs_hr_emp_basicsalary_id_seq', 1, false);


--
-- TOC entry 3429 (class 0 OID 4737337)
-- Dependencies: 179
-- Data for Name: hs_hr_emp_children; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_emp_children (emp_number, ec_seqno, ec_name, ec_date_of_birth) FROM stdin;
\.


--
-- TOC entry 3425 (class 0 OID 4737293)
-- Dependencies: 175
-- Data for Name: hs_hr_emp_contract_extend; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_emp_contract_extend (emp_number, econ_extend_id, econ_extend_start_date, econ_extend_end_date) FROM stdin;
\.


--
-- TOC entry 3430 (class 0 OID 4737345)
-- Dependencies: 180
-- Data for Name: hs_hr_emp_dependents; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_emp_dependents (emp_number, ed_seqno, ed_name, ed_relationship_type, ed_relationship, ed_date_of_birth) FROM stdin;
\.


--
-- TOC entry 3437 (class 0 OID 4737410)
-- Dependencies: 187
-- Data for Name: hs_hr_emp_directdebit; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_emp_directdebit (id, salary_id, dd_routing_num, dd_account, dd_amount, dd_account_type, dd_transaction_type) FROM stdin;
\.


--
-- TOC entry 3688 (class 0 OID 0)
-- Dependencies: 186
-- Name: hs_hr_emp_directdebit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('hs_hr_emp_directdebit_id_seq', 1, false);


--
-- TOC entry 3431 (class 0 OID 4737357)
-- Dependencies: 181
-- Data for Name: hs_hr_emp_emergency_contacts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_emp_emergency_contacts (emp_number, eec_seqno, eec_name, eec_relationship, eec_home_no, eec_mobile_no, eec_office_no) FROM stdin;
\.


--
-- TOC entry 3432 (class 0 OID 4737372)
-- Dependencies: 182
-- Data for Name: hs_hr_emp_history_of_ealier_pos; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_emp_history_of_ealier_pos (emp_number, emp_seqno, ehoep_job_title, ehoep_years) FROM stdin;
\.


--
-- TOC entry 3426 (class 0 OID 4737300)
-- Dependencies: 176
-- Data for Name: hs_hr_emp_language; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_emp_language (emp_number, lang_id, fluency, competency, comments) FROM stdin;
\.


--
-- TOC entry 3485 (class 0 OID 4737745)
-- Dependencies: 235
-- Data for Name: hs_hr_emp_locations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_emp_locations (emp_number, location_id) FROM stdin;
\.


--
-- TOC entry 3434 (class 0 OID 4737387)
-- Dependencies: 184
-- Data for Name: hs_hr_emp_member_detail; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_emp_member_detail (emp_number, membship_code, ememb_subscript_ownership, ememb_subscript_amount, ememb_subs_currency, ememb_commence_date, ememb_renewal_date) FROM stdin;
\.


--
-- TOC entry 3435 (class 0 OID 4737397)
-- Dependencies: 185
-- Data for Name: hs_hr_emp_passport; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_emp_passport (emp_number, ep_seqno, ep_passport_num, ep_passportissueddate, ep_passportexpiredate, ep_comments, ep_passport_type_flg, ep_i9_status, ep_i9_review_date, cou_code) FROM stdin;
\.


--
-- TOC entry 3439 (class 0 OID 4737425)
-- Dependencies: 189
-- Data for Name: hs_hr_emp_picture; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_emp_picture (emp_number, epic_picture, epic_filename, epic_type, epic_file_size, epic_file_width, epic_file_height) FROM stdin;
\.


--
-- TOC entry 3442 (class 0 OID 4737451)
-- Dependencies: 192
-- Data for Name: hs_hr_emp_reportto; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_emp_reportto (erep_sup_emp_number, erep_sub_emp_number, erep_reporting_mode) FROM stdin;
\.


--
-- TOC entry 3438 (class 0 OID 4737419)
-- Dependencies: 188
-- Data for Name: hs_hr_emp_skill; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_emp_skill (emp_number, skill_id, years_of_exp, comments) FROM stdin;
\.


--
-- TOC entry 3427 (class 0 OID 4737308)
-- Dependencies: 177
-- Data for Name: hs_hr_emp_us_tax; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_emp_us_tax (emp_number, tax_federal_status, tax_federal_exceptions, tax_state, tax_state_status, tax_state_exceptions, tax_unemp_state, tax_work_state) FROM stdin;
\.


--
-- TOC entry 3445 (class 0 OID 4737467)
-- Dependencies: 195
-- Data for Name: hs_hr_emp_work_experience; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_emp_work_experience (emp_number, eexp_seqno, eexp_employer, eexp_jobtit, eexp_from_date, eexp_to_date, eexp_comments, eexp_internal) FROM stdin;
\.


--
-- TOC entry 3446 (class 0 OID 4737477)
-- Dependencies: 196
-- Data for Name: hs_hr_employee; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_employee (emp_number, employee_id, emp_lastname, emp_firstname, emp_middle_name, emp_nick_name, emp_smoker, ethnic_race_code, emp_birthday, nation_code, emp_gender, emp_marital_status, emp_ssn_num, emp_sin_num, emp_other_id, emp_dri_lice_num, emp_dri_lice_exp_date, emp_military_service, emp_status, job_title_code, eeo_cat_code, work_station, emp_street1, emp_street2, city_code, coun_code, provin_code, emp_zipcode, emp_hm_telephone, emp_mobile, emp_work_telephone, emp_work_email, sal_grd_code, joined_date, emp_oth_email, termination_id, custom1, custom2, custom3, custom4, custom5, custom6, custom7, custom8, custom9, custom10) FROM stdin;
\.


--
-- TOC entry 3416 (class 0 OID 4716673)
-- Dependencies: 166
-- Data for Name: hs_hr_jobtit_empstat; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_jobtit_empstat (jobtit_code, estat_code) FROM stdin;
\.


--
-- TOC entry 3486 (class 0 OID 4737750)
-- Dependencies: 236
-- Data for Name: hs_hr_kpi; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_kpi (id, job_title_code, description, rate_min, rate_max, rate_default, is_active) FROM stdin;
\.


--
-- TOC entry 3467 (class 0 OID 4737648)
-- Dependencies: 217
-- Data for Name: hs_hr_mailnotifications; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_mailnotifications (user_id, notification_type_id, status, email) FROM stdin;
\.


--
-- TOC entry 3453 (class 0 OID 4737557)
-- Dependencies: 203
-- Data for Name: hs_hr_module; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_module (mod_id, name, owner, owner_email, version, description) FROM stdin;
\.


--
-- TOC entry 3482 (class 0 OID 4737723)
-- Dependencies: 232
-- Data for Name: hs_hr_pay_period; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_pay_period (id, start_date, end_date, close_date, check_date, timesheet_aproval_due_date) FROM stdin;
\.


--
-- TOC entry 3422 (class 0 OID 4737274)
-- Dependencies: 172
-- Data for Name: hs_hr_payperiod; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_payperiod (payperiod_code, payperiod_name) FROM stdin;
\.


--
-- TOC entry 3487 (class 0 OID 4737760)
-- Dependencies: 237
-- Data for Name: hs_hr_performance_review; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_performance_review (id, employee_id, reviewer_id, creator_id, job_title_code, sub_division_id, creation_date, period_from, period_to, due_date, state, kpis) FROM stdin;
\.


--
-- TOC entry 3489 (class 0 OID 4737771)
-- Dependencies: 239
-- Data for Name: hs_hr_performance_review_comments; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_performance_review_comments (id, pr_id, employee_id, comment, create_date) FROM stdin;
\.


--
-- TOC entry 3689 (class 0 OID 0)
-- Dependencies: 238
-- Name: hs_hr_performance_review_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('hs_hr_performance_review_comments_id_seq', 1, false);


--
-- TOC entry 3455 (class 0 OID 4737572)
-- Dependencies: 205
-- Data for Name: hs_hr_province; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_province (id, province_name, province_code, cou_code) FROM stdin;
\.


--
-- TOC entry 3690 (class 0 OID 0)
-- Dependencies: 204
-- Name: hs_hr_province_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('hs_hr_province_id_seq', 1, false);


--
-- TOC entry 3476 (class 0 OID 4737690)
-- Dependencies: 226
-- Data for Name: hs_hr_unique_id; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY hs_hr_unique_id (id, last_id, table_name, field_name) FROM stdin;
\.


--
-- TOC entry 3691 (class 0 OID 0)
-- Dependencies: 225
-- Name: hs_hr_unique_id_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('hs_hr_unique_id_id_seq', 1, false);


--
-- TOC entry 3602 (class 0 OID 4738449)
-- Dependencies: 352
-- Data for Name: ohrm_advanced_report; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_advanced_report (id, name, definition) FROM stdin;
\.


--
-- TOC entry 3495 (class 0 OID 4737814)
-- Dependencies: 245
-- Data for Name: ohrm_attendance_record; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_attendance_record (id, employee_id, punch_in_utc_time, punch_in_note, punch_in_time_offset, punch_in_user_time, punch_out_utc_time, punch_out_note, punch_out_time_offset, punch_out_user_time, state) FROM stdin;
\.


--
-- TOC entry 3506 (class 0 OID 4737900)
-- Dependencies: 256
-- Data for Name: ohrm_available_group_field; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_available_group_field (report_group_id, group_field_id) FROM stdin;
\.


--
-- TOC entry 3504 (class 0 OID 4737879)
-- Dependencies: 254
-- Data for Name: ohrm_composite_display_field; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_composite_display_field (composite_display_field_id, report_group_id, name, label, field_alias, is_sortable, sort_order, sort_field, element_type, element_property, width, is_exportable, text_alignment_style, is_value_list, display_field_group_id, default_value, is_encrypted, is_meta) FROM stdin;
\.


--
-- TOC entry 3692 (class 0 OID 0)
-- Dependencies: 253
-- Name: ohrm_composite_display_field_composite_display_field_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_composite_display_field_composite_display_field_id_seq', 1, false);


--
-- TOC entry 3469 (class 0 OID 4737654)
-- Dependencies: 219
-- Data for Name: ohrm_customer; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_customer (customer_id, name, description, is_deleted) FROM stdin;
\.


--
-- TOC entry 3693 (class 0 OID 0)
-- Dependencies: 218
-- Name: ohrm_customer_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_customer_customer_id_seq', 1, false);


--
-- TOC entry 3576 (class 0 OID 4738308)
-- Dependencies: 326
-- Data for Name: ohrm_data_group; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_data_group (id, name, description, can_read, can_create, can_update, can_delete) FROM stdin;
\.


--
-- TOC entry 3694 (class 0 OID 0)
-- Dependencies: 325
-- Name: ohrm_data_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_data_group_id_seq', 1, false);


--
-- TOC entry 3502 (class 0 OID 4737864)
-- Dependencies: 252
-- Data for Name: ohrm_display_field; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_display_field (display_field_id, report_group_id, name, label, field_alias, is_sortable, sort_order, sort_field, element_type, element_property, width, is_exportable, text_alignment_style, is_value_list, display_field_group_id, default_value, is_encrypted, is_meta) FROM stdin;
\.


--
-- TOC entry 3695 (class 0 OID 0)
-- Dependencies: 251
-- Name: ohrm_display_field_display_field_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_display_field_display_field_id_seq', 1, false);


--
-- TOC entry 3513 (class 0 OID 4737935)
-- Dependencies: 263
-- Data for Name: ohrm_display_field_group; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_display_field_group (id, report_group_id, name, is_list) FROM stdin;
\.


--
-- TOC entry 3696 (class 0 OID 0)
-- Dependencies: 262
-- Name: ohrm_display_field_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_display_field_group_id_seq', 1, false);


--
-- TOC entry 3457 (class 0 OID 4737583)
-- Dependencies: 207
-- Data for Name: ohrm_education; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_education (id, name) FROM stdin;
\.


--
-- TOC entry 3697 (class 0 OID 0)
-- Dependencies: 206
-- Name: ohrm_education_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_education_id_seq', 1, false);


--
-- TOC entry 3558 (class 0 OID 4738206)
-- Dependencies: 308
-- Data for Name: ohrm_email; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_email (id, name) FROM stdin;
\.


--
-- TOC entry 3574 (class 0 OID 4738290)
-- Dependencies: 324
-- Data for Name: ohrm_email_configuration; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_email_configuration (id, mail_type, sent_as, sendmail_path, smtp_host, smtp_port, smtp_username, smtp_password, smtp_auth_type, smtp_security_type) FROM stdin;
\.


--
-- TOC entry 3698 (class 0 OID 0)
-- Dependencies: 323
-- Name: ohrm_email_configuration_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_email_configuration_id_seq', 1, false);


--
-- TOC entry 3699 (class 0 OID 0)
-- Dependencies: 307
-- Name: ohrm_email_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_email_id_seq', 1, false);


--
-- TOC entry 3554 (class 0 OID 4738190)
-- Dependencies: 304
-- Data for Name: ohrm_email_notification; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_email_notification (id, name, is_enable) FROM stdin;
\.


--
-- TOC entry 3700 (class 0 OID 0)
-- Dependencies: 303
-- Name: ohrm_email_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_email_notification_id_seq', 1, false);


--
-- TOC entry 3562 (class 0 OID 4738229)
-- Dependencies: 312
-- Data for Name: ohrm_email_processor; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_email_processor (id, email_id, class_name) FROM stdin;
\.


--
-- TOC entry 3701 (class 0 OID 0)
-- Dependencies: 311
-- Name: ohrm_email_processor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_email_processor_id_seq', 1, false);


--
-- TOC entry 3556 (class 0 OID 4738198)
-- Dependencies: 306
-- Data for Name: ohrm_email_subscriber; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_email_subscriber (id, notification_id, name, email) FROM stdin;
\.


--
-- TOC entry 3702 (class 0 OID 0)
-- Dependencies: 305
-- Name: ohrm_email_subscriber_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_email_subscriber_id_seq', 1, false);


--
-- TOC entry 3560 (class 0 OID 4738216)
-- Dependencies: 310
-- Data for Name: ohrm_email_template; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_email_template (id, email_id, locale, performer_role, recipient_role, subject, body) FROM stdin;
\.


--
-- TOC entry 3703 (class 0 OID 0)
-- Dependencies: 309
-- Name: ohrm_email_template_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_email_template_id_seq', 1, false);


--
-- TOC entry 3441 (class 0 OID 4737441)
-- Dependencies: 191
-- Data for Name: ohrm_emp_education; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_emp_education (id, emp_number, education_id, institute, major, year, score, start_date, end_date) FROM stdin;
\.


--
-- TOC entry 3704 (class 0 OID 0)
-- Dependencies: 190
-- Name: ohrm_emp_education_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_emp_education_id_seq', 1, false);


--
-- TOC entry 3433 (class 0 OID 4737381)
-- Dependencies: 183
-- Data for Name: ohrm_emp_license; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_emp_license (emp_number, license_id, license_no, license_issued_date, license_expiry_date) FROM stdin;
\.


--
-- TOC entry 3444 (class 0 OID 4737461)
-- Dependencies: 194
-- Data for Name: ohrm_emp_reporting_method; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_emp_reporting_method (reporting_method_id, reporting_method_name) FROM stdin;
\.


--
-- TOC entry 3705 (class 0 OID 0)
-- Dependencies: 193
-- Name: ohrm_emp_reporting_method_reporting_method_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_emp_reporting_method_reporting_method_id_seq', 1, false);


--
-- TOC entry 3539 (class 0 OID 4738109)
-- Dependencies: 289
-- Data for Name: ohrm_emp_termination; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_emp_termination (id, emp_number, reason_id, termination_date, note) FROM stdin;
\.


--
-- TOC entry 3706 (class 0 OID 0)
-- Dependencies: 288
-- Name: ohrm_emp_termination_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_emp_termination_id_seq', 1, false);


--
-- TOC entry 3541 (class 0 OID 4738118)
-- Dependencies: 291
-- Data for Name: ohrm_emp_termination_reason; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_emp_termination_reason (id, name) FROM stdin;
\.


--
-- TOC entry 3707 (class 0 OID 0)
-- Dependencies: 290
-- Name: ohrm_emp_termination_reason_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_emp_termination_reason_id_seq', 1, false);


--
-- TOC entry 3480 (class 0 OID 4737708)
-- Dependencies: 230
-- Data for Name: ohrm_employee_work_shift; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_employee_work_shift (work_shift_id, emp_number) FROM stdin;
\.


--
-- TOC entry 3708 (class 0 OID 0)
-- Dependencies: 229
-- Name: ohrm_employee_work_shift_work_shift_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_employee_work_shift_work_shift_id_seq', 1, false);


--
-- TOC entry 3413 (class 0 OID 4716658)
-- Dependencies: 163
-- Data for Name: ohrm_employment_status; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_employment_status (id, name) FROM stdin;
\.


--
-- TOC entry 3709 (class 0 OID 0)
-- Dependencies: 162
-- Name: ohrm_employment_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_employment_status_id_seq', 1, false);


--
-- TOC entry 3499 (class 0 OID 4737842)
-- Dependencies: 249
-- Data for Name: ohrm_filter_field; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_filter_field (filter_field_id, report_group_id, name, where_clause_part, filter_field_widget, condition_no, required) FROM stdin;
\.


--
-- TOC entry 3505 (class 0 OID 4737892)
-- Dependencies: 255
-- Data for Name: ohrm_group_field; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_group_field (group_field_id, name, group_by_clause, group_field_widget) FROM stdin;
\.


--
-- TOC entry 3464 (class 0 OID 4737623)
-- Dependencies: 214
-- Data for Name: ohrm_holiday; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_holiday (id, description, date, recurring, length, operational_country_id) FROM stdin;
\.


--
-- TOC entry 3710 (class 0 OID 0)
-- Dependencies: 213
-- Name: ohrm_holiday_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_holiday_id_seq', 1, false);


--
-- TOC entry 3604 (class 0 OID 4738459)
-- Dependencies: 354
-- Data for Name: ohrm_home_page; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_home_page (id, user_role_id, action, enable_class, priority) FROM stdin;
\.


--
-- TOC entry 3711 (class 0 OID 0)
-- Dependencies: 353
-- Name: ohrm_home_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_home_page_id_seq', 1, false);


--
-- TOC entry 3517 (class 0 OID 4737959)
-- Dependencies: 267
-- Data for Name: ohrm_job_candidate; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_job_candidate (id, first_name, middle_name, last_name, email, contact_number, status, comment, mode_of_application, date_of_application, cv_file_id, cv_text_version, keywords, added_person) FROM stdin;
\.


--
-- TOC entry 3520 (class 0 OID 4737979)
-- Dependencies: 270
-- Data for Name: ohrm_job_candidate_attachment; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_job_candidate_attachment (id, candidate_id, file_name, file_type, file_size, file_content, attachment_type) FROM stdin;
\.


--
-- TOC entry 3712 (class 0 OID 0)
-- Dependencies: 269
-- Name: ohrm_job_candidate_attachment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_job_candidate_attachment_id_seq', 1, false);


--
-- TOC entry 3526 (class 0 OID 4738017)
-- Dependencies: 276
-- Data for Name: ohrm_job_candidate_history; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_job_candidate_history (id, candidate_id, vacancy_id, candidate_vacancy_name, interview_id, action, performed_by, performed_date, note, interviewers) FROM stdin;
\.


--
-- TOC entry 3713 (class 0 OID 0)
-- Dependencies: 275
-- Name: ohrm_job_candidate_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_job_candidate_history_id_seq', 1, false);


--
-- TOC entry 3518 (class 0 OID 4737970)
-- Dependencies: 268
-- Data for Name: ohrm_job_candidate_vacancy; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_job_candidate_vacancy (id, candidate_id, vacancy_id, status, applied_date) FROM stdin;
\.


--
-- TOC entry 3415 (class 0 OID 4716666)
-- Dependencies: 165
-- Data for Name: ohrm_job_category; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_job_category (id, name) FROM stdin;
\.


--
-- TOC entry 3714 (class 0 OID 0)
-- Dependencies: 164
-- Name: ohrm_job_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_job_category_id_seq', 1, false);


--
-- TOC entry 3528 (class 0 OID 4738030)
-- Dependencies: 278
-- Data for Name: ohrm_job_interview; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_job_interview (id, candidate_vacancy_id, candidate_id, interview_name, interview_date, interview_time, note) FROM stdin;
\.


--
-- TOC entry 3524 (class 0 OID 4738004)
-- Dependencies: 274
-- Data for Name: ohrm_job_interview_attachment; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_job_interview_attachment (id, interview_id, file_name, file_type, file_size, file_content, attachment_type, comment) FROM stdin;
\.


--
-- TOC entry 3715 (class 0 OID 0)
-- Dependencies: 273
-- Name: ohrm_job_interview_attachment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_job_interview_attachment_id_seq', 1, false);


--
-- TOC entry 3716 (class 0 OID 0)
-- Dependencies: 277
-- Name: ohrm_job_interview_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_job_interview_id_seq', 1, false);


--
-- TOC entry 3529 (class 0 OID 4738039)
-- Dependencies: 279
-- Data for Name: ohrm_job_interview_interviewer; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_job_interview_interviewer (interview_id, interviewer_id) FROM stdin;
\.


--
-- TOC entry 3537 (class 0 OID 4738097)
-- Dependencies: 287
-- Data for Name: ohrm_job_specification_attachment; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_job_specification_attachment (id, job_title_id, file_name, file_type, file_size, file_content) FROM stdin;
\.


--
-- TOC entry 3717 (class 0 OID 0)
-- Dependencies: 286
-- Name: ohrm_job_specification_attachment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_job_specification_attachment_id_seq', 1, false);


--
-- TOC entry 3535 (class 0 OID 4738083)
-- Dependencies: 285
-- Data for Name: ohrm_job_title; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_job_title (id, job_title, job_description, note, is_deleted) FROM stdin;
\.


--
-- TOC entry 3718 (class 0 OID 0)
-- Dependencies: 284
-- Name: ohrm_job_title_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_job_title_id_seq', 1, false);


--
-- TOC entry 3516 (class 0 OID 4737950)
-- Dependencies: 266
-- Data for Name: ohrm_job_vacancy; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_job_vacancy (id, job_title_code, hiring_manager_id, name, description, no_of_positions, status, published_in_feed, defined_time, updated_time) FROM stdin;
\.


--
-- TOC entry 3522 (class 0 OID 4737991)
-- Dependencies: 272
-- Data for Name: ohrm_job_vacancy_attachment; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_job_vacancy_attachment (id, vacancy_id, file_name, file_type, file_size, file_content, attachment_type, comment) FROM stdin;
\.


--
-- TOC entry 3719 (class 0 OID 0)
-- Dependencies: 271
-- Name: ohrm_job_vacancy_attachment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_job_vacancy_attachment_id_seq', 1, false);


--
-- TOC entry 3448 (class 0 OID 4737523)
-- Dependencies: 198
-- Data for Name: ohrm_language; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_language (id, name) FROM stdin;
\.


--
-- TOC entry 3720 (class 0 OID 0)
-- Dependencies: 197
-- Name: ohrm_language_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_language_id_seq', 1, false);


--
-- TOC entry 3590 (class 0 OID 4738385)
-- Dependencies: 340
-- Data for Name: ohrm_leave; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_leave (id, date, length_hours, length_days, status, comments, leave_request_id, leave_type_id, emp_number, start_time, end_time) FROM stdin;
\.


--
-- TOC entry 3586 (class 0 OID 4738362)
-- Dependencies: 336
-- Data for Name: ohrm_leave_adjustment; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_leave_adjustment (id, emp_number, no_of_days, leave_type_id, from_date, to_date, credited_date, note, adjustment_type, deleted, created_by_id, created_by_name) FROM stdin;
\.


--
-- TOC entry 3721 (class 0 OID 0)
-- Dependencies: 335
-- Name: ohrm_leave_adjustment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_leave_adjustment_id_seq', 1, false);


--
-- TOC entry 3592 (class 0 OID 4738396)
-- Dependencies: 342
-- Data for Name: ohrm_leave_comment; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_leave_comment (id, leave_id, created, created_by_name, created_by_id, created_by_emp_number, comments) FROM stdin;
\.


--
-- TOC entry 3722 (class 0 OID 0)
-- Dependencies: 341
-- Name: ohrm_leave_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_leave_comment_id_seq', 1, false);


--
-- TOC entry 3584 (class 0 OID 4738348)
-- Dependencies: 334
-- Data for Name: ohrm_leave_entitlement; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_leave_entitlement (id, emp_number, no_of_days, days_used, leave_type_id, from_date, to_date, credited_date, note, entitlement_type, deleted, created_by_id, created_by_name) FROM stdin;
\.


--
-- TOC entry 3597 (class 0 OID 4738426)
-- Dependencies: 347
-- Data for Name: ohrm_leave_entitlement_adjustment; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_leave_entitlement_adjustment (id, adjustment_id, entitlement_id, length_days) FROM stdin;
\.


--
-- TOC entry 3723 (class 0 OID 0)
-- Dependencies: 346
-- Name: ohrm_leave_entitlement_adjustment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_leave_entitlement_adjustment_id_seq', 1, false);


--
-- TOC entry 3724 (class 0 OID 0)
-- Dependencies: 333
-- Name: ohrm_leave_entitlement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_leave_entitlement_id_seq', 1, false);


--
-- TOC entry 3582 (class 0 OID 4738339)
-- Dependencies: 332
-- Data for Name: ohrm_leave_entitlement_type; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_leave_entitlement_type (id, name, is_editable) FROM stdin;
\.


--
-- TOC entry 3725 (class 0 OID 0)
-- Dependencies: 331
-- Name: ohrm_leave_entitlement_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_leave_entitlement_type_id_seq', 1, false);


--
-- TOC entry 3726 (class 0 OID 0)
-- Dependencies: 339
-- Name: ohrm_leave_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_leave_id_seq', 1, false);


--
-- TOC entry 3595 (class 0 OID 4738417)
-- Dependencies: 345
-- Data for Name: ohrm_leave_leave_entitlement; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_leave_leave_entitlement (id, leave_id, entitlement_id, length_days) FROM stdin;
\.


--
-- TOC entry 3727 (class 0 OID 0)
-- Dependencies: 344
-- Name: ohrm_leave_leave_entitlement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_leave_leave_entitlement_id_seq', 1, false);


--
-- TOC entry 3599 (class 0 OID 4738435)
-- Dependencies: 349
-- Data for Name: ohrm_leave_period_history; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_leave_period_history (id, leave_period_start_month, leave_period_start_day, created_at) FROM stdin;
\.


--
-- TOC entry 3728 (class 0 OID 0)
-- Dependencies: 348
-- Name: ohrm_leave_period_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_leave_period_history_id_seq', 1, false);


--
-- TOC entry 3588 (class 0 OID 4738376)
-- Dependencies: 338
-- Data for Name: ohrm_leave_request; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_leave_request (id, leave_type_id, date_applied, emp_number, comments) FROM stdin;
\.


--
-- TOC entry 3593 (class 0 OID 4738406)
-- Dependencies: 343
-- Data for Name: ohrm_leave_request_comment; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_leave_request_comment (id, leave_request_id, created, created_by_name, created_by_id, created_by_emp_number, comments) FROM stdin;
\.


--
-- TOC entry 3729 (class 0 OID 0)
-- Dependencies: 337
-- Name: ohrm_leave_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_leave_request_id_seq', 1, false);


--
-- TOC entry 3601 (class 0 OID 4738443)
-- Dependencies: 351
-- Data for Name: ohrm_leave_status; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_leave_status (id, status, name) FROM stdin;
\.


--
-- TOC entry 3730 (class 0 OID 0)
-- Dependencies: 350
-- Name: ohrm_leave_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_leave_status_id_seq', 1, false);


--
-- TOC entry 3580 (class 0 OID 4738329)
-- Dependencies: 330
-- Data for Name: ohrm_leave_type; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_leave_type (id, name, deleted, exclude_in_reports_if_no_entitlement, operational_country_id) FROM stdin;
\.


--
-- TOC entry 3731 (class 0 OID 0)
-- Dependencies: 329
-- Name: ohrm_leave_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_leave_type_id_seq', 1, false);


--
-- TOC entry 3420 (class 0 OID 4737260)
-- Dependencies: 170
-- Data for Name: ohrm_license; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_license (id, name) FROM stdin;
\.


--
-- TOC entry 3732 (class 0 OID 0)
-- Dependencies: 169
-- Name: ohrm_license_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_license_id_seq', 1, false);


--
-- TOC entry 3450 (class 0 OID 4737532)
-- Dependencies: 200
-- Data for Name: ohrm_location; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_location (id, name, country_code, province, city, address, zip_code, phone, fax, notes) FROM stdin;
\.


--
-- TOC entry 3733 (class 0 OID 0)
-- Dependencies: 199
-- Name: ohrm_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_location_id_seq', 1, false);


--
-- TOC entry 3550 (class 0 OID 4738174)
-- Dependencies: 300
-- Data for Name: ohrm_membership; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_membership (id, name) FROM stdin;
\.


--
-- TOC entry 3734 (class 0 OID 0)
-- Dependencies: 299
-- Name: ohrm_membership_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_membership_id_seq', 1, false);


--
-- TOC entry 3570 (class 0 OID 4738267)
-- Dependencies: 320
-- Data for Name: ohrm_menu_item; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_menu_item (id, menu_title, screen_id, parent_id, level, order_hint, url_extras, status) FROM stdin;
\.


--
-- TOC entry 3735 (class 0 OID 0)
-- Dependencies: 319
-- Name: ohrm_menu_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_menu_item_id_seq', 1, false);


--
-- TOC entry 3564 (class 0 OID 4738237)
-- Dependencies: 314
-- Data for Name: ohrm_module; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_module (id, name, status) FROM stdin;
\.


--
-- TOC entry 3606 (class 0 OID 4738469)
-- Dependencies: 356
-- Data for Name: ohrm_module_default_page; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_module_default_page (id, module_id, user_role_id, action, enable_class, priority) FROM stdin;
\.


--
-- TOC entry 3736 (class 0 OID 0)
-- Dependencies: 355
-- Name: ohrm_module_default_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_module_default_page_id_seq', 1, false);


--
-- TOC entry 3737 (class 0 OID 0)
-- Dependencies: 313
-- Name: ohrm_module_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_module_id_seq', 1, false);


--
-- TOC entry 3552 (class 0 OID 4738182)
-- Dependencies: 302
-- Data for Name: ohrm_nationality; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_nationality (id, name) FROM stdin;
\.


--
-- TOC entry 3738 (class 0 OID 0)
-- Dependencies: 301
-- Name: ohrm_nationality_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_nationality_id_seq', 1, false);


--
-- TOC entry 3452 (class 0 OID 4737550)
-- Dependencies: 202
-- Data for Name: ohrm_operational_country; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_operational_country (id, country_code) FROM stdin;
\.


--
-- TOC entry 3739 (class 0 OID 0)
-- Dependencies: 201
-- Name: ohrm_operational_country_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_operational_country_id_seq', 1, false);


--
-- TOC entry 3533 (class 0 OID 4738060)
-- Dependencies: 283
-- Data for Name: ohrm_organization_gen_info; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_organization_gen_info (id, name, tax_id, registration_number, phone, fax, email, country, province, city, zip_code, street1, street2, note) FROM stdin;
\.


--
-- TOC entry 3740 (class 0 OID 0)
-- Dependencies: 282
-- Name: ohrm_organization_gen_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_organization_gen_info_id_seq', 1, false);


--
-- TOC entry 3462 (class 0 OID 4737612)
-- Dependencies: 212
-- Data for Name: ohrm_pay_grade; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_pay_grade (id, name) FROM stdin;
\.


--
-- TOC entry 3460 (class 0 OID 4737601)
-- Dependencies: 210
-- Data for Name: ohrm_pay_grade_currency; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_pay_grade_currency (pay_grade_id, currency_id, min_salary, max_salary) FROM stdin;
\.


--
-- TOC entry 3741 (class 0 OID 0)
-- Dependencies: 211
-- Name: ohrm_pay_grade_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_pay_grade_id_seq', 1, false);


--
-- TOC entry 3471 (class 0 OID 4737664)
-- Dependencies: 221
-- Data for Name: ohrm_project; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_project (project_id, customer_id, name, description, is_deleted) FROM stdin;
\.


--
-- TOC entry 3473 (class 0 OID 4737675)
-- Dependencies: 223
-- Data for Name: ohrm_project_activity; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_project_activity (activity_id, project_id, name, is_deleted) FROM stdin;
\.


--
-- TOC entry 3742 (class 0 OID 0)
-- Dependencies: 222
-- Name: ohrm_project_activity_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_project_activity_activity_id_seq', 1, false);


--
-- TOC entry 3474 (class 0 OID 4737683)
-- Dependencies: 224
-- Data for Name: ohrm_project_admin; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_project_admin (project_id, emp_number) FROM stdin;
\.


--
-- TOC entry 3743 (class 0 OID 0)
-- Dependencies: 220
-- Name: ohrm_project_project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_project_project_id_seq', 1, false);


--
-- TOC entry 3498 (class 0 OID 4737832)
-- Dependencies: 248
-- Data for Name: ohrm_report; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_report (report_id, name, report_group_id, use_filter_field, type) FROM stdin;
\.


--
-- TOC entry 3496 (class 0 OID 4737822)
-- Dependencies: 246
-- Data for Name: ohrm_report_group; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_report_group (report_group_id, name, core_sql) FROM stdin;
\.


--
-- TOC entry 3744 (class 0 OID 0)
-- Dependencies: 247
-- Name: ohrm_report_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_report_report_id_seq', 1, false);


--
-- TOC entry 3548 (class 0 OID 4738164)
-- Dependencies: 298
-- Data for Name: ohrm_role_user_selection_rule; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_role_user_selection_rule (user_role_id, selection_rule_id, configurable_params) FROM stdin;
\.


--
-- TOC entry 3566 (class 0 OID 4738247)
-- Dependencies: 316
-- Data for Name: ohrm_screen; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_screen (id, name, module_id, action_url) FROM stdin;
\.


--
-- TOC entry 3745 (class 0 OID 0)
-- Dependencies: 315
-- Name: ohrm_screen_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_screen_id_seq', 1, false);


--
-- TOC entry 3509 (class 0 OID 4737913)
-- Dependencies: 259
-- Data for Name: ohrm_selected_composite_display_field; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_selected_composite_display_field (id, composite_display_field_id, report_id) FROM stdin;
\.


--
-- TOC entry 3508 (class 0 OID 4737907)
-- Dependencies: 258
-- Data for Name: ohrm_selected_display_field; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_selected_display_field (id, display_field_id, report_id) FROM stdin;
\.


--
-- TOC entry 3515 (class 0 OID 4737944)
-- Dependencies: 265
-- Data for Name: ohrm_selected_display_field_group; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_selected_display_field_group (id, report_id, display_field_group_id) FROM stdin;
\.


--
-- TOC entry 3746 (class 0 OID 0)
-- Dependencies: 264
-- Name: ohrm_selected_display_field_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_selected_display_field_group_id_seq', 1, false);


--
-- TOC entry 3747 (class 0 OID 0)
-- Dependencies: 257
-- Name: ohrm_selected_display_field_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_selected_display_field_id_seq', 1, false);


--
-- TOC entry 3500 (class 0 OID 4737851)
-- Dependencies: 250
-- Data for Name: ohrm_selected_filter_field; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_selected_filter_field (report_id, filter_field_id, filter_field_order, value1, value2, where_condition, type) FROM stdin;
\.


--
-- TOC entry 3511 (class 0 OID 4737928)
-- Dependencies: 261
-- Data for Name: ohrm_selected_group_field; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_selected_group_field (group_field_id, summary_display_field_id, report_id) FROM stdin;
\.


--
-- TOC entry 3459 (class 0 OID 4737591)
-- Dependencies: 209
-- Data for Name: ohrm_skill; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_skill (id, name, description) FROM stdin;
\.


--
-- TOC entry 3748 (class 0 OID 0)
-- Dependencies: 208
-- Name: ohrm_skill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_skill_id_seq', 1, false);


--
-- TOC entry 3531 (class 0 OID 4738046)
-- Dependencies: 281
-- Data for Name: ohrm_subunit; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_subunit (id, name, unit_id, description, lft, rgt, level) FROM stdin;
\.


--
-- TOC entry 3749 (class 0 OID 0)
-- Dependencies: 280
-- Name: ohrm_subunit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_subunit_id_seq', 1, false);


--
-- TOC entry 3510 (class 0 OID 4737918)
-- Dependencies: 260
-- Data for Name: ohrm_summary_display_field; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_summary_display_field (summary_display_field_id, function, label, field_alias, is_sortable, sort_order, sort_field, element_type, element_property, width, is_exportable, text_alignment_style, is_value_list, display_field_group_id, default_value) FROM stdin;
\.


--
-- TOC entry 3490 (class 0 OID 4737780)
-- Dependencies: 240
-- Data for Name: ohrm_timesheet; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_timesheet (timesheet_id, state, start_date, end_date, employee_id) FROM stdin;
\.


--
-- TOC entry 3492 (class 0 OID 4737793)
-- Dependencies: 242
-- Data for Name: ohrm_timesheet_action_log; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_timesheet_action_log (timesheet_action_log_id, comment, action, date_time, performed_by, timesheet_id) FROM stdin;
\.


--
-- TOC entry 3491 (class 0 OID 4737785)
-- Dependencies: 241
-- Data for Name: ohrm_timesheet_item; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_timesheet_item (timesheet_item_id, timesheet_id, date, duration, comment, project_id, employee_id, activity_id) FROM stdin;
\.


--
-- TOC entry 3572 (class 0 OID 4738280)
-- Dependencies: 322
-- Data for Name: ohrm_upgrade_history; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_upgrade_history (id, start_version, end_version, start_increment, end_increment, upgraded_date) FROM stdin;
\.


--
-- TOC entry 3750 (class 0 OID 0)
-- Dependencies: 321
-- Name: ohrm_upgrade_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_upgrade_history_id_seq', 1, false);


--
-- TOC entry 3543 (class 0 OID 4738127)
-- Dependencies: 293
-- Data for Name: ohrm_user; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_user (id, user_role_id, emp_number, user_name, user_password, deleted, status, date_entered, date_modified, modified_user_id, created_by) FROM stdin;
\.


--
-- TOC entry 3751 (class 0 OID 0)
-- Dependencies: 292
-- Name: ohrm_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_user_id_seq', 1, false);


--
-- TOC entry 3545 (class 0 OID 4738140)
-- Dependencies: 295
-- Data for Name: ohrm_user_role; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_user_role (id, name, display_name, is_assignable, is_predefined) FROM stdin;
\.


--
-- TOC entry 3578 (class 0 OID 4738321)
-- Dependencies: 328
-- Data for Name: ohrm_user_role_data_group; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_user_role_data_group (id, user_role_id, data_group_id, can_read, can_create, can_update, can_delete, self) FROM stdin;
\.


--
-- TOC entry 3752 (class 0 OID 0)
-- Dependencies: 327
-- Name: ohrm_user_role_data_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_user_role_data_group_id_seq', 1, false);


--
-- TOC entry 3753 (class 0 OID 0)
-- Dependencies: 294
-- Name: ohrm_user_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_user_role_id_seq', 1, false);


--
-- TOC entry 3568 (class 0 OID 4738255)
-- Dependencies: 318
-- Data for Name: ohrm_user_role_screen; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_user_role_screen (id, user_role_id, screen_id, can_read, can_create, can_update, can_delete) FROM stdin;
\.


--
-- TOC entry 3754 (class 0 OID 0)
-- Dependencies: 317
-- Name: ohrm_user_role_screen_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_user_role_screen_id_seq', 1, false);


--
-- TOC entry 3547 (class 0 OID 4738155)
-- Dependencies: 297
-- Data for Name: ohrm_user_selection_rule; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_user_selection_rule (id, name, description, implementation_class, rule_xml_data) FROM stdin;
\.


--
-- TOC entry 3755 (class 0 OID 0)
-- Dependencies: 296
-- Name: ohrm_user_selection_rule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_user_selection_rule_id_seq', 1, false);


--
-- TOC entry 3478 (class 0 OID 4737700)
-- Dependencies: 228
-- Data for Name: ohrm_work_shift; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_work_shift (id, name, hours_per_day) FROM stdin;
\.


--
-- TOC entry 3756 (class 0 OID 0)
-- Dependencies: 227
-- Name: ohrm_work_shift_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_work_shift_id_seq', 1, false);


--
-- TOC entry 3466 (class 0 OID 4737635)
-- Dependencies: 216
-- Data for Name: ohrm_work_week; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_work_week (id, operational_country_id, mon, tue, wed, thu, fri, sat, sun) FROM stdin;
\.


--
-- TOC entry 3757 (class 0 OID 0)
-- Dependencies: 215
-- Name: ohrm_work_week_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_work_week_id_seq', 1, false);


--
-- TOC entry 3494 (class 0 OID 4737804)
-- Dependencies: 244
-- Data for Name: ohrm_workflow_state_machine; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY ohrm_workflow_state_machine (id, workflow, state, role, action, resulting_state, roles_to_notify, priority) FROM stdin;
\.


--
-- TOC entry 3758 (class 0 OID 0)
-- Dependencies: 243
-- Name: ohrm_workflow_state_machine_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('ohrm_workflow_state_machine_id_seq', 1, false);


--
-- TOC entry 3140 (class 2606 OID 4716655)
-- Name: hs_hr_config_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_config
    ADD CONSTRAINT hs_hr_config_pkey PRIMARY KEY (key);


--
-- TOC entry 3148 (class 2606 OID 4716692)
-- Name: hs_hr_country_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_country
    ADD CONSTRAINT hs_hr_country_pkey PRIMARY KEY (cou_code);


--
-- TOC entry 3150 (class 2606 OID 4716703)
-- Name: hs_hr_currency_type_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_currency_type
    ADD CONSTRAINT hs_hr_currency_type_pkey PRIMARY KEY (currency_id);


--
-- TOC entry 3240 (class 2606 OID 4737735)
-- Name: hs_hr_custom_export_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_custom_export
    ADD CONSTRAINT hs_hr_custom_export_pkey PRIMARY KEY (export_id);


--
-- TOC entry 3236 (class 2606 OID 4737722)
-- Name: hs_hr_custom_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_custom_fields
    ADD CONSTRAINT hs_hr_custom_fields_pkey PRIMARY KEY (field_num);


--
-- TOC entry 3242 (class 2606 OID 4737744)
-- Name: hs_hr_custom_import_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_custom_import
    ADD CONSTRAINT hs_hr_custom_import_pkey PRIMARY KEY (import_id);


--
-- TOC entry 3154 (class 2606 OID 4737273)
-- Name: hs_hr_district_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_district
    ADD CONSTRAINT hs_hr_district_pkey PRIMARY KEY (district_code);


--
-- TOC entry 3166 (class 2606 OID 4737336)
-- Name: hs_hr_emp_attachment_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_attachment
    ADD CONSTRAINT hs_hr_emp_attachment_pkey PRIMARY KEY (emp_number, eattach_id);


--
-- TOC entry 3158 (class 2606 OID 4737292)
-- Name: hs_hr_emp_basicsalary_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_basicsalary
    ADD CONSTRAINT hs_hr_emp_basicsalary_pkey PRIMARY KEY (id);


--
-- TOC entry 3168 (class 2606 OID 4737344)
-- Name: hs_hr_emp_children_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_children
    ADD CONSTRAINT hs_hr_emp_children_pkey PRIMARY KEY (emp_number, ec_seqno);


--
-- TOC entry 3160 (class 2606 OID 4737299)
-- Name: hs_hr_emp_contract_extend_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_contract_extend
    ADD CONSTRAINT hs_hr_emp_contract_extend_pkey PRIMARY KEY (emp_number, econ_extend_id);


--
-- TOC entry 3170 (class 2606 OID 4737356)
-- Name: hs_hr_emp_dependents_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_dependents
    ADD CONSTRAINT hs_hr_emp_dependents_pkey PRIMARY KEY (emp_number, ed_seqno);


--
-- TOC entry 3182 (class 2606 OID 4737418)
-- Name: hs_hr_emp_directdebit_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_directdebit
    ADD CONSTRAINT hs_hr_emp_directdebit_pkey PRIMARY KEY (id);


--
-- TOC entry 3172 (class 2606 OID 4737371)
-- Name: hs_hr_emp_emergency_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_emergency_contacts
    ADD CONSTRAINT hs_hr_emp_emergency_contacts_pkey PRIMARY KEY (emp_number, eec_seqno);


--
-- TOC entry 3174 (class 2606 OID 4737380)
-- Name: hs_hr_emp_history_of_ealier_pos_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_history_of_ealier_pos
    ADD CONSTRAINT hs_hr_emp_history_of_ealier_pos_pkey PRIMARY KEY (emp_number, emp_seqno);


--
-- TOC entry 3162 (class 2606 OID 4737307)
-- Name: hs_hr_emp_language_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_language
    ADD CONSTRAINT hs_hr_emp_language_pkey PRIMARY KEY (emp_number, lang_id, fluency);


--
-- TOC entry 3244 (class 2606 OID 4737749)
-- Name: hs_hr_emp_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_locations
    ADD CONSTRAINT hs_hr_emp_locations_pkey PRIMARY KEY (emp_number, location_id);


--
-- TOC entry 3178 (class 2606 OID 4737396)
-- Name: hs_hr_emp_member_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_member_detail
    ADD CONSTRAINT hs_hr_emp_member_detail_pkey PRIMARY KEY (emp_number, membship_code);


--
-- TOC entry 3180 (class 2606 OID 4737407)
-- Name: hs_hr_emp_passport_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_passport
    ADD CONSTRAINT hs_hr_emp_passport_pkey PRIMARY KEY (emp_number, ep_seqno);


--
-- TOC entry 3184 (class 2606 OID 4737438)
-- Name: hs_hr_emp_picture_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_picture
    ADD CONSTRAINT hs_hr_emp_picture_pkey PRIMARY KEY (emp_number);


--
-- TOC entry 3188 (class 2606 OID 4737458)
-- Name: hs_hr_emp_reportto_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_reportto
    ADD CONSTRAINT hs_hr_emp_reportto_pkey PRIMARY KEY (erep_sup_emp_number, erep_sub_emp_number, erep_reporting_mode);


--
-- TOC entry 3164 (class 2606 OID 4737320)
-- Name: hs_hr_emp_us_tax_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_us_tax
    ADD CONSTRAINT hs_hr_emp_us_tax_pkey PRIMARY KEY (emp_number);


--
-- TOC entry 3192 (class 2606 OID 4737476)
-- Name: hs_hr_emp_work_experience_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_emp_work_experience
    ADD CONSTRAINT hs_hr_emp_work_experience_pkey PRIMARY KEY (emp_number, eexp_seqno);


--
-- TOC entry 3194 (class 2606 OID 4737520)
-- Name: hs_hr_employee_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_employee
    ADD CONSTRAINT hs_hr_employee_pkey PRIMARY KEY (emp_number);


--
-- TOC entry 3146 (class 2606 OID 4716680)
-- Name: hs_hr_jobtit_empstat_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_jobtit_empstat
    ADD CONSTRAINT hs_hr_jobtit_empstat_pkey PRIMARY KEY (jobtit_code, estat_code);


--
-- TOC entry 3246 (class 2606 OID 4737759)
-- Name: hs_hr_kpi_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_kpi
    ADD CONSTRAINT hs_hr_kpi_pkey PRIMARY KEY (id);


--
-- TOC entry 3202 (class 2606 OID 4737569)
-- Name: hs_hr_module_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_module
    ADD CONSTRAINT hs_hr_module_pkey PRIMARY KEY (mod_id);


--
-- TOC entry 3238 (class 2606 OID 4737727)
-- Name: hs_hr_pay_period_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_pay_period
    ADD CONSTRAINT hs_hr_pay_period_pkey PRIMARY KEY (id);


--
-- TOC entry 3156 (class 2606 OID 4737280)
-- Name: hs_hr_payperiod_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_payperiod
    ADD CONSTRAINT hs_hr_payperiod_pkey PRIMARY KEY (payperiod_code);


--
-- TOC entry 3250 (class 2606 OID 4737779)
-- Name: hs_hr_performance_review_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_performance_review_comments
    ADD CONSTRAINT hs_hr_performance_review_comments_pkey PRIMARY KEY (id);


--
-- TOC entry 3248 (class 2606 OID 4737768)
-- Name: hs_hr_performance_review_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_performance_review
    ADD CONSTRAINT hs_hr_performance_review_pkey PRIMARY KEY (id);


--
-- TOC entry 3204 (class 2606 OID 4737580)
-- Name: hs_hr_province_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_province
    ADD CONSTRAINT hs_hr_province_pkey PRIMARY KEY (id);


--
-- TOC entry 3228 (class 2606 OID 4737695)
-- Name: hs_hr_unique_id_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_unique_id
    ADD CONSTRAINT hs_hr_unique_id_pkey PRIMARY KEY (id);


--
-- TOC entry 3230 (class 2606 OID 4737697)
-- Name: hs_hr_unique_id_table_name_field_name_key; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY hs_hr_unique_id
    ADD CONSTRAINT hs_hr_unique_id_table_name_field_name_key UNIQUE (table_name, field_name);


--
-- TOC entry 3394 (class 2606 OID 4738456)
-- Name: ohrm_advanced_report_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_advanced_report
    ADD CONSTRAINT ohrm_advanced_report_pkey PRIMARY KEY (id);


--
-- TOC entry 3260 (class 2606 OID 4737821)
-- Name: ohrm_attendance_record_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_attendance_record
    ADD CONSTRAINT ohrm_attendance_record_pkey PRIMARY KEY (id);


--
-- TOC entry 3276 (class 2606 OID 4737904)
-- Name: ohrm_available_group_field_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_available_group_field
    ADD CONSTRAINT ohrm_available_group_field_pkey PRIMARY KEY (report_group_id, group_field_id);


--
-- TOC entry 3272 (class 2606 OID 4737891)
-- Name: ohrm_composite_display_field_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_composite_display_field
    ADD CONSTRAINT ohrm_composite_display_field_pkey PRIMARY KEY (composite_display_field_id);


--
-- TOC entry 3220 (class 2606 OID 4737661)
-- Name: ohrm_customer_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_customer
    ADD CONSTRAINT ohrm_customer_pkey PRIMARY KEY (customer_id);


--
-- TOC entry 3364 (class 2606 OID 4738318)
-- Name: ohrm_data_group_name_key; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_data_group
    ADD CONSTRAINT ohrm_data_group_name_key UNIQUE (name);


--
-- TOC entry 3366 (class 2606 OID 4738316)
-- Name: ohrm_data_group_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_data_group
    ADD CONSTRAINT ohrm_data_group_pkey PRIMARY KEY (id);


--
-- TOC entry 3286 (class 2606 OID 4737941)
-- Name: ohrm_display_field_group_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_display_field_group
    ADD CONSTRAINT ohrm_display_field_group_pkey PRIMARY KEY (id);


--
-- TOC entry 3270 (class 2606 OID 4737876)
-- Name: ohrm_display_field_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_display_field
    ADD CONSTRAINT ohrm_display_field_pkey PRIMARY KEY (display_field_id);


--
-- TOC entry 3206 (class 2606 OID 4737588)
-- Name: ohrm_education_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_education
    ADD CONSTRAINT ohrm_education_pkey PRIMARY KEY (id);


--
-- TOC entry 3362 (class 2606 OID 4738305)
-- Name: ohrm_email_configuration_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_email_configuration
    ADD CONSTRAINT ohrm_email_configuration_pkey PRIMARY KEY (id);


--
-- TOC entry 3344 (class 2606 OID 4738213)
-- Name: ohrm_email_name_key; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_email
    ADD CONSTRAINT ohrm_email_name_key UNIQUE (name);


--
-- TOC entry 3340 (class 2606 OID 4738195)
-- Name: ohrm_email_notification_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_email_notification
    ADD CONSTRAINT ohrm_email_notification_pkey PRIMARY KEY (id);


--
-- TOC entry 3346 (class 2606 OID 4738211)
-- Name: ohrm_email_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_email
    ADD CONSTRAINT ohrm_email_pkey PRIMARY KEY (id);


--
-- TOC entry 3350 (class 2606 OID 4738234)
-- Name: ohrm_email_processor_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_email_processor
    ADD CONSTRAINT ohrm_email_processor_pkey PRIMARY KEY (id);


--
-- TOC entry 3342 (class 2606 OID 4738203)
-- Name: ohrm_email_subscriber_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_email_subscriber
    ADD CONSTRAINT ohrm_email_subscriber_pkey PRIMARY KEY (id);


--
-- TOC entry 3348 (class 2606 OID 4738226)
-- Name: ohrm_email_template_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_email_template
    ADD CONSTRAINT ohrm_email_template_pkey PRIMARY KEY (id);


--
-- TOC entry 3186 (class 2606 OID 4737450)
-- Name: ohrm_emp_education_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_emp_education
    ADD CONSTRAINT ohrm_emp_education_pkey PRIMARY KEY (id);


--
-- TOC entry 3176 (class 2606 OID 4737386)
-- Name: ohrm_emp_license_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_emp_license
    ADD CONSTRAINT ohrm_emp_license_pkey PRIMARY KEY (emp_number, license_id);


--
-- TOC entry 3190 (class 2606 OID 4737466)
-- Name: ohrm_emp_reporting_method_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_emp_reporting_method
    ADD CONSTRAINT ohrm_emp_reporting_method_pkey PRIMARY KEY (reporting_method_id);


--
-- TOC entry 3320 (class 2606 OID 4738115)
-- Name: ohrm_emp_termination_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_emp_termination
    ADD CONSTRAINT ohrm_emp_termination_pkey PRIMARY KEY (id);


--
-- TOC entry 3322 (class 2606 OID 4738124)
-- Name: ohrm_emp_termination_reason_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_emp_termination_reason
    ADD CONSTRAINT ohrm_emp_termination_reason_pkey PRIMARY KEY (id);


--
-- TOC entry 3234 (class 2606 OID 4737713)
-- Name: ohrm_employee_work_shift_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_employee_work_shift
    ADD CONSTRAINT ohrm_employee_work_shift_pkey PRIMARY KEY (work_shift_id, emp_number);


--
-- TOC entry 3142 (class 2606 OID 4716663)
-- Name: ohrm_employment_status_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_employment_status
    ADD CONSTRAINT ohrm_employment_status_pkey PRIMARY KEY (id);


--
-- TOC entry 3266 (class 2606 OID 4737850)
-- Name: ohrm_filter_field_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_filter_field
    ADD CONSTRAINT ohrm_filter_field_pkey PRIMARY KEY (filter_field_id);


--
-- TOC entry 3274 (class 2606 OID 4737899)
-- Name: ohrm_group_field_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_group_field
    ADD CONSTRAINT ohrm_group_field_pkey PRIMARY KEY (group_field_id);


--
-- TOC entry 3216 (class 2606 OID 4737632)
-- Name: ohrm_holiday_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_holiday
    ADD CONSTRAINT ohrm_holiday_pkey PRIMARY KEY (id);


--
-- TOC entry 3396 (class 2606 OID 4738466)
-- Name: ohrm_home_page_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_home_page
    ADD CONSTRAINT ohrm_home_page_pkey PRIMARY KEY (id);


--
-- TOC entry 3298 (class 2606 OID 4737988)
-- Name: ohrm_job_candidate_attachment_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_candidate_attachment
    ADD CONSTRAINT ohrm_job_candidate_attachment_pkey PRIMARY KEY (id);


--
-- TOC entry 3304 (class 2606 OID 4738027)
-- Name: ohrm_job_candidate_history_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_candidate_history
    ADD CONSTRAINT ohrm_job_candidate_history_pkey PRIMARY KEY (id);


--
-- TOC entry 3292 (class 2606 OID 4737969)
-- Name: ohrm_job_candidate_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_candidate
    ADD CONSTRAINT ohrm_job_candidate_pkey PRIMARY KEY (id);


--
-- TOC entry 3294 (class 2606 OID 4737976)
-- Name: ohrm_job_candidate_vacancy_id_key; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_candidate_vacancy
    ADD CONSTRAINT ohrm_job_candidate_vacancy_id_key UNIQUE (id);


--
-- TOC entry 3296 (class 2606 OID 4737974)
-- Name: ohrm_job_candidate_vacancy_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_candidate_vacancy
    ADD CONSTRAINT ohrm_job_candidate_vacancy_pkey PRIMARY KEY (candidate_id, vacancy_id);


--
-- TOC entry 3144 (class 2606 OID 4716672)
-- Name: ohrm_job_category_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_category
    ADD CONSTRAINT ohrm_job_category_pkey PRIMARY KEY (id);


--
-- TOC entry 3302 (class 2606 OID 4738014)
-- Name: ohrm_job_interview_attachment_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_interview_attachment
    ADD CONSTRAINT ohrm_job_interview_attachment_pkey PRIMARY KEY (id);


--
-- TOC entry 3308 (class 2606 OID 4738043)
-- Name: ohrm_job_interview_interviewer_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_interview_interviewer
    ADD CONSTRAINT ohrm_job_interview_interviewer_pkey PRIMARY KEY (interview_id, interviewer_id);


--
-- TOC entry 3306 (class 2606 OID 4738038)
-- Name: ohrm_job_interview_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_interview
    ADD CONSTRAINT ohrm_job_interview_pkey PRIMARY KEY (id);


--
-- TOC entry 3318 (class 2606 OID 4738106)
-- Name: ohrm_job_specification_attachment_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_specification_attachment
    ADD CONSTRAINT ohrm_job_specification_attachment_pkey PRIMARY KEY (id);


--
-- TOC entry 3316 (class 2606 OID 4738094)
-- Name: ohrm_job_title_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_title
    ADD CONSTRAINT ohrm_job_title_pkey PRIMARY KEY (id);


--
-- TOC entry 3300 (class 2606 OID 4738001)
-- Name: ohrm_job_vacancy_attachment_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_vacancy_attachment
    ADD CONSTRAINT ohrm_job_vacancy_attachment_pkey PRIMARY KEY (id);


--
-- TOC entry 3290 (class 2606 OID 4737958)
-- Name: ohrm_job_vacancy_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_job_vacancy
    ADD CONSTRAINT ohrm_job_vacancy_pkey PRIMARY KEY (id);


--
-- TOC entry 3196 (class 2606 OID 4737529)
-- Name: ohrm_language_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_language
    ADD CONSTRAINT ohrm_language_pkey PRIMARY KEY (id);


--
-- TOC entry 3376 (class 2606 OID 4738373)
-- Name: ohrm_leave_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_adjustment
    ADD CONSTRAINT ohrm_leave_adjustment_pkey PRIMARY KEY (id);


--
-- TOC entry 3382 (class 2606 OID 4738405)
-- Name: ohrm_leave_comment_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_comment
    ADD CONSTRAINT ohrm_leave_comment_pkey PRIMARY KEY (id);


--
-- TOC entry 3388 (class 2606 OID 4738432)
-- Name: ohrm_leave_entitlement_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_entitlement_adjustment
    ADD CONSTRAINT ohrm_leave_entitlement_adjustment_pkey PRIMARY KEY (id);


--
-- TOC entry 3374 (class 2606 OID 4738359)
-- Name: ohrm_leave_entitlement_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_entitlement
    ADD CONSTRAINT ohrm_leave_entitlement_pkey PRIMARY KEY (id);


--
-- TOC entry 3372 (class 2606 OID 4738345)
-- Name: ohrm_leave_entitlement_type_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_entitlement_type
    ADD CONSTRAINT ohrm_leave_entitlement_type_pkey PRIMARY KEY (id);


--
-- TOC entry 3386 (class 2606 OID 4738423)
-- Name: ohrm_leave_leave_entitlement_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_leave_entitlement
    ADD CONSTRAINT ohrm_leave_leave_entitlement_pkey PRIMARY KEY (id);


--
-- TOC entry 3390 (class 2606 OID 4738440)
-- Name: ohrm_leave_period_history_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_period_history
    ADD CONSTRAINT ohrm_leave_period_history_pkey PRIMARY KEY (id);


--
-- TOC entry 3380 (class 2606 OID 4738393)
-- Name: ohrm_leave_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave
    ADD CONSTRAINT ohrm_leave_pkey PRIMARY KEY (id);


--
-- TOC entry 3384 (class 2606 OID 4738414)
-- Name: ohrm_leave_request_comment_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_request_comment
    ADD CONSTRAINT ohrm_leave_request_comment_pkey PRIMARY KEY (id);


--
-- TOC entry 3378 (class 2606 OID 4738382)
-- Name: ohrm_leave_request_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_request
    ADD CONSTRAINT ohrm_leave_request_pkey PRIMARY KEY (id);


--
-- TOC entry 3392 (class 2606 OID 4738448)
-- Name: ohrm_leave_status_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_status
    ADD CONSTRAINT ohrm_leave_status_pkey PRIMARY KEY (id);


--
-- TOC entry 3370 (class 2606 OID 4738336)
-- Name: ohrm_leave_type_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_leave_type
    ADD CONSTRAINT ohrm_leave_type_pkey PRIMARY KEY (id);


--
-- TOC entry 3152 (class 2606 OID 4737265)
-- Name: ohrm_license_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_license
    ADD CONSTRAINT ohrm_license_pkey PRIMARY KEY (id);


--
-- TOC entry 3198 (class 2606 OID 4737547)
-- Name: ohrm_location_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_location
    ADD CONSTRAINT ohrm_location_pkey PRIMARY KEY (id);


--
-- TOC entry 3336 (class 2606 OID 4738179)
-- Name: ohrm_membership_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_membership
    ADD CONSTRAINT ohrm_membership_pkey PRIMARY KEY (id);


--
-- TOC entry 3358 (class 2606 OID 4738277)
-- Name: ohrm_menu_item_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_menu_item
    ADD CONSTRAINT ohrm_menu_item_pkey PRIMARY KEY (id);


--
-- TOC entry 3398 (class 2606 OID 4738476)
-- Name: ohrm_module_default_page_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_module_default_page
    ADD CONSTRAINT ohrm_module_default_page_pkey PRIMARY KEY (id);


--
-- TOC entry 3352 (class 2606 OID 4738244)
-- Name: ohrm_module_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_module
    ADD CONSTRAINT ohrm_module_pkey PRIMARY KEY (id);


--
-- TOC entry 3338 (class 2606 OID 4738187)
-- Name: ohrm_nationality_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_nationality
    ADD CONSTRAINT ohrm_nationality_pkey PRIMARY KEY (id);


--
-- TOC entry 3200 (class 2606 OID 4737556)
-- Name: ohrm_operational_country_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_operational_country
    ADD CONSTRAINT ohrm_operational_country_pkey PRIMARY KEY (id);


--
-- TOC entry 3314 (class 2606 OID 4738080)
-- Name: ohrm_organization_gen_info_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_organization_gen_info
    ADD CONSTRAINT ohrm_organization_gen_info_pkey PRIMARY KEY (id);


--
-- TOC entry 3210 (class 2606 OID 4737609)
-- Name: ohrm_pay_grade_currency_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_pay_grade_currency
    ADD CONSTRAINT ohrm_pay_grade_currency_pkey PRIMARY KEY (pay_grade_id, currency_id);


--
-- TOC entry 3212 (class 2606 OID 4737620)
-- Name: ohrm_pay_grade_name_key; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_pay_grade
    ADD CONSTRAINT ohrm_pay_grade_name_key UNIQUE (name);


--
-- TOC entry 3214 (class 2606 OID 4737618)
-- Name: ohrm_pay_grade_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_pay_grade
    ADD CONSTRAINT ohrm_pay_grade_pkey PRIMARY KEY (id);


--
-- TOC entry 3224 (class 2606 OID 4737682)
-- Name: ohrm_project_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_project_activity
    ADD CONSTRAINT ohrm_project_activity_pkey PRIMARY KEY (activity_id);


--
-- TOC entry 3226 (class 2606 OID 4737687)
-- Name: ohrm_project_admin_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_project_admin
    ADD CONSTRAINT ohrm_project_admin_pkey PRIMARY KEY (project_id, emp_number);


--
-- TOC entry 3222 (class 2606 OID 4737672)
-- Name: ohrm_project_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_project
    ADD CONSTRAINT ohrm_project_pkey PRIMARY KEY (project_id, customer_id);


--
-- TOC entry 3262 (class 2606 OID 4737829)
-- Name: ohrm_report_group_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_report_group
    ADD CONSTRAINT ohrm_report_group_pkey PRIMARY KEY (report_group_id);


--
-- TOC entry 3264 (class 2606 OID 4737841)
-- Name: ohrm_report_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_report
    ADD CONSTRAINT ohrm_report_pkey PRIMARY KEY (report_id);


--
-- TOC entry 3334 (class 2606 OID 4738171)
-- Name: ohrm_role_user_selection_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_role_user_selection_rule
    ADD CONSTRAINT ohrm_role_user_selection_rule_pkey PRIMARY KEY (user_role_id, selection_rule_id);


--
-- TOC entry 3354 (class 2606 OID 4738252)
-- Name: ohrm_screen_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_screen
    ADD CONSTRAINT ohrm_screen_pkey PRIMARY KEY (id);


--
-- TOC entry 3280 (class 2606 OID 4737917)
-- Name: ohrm_selected_composite_display_field_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_selected_composite_display_field
    ADD CONSTRAINT ohrm_selected_composite_display_field_pkey PRIMARY KEY (id, composite_display_field_id, report_id);


--
-- TOC entry 3288 (class 2606 OID 4737949)
-- Name: ohrm_selected_display_field_group_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_selected_display_field_group
    ADD CONSTRAINT ohrm_selected_display_field_group_pkey PRIMARY KEY (id);


--
-- TOC entry 3278 (class 2606 OID 4737912)
-- Name: ohrm_selected_display_field_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_selected_display_field
    ADD CONSTRAINT ohrm_selected_display_field_pkey PRIMARY KEY (id, display_field_id, report_id);


--
-- TOC entry 3268 (class 2606 OID 4737861)
-- Name: ohrm_selected_filter_field_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_selected_filter_field
    ADD CONSTRAINT ohrm_selected_filter_field_pkey PRIMARY KEY (report_id, filter_field_id);


--
-- TOC entry 3284 (class 2606 OID 4737932)
-- Name: ohrm_selected_group_field_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_selected_group_field
    ADD CONSTRAINT ohrm_selected_group_field_pkey PRIMARY KEY (group_field_id, summary_display_field_id, report_id);


--
-- TOC entry 3208 (class 2606 OID 4737600)
-- Name: ohrm_skill_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_skill
    ADD CONSTRAINT ohrm_skill_pkey PRIMARY KEY (id);


--
-- TOC entry 3310 (class 2606 OID 4738057)
-- Name: ohrm_subunit_name_key; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_subunit
    ADD CONSTRAINT ohrm_subunit_name_key UNIQUE (name);


--
-- TOC entry 3312 (class 2606 OID 4738055)
-- Name: ohrm_subunit_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_subunit
    ADD CONSTRAINT ohrm_subunit_pkey PRIMARY KEY (id);


--
-- TOC entry 3282 (class 2606 OID 4737927)
-- Name: ohrm_summary_display_field_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_summary_display_field
    ADD CONSTRAINT ohrm_summary_display_field_pkey PRIMARY KEY (summary_display_field_id);


--
-- TOC entry 3256 (class 2606 OID 4737801)
-- Name: ohrm_timesheet_action_log_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_timesheet_action_log
    ADD CONSTRAINT ohrm_timesheet_action_log_pkey PRIMARY KEY (timesheet_action_log_id);


--
-- TOC entry 3254 (class 2606 OID 4737792)
-- Name: ohrm_timesheet_item_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_timesheet_item
    ADD CONSTRAINT ohrm_timesheet_item_pkey PRIMARY KEY (timesheet_item_id);


--
-- TOC entry 3252 (class 2606 OID 4737784)
-- Name: ohrm_timesheet_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_timesheet
    ADD CONSTRAINT ohrm_timesheet_pkey PRIMARY KEY (timesheet_id);


--
-- TOC entry 3360 (class 2606 OID 4738287)
-- Name: ohrm_upgrade_history_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_upgrade_history
    ADD CONSTRAINT ohrm_upgrade_history_pkey PRIMARY KEY (id);


--
-- TOC entry 3324 (class 2606 OID 4738135)
-- Name: ohrm_user_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_user
    ADD CONSTRAINT ohrm_user_pkey PRIMARY KEY (id);


--
-- TOC entry 3368 (class 2606 OID 4738326)
-- Name: ohrm_user_role_data_group_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_user_role_data_group
    ADD CONSTRAINT ohrm_user_role_data_group_pkey PRIMARY KEY (id);


--
-- TOC entry 3328 (class 2606 OID 4738152)
-- Name: ohrm_user_role_name_key; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_user_role
    ADD CONSTRAINT ohrm_user_role_name_key UNIQUE (name);


--
-- TOC entry 3330 (class 2606 OID 4738150)
-- Name: ohrm_user_role_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_user_role
    ADD CONSTRAINT ohrm_user_role_pkey PRIMARY KEY (id);


--
-- TOC entry 3356 (class 2606 OID 4738264)
-- Name: ohrm_user_role_screen_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_user_role_screen
    ADD CONSTRAINT ohrm_user_role_screen_pkey PRIMARY KEY (id);


--
-- TOC entry 3332 (class 2606 OID 4738163)
-- Name: ohrm_user_selection_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_user_selection_rule
    ADD CONSTRAINT ohrm_user_selection_rule_pkey PRIMARY KEY (id);


--
-- TOC entry 3326 (class 2606 OID 4738137)
-- Name: ohrm_user_user_name_key; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_user
    ADD CONSTRAINT ohrm_user_user_name_key UNIQUE (user_name);


--
-- TOC entry 3232 (class 2606 OID 4737705)
-- Name: ohrm_work_shift_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_work_shift
    ADD CONSTRAINT ohrm_work_shift_pkey PRIMARY KEY (id);


--
-- TOC entry 3218 (class 2606 OID 4737647)
-- Name: ohrm_work_week_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_work_week
    ADD CONSTRAINT ohrm_work_week_pkey PRIMARY KEY (id);


--
-- TOC entry 3258 (class 2606 OID 4737813)
-- Name: ohrm_workflow_state_machine_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY ohrm_workflow_state_machine
    ADD CONSTRAINT ohrm_workflow_state_machine_pkey PRIMARY KEY (id);


--
-- TOC entry 3408 (class 2606 OID 4738477)
-- Name: ohrm_home_page_user_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_home_page
    ADD CONSTRAINT ohrm_home_page_user_role_id_fkey FOREIGN KEY (user_role_id) REFERENCES ohrm_user_role(id) ON DELETE CASCADE;


--
-- TOC entry 3404 (class 2606 OID 4738532)
-- Name: ohrm_leave_adjustment_adjustment_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_adjustment
    ADD CONSTRAINT ohrm_leave_adjustment_adjustment_type_fkey FOREIGN KEY (adjustment_type) REFERENCES ohrm_leave_entitlement_type(id) ON DELETE CASCADE;


--
-- TOC entry 3405 (class 2606 OID 4738527)
-- Name: ohrm_leave_adjustment_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_adjustment
    ADD CONSTRAINT ohrm_leave_adjustment_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES ohrm_user(id) ON DELETE SET NULL;


--
-- TOC entry 3406 (class 2606 OID 4738522)
-- Name: ohrm_leave_adjustment_emp_number_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_adjustment
    ADD CONSTRAINT ohrm_leave_adjustment_emp_number_fkey FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- TOC entry 3407 (class 2606 OID 4738517)
-- Name: ohrm_leave_adjustment_leave_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_adjustment
    ADD CONSTRAINT ohrm_leave_adjustment_leave_type_id_fkey FOREIGN KEY (leave_type_id) REFERENCES ohrm_leave_type(id) ON DELETE CASCADE;


--
-- TOC entry 3400 (class 2606 OID 4738512)
-- Name: ohrm_leave_entitlement_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_entitlement
    ADD CONSTRAINT ohrm_leave_entitlement_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES ohrm_user(id) ON DELETE SET NULL;


--
-- TOC entry 3402 (class 2606 OID 4738502)
-- Name: ohrm_leave_entitlement_emp_number_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_entitlement
    ADD CONSTRAINT ohrm_leave_entitlement_emp_number_fkey FOREIGN KEY (emp_number) REFERENCES hs_hr_employee(emp_number) ON DELETE CASCADE;


--
-- TOC entry 3401 (class 2606 OID 4738507)
-- Name: ohrm_leave_entitlement_entitlement_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_entitlement
    ADD CONSTRAINT ohrm_leave_entitlement_entitlement_type_fkey FOREIGN KEY (entitlement_type) REFERENCES ohrm_leave_entitlement_type(id) ON DELETE CASCADE;


--
-- TOC entry 3403 (class 2606 OID 4738497)
-- Name: ohrm_leave_entitlement_leave_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_entitlement
    ADD CONSTRAINT ohrm_leave_entitlement_leave_type_id_fkey FOREIGN KEY (leave_type_id) REFERENCES ohrm_leave_type(id) ON DELETE CASCADE;


--
-- TOC entry 3399 (class 2606 OID 4738492)
-- Name: ohrm_leave_type_operational_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_leave_type
    ADD CONSTRAINT ohrm_leave_type_operational_country_id_fkey FOREIGN KEY (operational_country_id) REFERENCES ohrm_operational_country(id) ON DELETE SET NULL;


--
-- TOC entry 3409 (class 2606 OID 4738487)
-- Name: ohrm_module_default_page_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_module_default_page
    ADD CONSTRAINT ohrm_module_default_page_module_id_fkey FOREIGN KEY (module_id) REFERENCES ohrm_module(id) ON DELETE CASCADE;


--
-- TOC entry 3410 (class 2606 OID 4738482)
-- Name: ohrm_module_default_page_user_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY ohrm_module_default_page
    ADD CONSTRAINT ohrm_module_default_page_user_role_id_fkey FOREIGN KEY (user_role_id) REFERENCES ohrm_user_role(id) ON DELETE CASCADE;


--
-- TOC entry 3613 (class 0 OID 0)
-- Dependencies: 5
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2013-04-25 09:54:22 EDT

--
-- PostgreSQL database dump complete
--
