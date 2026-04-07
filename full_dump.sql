--
-- PostgreSQL database dump
--

\restrict o5dbC5FENKym2TjESfZTa4BcQ0O0UJxuRsQxhz3T5QdizIyaREX7l2wCmg5799D

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.admin_users OWNER TO postgres;

--
-- Name: admin_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_users_id_seq OWNER TO postgres;

--
-- Name: admin_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_users_id_seq OWNED BY public.admin_users.id;


--
-- Name: app_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.app_settings (
    key character varying(100) NOT NULL,
    value text NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.app_settings OWNER TO postgres;

--
-- Name: franchise_leads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.franchise_leads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    contact_number character varying(100) NOT NULL,
    best_contact_time character varying(100),
    annual_income numeric,
    proposed_location character varying(255),
    package_type character varying(100),
    remarks text,
    referral character varying(255),
    stage character varying(50) DEFAULT 'REGISTERED'::character varying NOT NULL,
    status character varying(50) DEFAULT 'NEW'::character varying NOT NULL,
    contact_outcome character varying(50),
    followup_count integer DEFAULT 0 NOT NULL,
    next_followup_at timestamp with time zone,
    last_contacted_at timestamp with time zone,
    assigned_to character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    best_contact_at timestamp with time zone,
    remarks_admin text,
    CONSTRAINT franchise_leads_contact_outcome_check CHECK (((contact_outcome IS NULL) OR ((contact_outcome)::text = ANY ((ARRAY['NO_ANSWER'::character varying, 'INTERESTED'::character varying, 'NOT_INTERESTED'::character varying, 'PAID'::character varying, 'PRESENT'::character varying, 'ABSENT'::character varying, 'CALLBACK'::character varying, 'CONFIRMED_SCHEDULE'::character varying, 'ARCHIVE'::character varying, 'DROP'::character varying, 'CANCEL'::character varying, 'REMIND_SUCCESS'::character varying])::text[])))),
    CONSTRAINT franchise_leads_stage_check CHECK (((stage)::text = ANY ((ARRAY['REGISTERED'::character varying, 'ORIENTATION'::character varying, 'ONBOARDING'::character varying, 'CLOSED'::character varying])::text[]))),
    CONSTRAINT franchise_leads_status_check CHECK (((status)::text = ANY ((ARRAY['NEW'::character varying, 'ACTIVE'::character varying, 'INACTIVE'::character varying, 'FOR_FOLLOWUP'::character varying, 'DROPPED'::character varying, 'ARCHIVED'::character varying, 'APPROVED'::character varying])::text[])))
);


ALTER TABLE public.franchise_leads OWNER TO postgres;

--
-- Name: franchise_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.franchise_requests (
    id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    contact_number character varying(50) NOT NULL,
    proposed_location character varying(255) NOT NULL,
    preferred_package character varying(255) NOT NULL,
    remarks text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    best_contact_time character varying(255),
    estimated_annual_income character varying(255),
    referral character varying(255)
);


ALTER TABLE public.franchise_requests OWNER TO postgres;

--
-- Name: franchise_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.franchise_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.franchise_requests_id_seq OWNER TO postgres;

--
-- Name: franchise_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.franchise_requests_id_seq OWNED BY public.franchise_requests.id;


--
-- Name: lead_contact_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lead_contact_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lead_id uuid NOT NULL,
    contact_type character varying(20) NOT NULL,
    notes text DEFAULT ''::text NOT NULL,
    outcome character varying(50),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    next_followup_at timestamp with time zone,
    created_by character varying(255),
    CONSTRAINT lead_contact_logs_contact_type_check CHECK (((contact_type)::text = ANY ((ARRAY['CALL'::character varying, 'SMS'::character varying, 'EMAIL'::character varying])::text[]))),
    CONSTRAINT lead_contact_logs_outcome_check CHECK (((outcome IS NULL) OR ((outcome)::text = ANY ((ARRAY['NO_ANSWER'::character varying, 'INTERESTED'::character varying, 'NOT_INTERESTED'::character varying, 'PAID'::character varying, 'PRESENT'::character varying, 'ABSENT'::character varying, 'CALLBACK'::character varying, 'CONFIRMED_SCHEDULE'::character varying, 'ARCHIVE'::character varying, 'DROP'::character varying, 'CANCEL'::character varying, 'REMIND_SUCCESS'::character varying])::text[]))))
);


ALTER TABLE public.lead_contact_logs OWNER TO postgres;

--
-- Name: user_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_accounts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_accounts_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'user'::character varying])::text[])))
);


ALTER TABLE public.user_accounts OWNER TO postgres;

--
-- Name: website_tracking_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.website_tracking_events (
    id bigint NOT NULL,
    event_type character varying(60) NOT NULL,
    section_key character varying(150),
    path character varying(255),
    duration_ms integer DEFAULT 0 NOT NULL,
    session_id character varying(120),
    user_agent text,
    ip_address character varying(120),
    occurred_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.website_tracking_events OWNER TO postgres;

--
-- Name: website_tracking_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.website_tracking_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.website_tracking_events_id_seq OWNER TO postgres;

--
-- Name: website_tracking_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.website_tracking_events_id_seq OWNED BY public.website_tracking_events.id;


--
-- Name: admin_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users ALTER COLUMN id SET DEFAULT nextval('public.admin_users_id_seq'::regclass);


--
-- Name: franchise_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.franchise_requests ALTER COLUMN id SET DEFAULT nextval('public.franchise_requests_id_seq'::regclass);


--
-- Name: website_tracking_events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.website_tracking_events ALTER COLUMN id SET DEFAULT nextval('public.website_tracking_events_id_seq'::regclass);


--
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_users (id, email, password, created_at) FROM stdin;
1	admin@milkshop.local	$2a$06$NdMgeUiFyqV3.i5D9sQiver61R2KPHYWrCiBpQxI8SBkMI7.9o.7C	2026-02-27 16:15:22.348701
\.


--
-- Data for Name: app_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.app_settings (key, value, updated_at) FROM stdin;
franchise_qr_url	http://172.16.1.144:5173/franchise#inquiry	2026-03-23 09:47:20.074768+08
franchise_confirmation_email_template	Good day, (name)!\n\nThank you for signing up with Milkshop Franchise! 🎉\n\nWe're excited to help you explore this amazing opportunity.\n\nWhat to expect:\n\nOur team will review your application\nWe'll reach out to schedule an initial call within 3–5 business days\nIf you're ready, we'd love to connect sooner to discuss our franchise process, current promos, and answer any questions you may have. Just reply to this email or message us directly!\n\nLooking forward to chatting with you soon!\n\nWarm regards,\nMilkshop Team	2026-03-23 09:47:20.077391+08
\.


--
-- Data for Name: franchise_leads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.franchise_leads (id, full_name, email, contact_number, best_contact_time, annual_income, proposed_location, package_type, remarks, referral, stage, status, contact_outcome, followup_count, next_followup_at, last_contacted_at, assigned_to, created_at, updated_at, best_contact_at, remarks_admin) FROM stdin;
7834ab36-5987-4e2a-a185-c112e88cd0e8	Jc Pagdanganan	jc@gmail.com	0922355512	2026-03-05T13:00	800000	Malolos City	kiosk	Milkshop the best	MJ	ORIENTATION	DROPPED	\N	9	2026-03-11 16:46:00+08	2026-03-03 16:47:01.947961+08	\N	2026-03-03 13:22:39.37051+08	2026-03-03 16:47:01.961899+08	2026-03-05 13:00:00+08	\N
16f27751-7a69-48ac-94ec-015de287a105	JC Pagdanganan	jc@gmail.com	0966912310	Saturday 1pm - 3pm	1500000	Malolos City	cart	I love Milkshop	MJ	ORIENTATION	FOR_FOLLOWUP	\N	0	\N	\N	\N	2026-02-27 17:46:27.143076+08	2026-03-02 16:18:09.149271+08	\N	\N
85648d45-ee5d-4832-bdaf-6b44a9c30e86	Allen	Allen@gmail.com	0922445123	2026-03-05T16:05	12000002	Malolos City	cart	Idol Milk		ORIENTATION	ACTIVE	\N	5	2026-03-15 13:30:00+08	2026-03-13 13:31:28.33228+08	\N	2026-03-04 16:03:05.558915+08	2026-03-13 13:31:28.363014+08	2026-03-05 16:05:00+08	\N
b42fda4a-a70d-4b71-a119-bdc51fe33d92	Sir J	j@gmail.com	0922 456 6234	2026-03-06T10:00	1200000	Malolos City	inline	I love milksup	JC	ORIENTATION	APPROVED	\N	2	2026-03-20 14:46:00+08	2026-03-13 14:46:46.769805+08	\N	2026-03-04 10:10:40.676049+08	2026-03-13 14:46:46.794088+08	2026-03-06 10:00:00+08	\N
fa467936-f133-4662-86c8-9fdd1e070821	Chris Brown	brown@gmail.com	0955 231 5782	2026-03-08T10:04	15000000	SM Malolos	kiosk	Love MILKSHOP	cj	REGISTERED	ARCHIVED	\N	1	2026-03-20 13:32:00+08	2026-03-13 13:32:10.116566+08	\N	2026-03-06 15:04:38.364465+08	2026-03-13 13:32:10.125417+08	2026-03-08 10:04:00+08	\N
85a1c6d6-7aaf-4761-88c0-d6092f6805d1	test	jcpagdanganan50@gmail.com	0932 421 5155	2026-03-23T11:00	1200000	Malolos City	cart	testing lang	asd	REGISTERED	FOR_FOLLOWUP	\N	0	\N	\N	\N	2026-03-21 11:02:02.208155+08	2026-03-23 11:01:24.872292+08	2026-03-23 11:00:00+08	\N
289ff987-b42d-4b31-aed1-4160708c9946	Paul Camus	Paul@gmail.com	0969177000	Saturday 1pm - 3pm	800000	Malolos	cart	I love milkshop	MJ	ORIENTATION	ACTIVE	\N	0	\N	\N	\N	2026-03-02 16:20:26.085088+08	2026-03-02 16:21:22.873369+08	\N	\N
7370c9e9-89e3-44b3-bd72-ad2eb1495246	Juan	juan@gmail.com	0922 234 3334	2026-03-08T14:15	1000000	Malolos City	kiosk	milkshop	mj	REGISTERED	DROPPED	\N	1	\N	2026-03-13 13:32:30.158756+08	\N	2026-03-05 14:17:00.111061+08	2026-03-13 13:32:30.166698+08	2026-03-08 14:15:00+08	\N
73f42a3f-0f8b-4c63-91cb-dece0c4e8176	Jose Carlo	jc@gmail.com	09691770822	2026-03-04T14:57	15000000	Malolos City	cart	Milkshop best	JC	ONBOARDING	ACTIVE	\N	3	2026-03-05 10:32:00+08	2026-03-05 10:32:53.691105+08	\N	2026-03-04 14:55:12.033081+08	2026-03-05 10:32:53.820711+08	2026-03-04 14:57:00+08	\N
f10f11cd-4dfe-4cc7-92cd-0a3e3b361d24	Kier	Kier@gmail.com	0933 563 2441	2026-03-05T17:00	800000	Malolos	kiosk	I love Milkshop	Lolo ko	ONBOARDING	ACTIVE	\N	7	2026-03-03 17:23:00+08	2026-03-03 17:23:58.364116+08	\N	2026-03-03 17:03:13.11998+08	2026-03-03 17:23:58.370316+08	2026-03-05 17:00:00+08	\N
761b22dc-a461-4ed6-a688-157bf45b8c70	asd	asd@gmail.com	12414124235	2026-03-03T13:33	123334	SM Malolos	kiosk	asdbtbttrb	cj	REGISTERED	DROPPED	\N	1	2026-03-03 18:02:00+08	2026-03-03 16:02:41.318526+08	\N	2026-03-03 13:32:01.646884+08	2026-03-03 16:02:41.325271+08	2026-03-03 13:33:00+08	\N
ece000a5-d5bd-4d8d-9628-e1151f2af82f	Jose Carlo Pagdanganan	jc@gmail.com	09691770822	\N	\N	Malolos, Bulacan	cart	Hi there JC!	\N	ORIENTATION	APPROVED	\N	3	2026-03-20 11:30:00+08	2026-03-16 11:30:05.78998+08	\N	2026-02-27 17:32:14.113639+08	2026-03-16 11:30:05.810626+08	\N	\N
0e8e23ce-9667-4bde-ac4d-a933b7519f24	Carla Gabriel	carla@rhet-corp.com	09311895303	2026-03-12T01:52	100000	Bulacan	kiosk	N/A		ORIENTATION	ACTIVE	\N	4	2026-03-16 15:00:00+08	2026-03-12 16:21:24.455238+08	\N	2026-03-12 10:52:30.777349+08	2026-03-12 16:21:24.481327+08	2026-03-12 01:52:00+08	\N
88a314ec-c21d-45f1-8e33-6ff544b96ff9	Giannis Antetokounpu	josecarlopagdanganan28@gmail.com	09691770822	2026-03-15T13:01	15000000	Malolos City	kiosk	sarap milksho	MJ	REGISTERED	FOR_FOLLOWUP	\N	1	2026-03-20 13:08:00+08	2026-03-16 13:02:20.154341+08	\N	2026-03-16 13:01:58.274834+08	2026-03-16 13:02:20.170814+08	2026-03-15 13:01:00+08	\N
9d5e2eea-eae8-4ffd-894b-86eb77bfae01	Jose Carlo Pagdanganan	josecarlopagdanganan28@gmail.com	0922 123 5231	2026-03-13T09:30	1200000	Malolos	cart	Love milkshop	POGI	ORIENTATION	ACTIVE	\N	1	2026-03-15 14:05:00+08	2026-03-13 14:05:57.924493+08	\N	2026-03-11 10:02:50.77439+08	2026-03-13 14:05:57.947084+08	2026-03-13 09:30:00+08	\N
55f6c880-c033-4b67-93cb-c0a2c56a931f	JIZPOGI	josecarlopagdanganan28@gmail.com	0966912310	2026-03-13T10:30	800000	Malolos City	inline	asdsadasd	asdasda	REGISTERED	ACTIVE	\N	2	2026-03-18 13:40:00+08	2026-03-16 13:39:52.364741+08	\N	2026-03-11 10:25:29.887153+08	2026-03-16 13:39:52.383773+08	2026-03-13 10:30:00+08	\N
65504000-ed45-4666-94e9-37c778b65e96	JIZZY	josecarlopagdanganan28@gmail.com	09691770822	2026-03-13T10:00	15000000	Malolos City	kiosk	I love milkshop	jjjj	ORIENTATION	ACTIVE	\N	5	2026-03-20 13:00:00+08	2026-03-16 11:05:16.044215+08	\N	2026-03-11 10:12:33.13569+08	2026-03-16 11:05:16.062087+08	2026-03-13 10:00:00+08	\N
4cd15530-a27a-4c7a-859b-f69414d04c3e	Kier Angelo Bonton	kierbonton04@gmail.com	09327327482	2026-03-18T16:12	100000000	SM Baliwag	cart	69th floor		REGISTERED	FOR_FOLLOWUP	\N	0	\N	\N	\N	2026-03-11 16:13:34.961872+08	2026-03-21 09:07:26.564251+08	2026-03-18 16:12:00+08	\N
7af3e7e5-d904-4d2a-bd47-2d47c8577d31	Jc Pagdanganan	jcpagdanganan50@gmail.com	0923 455 1234	2026-03-13T12:58	1500000	Apalit	inline	hahaa	hehehe	REGISTERED	INACTIVE	\N	2	2026-03-18 11:15:00+08	2026-03-16 11:15:31.619738+08	\N	2026-03-11 12:59:05.55605+08	2026-03-16 11:15:31.640603+08	2026-03-13 12:58:00+08	\N
47e419cc-82cb-4fca-8848-fa21f1d12a5f	Kevin Durant	jcshawmipho@gmail.com	0960 803 1275	2026-03-20T13:00	1200000	Malolos City	kiosk	SOLID MILKSHOP	rat	REGISTERED	FOR_FOLLOWUP	\N	0	\N	\N	\N	2026-03-16 13:00:57.255487+08	2026-03-21 09:07:26.564251+08	2026-03-20 13:00:00+08	\N
b8509b69-3f4d-4427-a433-a4c6569d8fef	Lebron James	jcshawmipho@gmail.com	09691770822	2026-03-15T17:20	15000000	SM Malolos	kiosk	Sobra solid milkshop	Luka	ORIENTATION	ACTIVE	\N	1	2026-03-15 14:30:00+08	2026-03-13 14:24:32.394064+08	\N	2026-03-13 14:19:09.814248+08	2026-03-13 14:24:32.436175+08	2026-03-15 17:20:00+08	\N
9132ab5a-ecf4-416f-bfa6-f458b7bb9ba7	JJJ	j@gmail.com	0922 324 1266	2026-03-07T01:00	1500000	Malolos City	inline	Milkshop the best	Lola ko	ORIENTATION	INACTIVE	\N	3	2026-03-20 17:30:00+08	2026-03-16 11:17:20.11545+08	\N	2026-03-04 13:20:59.431009+08	2026-03-16 11:17:20.134055+08	2026-03-07 01:00:00+08	\N
270ae4bc-2f88-4d1c-b3a2-e73774f1667b	JC Pagdanganan	jc@gmail.com	09691770812	2026-03-05T08:00	15000000	Apalit Pampanga	cart	Milkshop	JC	ORIENTATION	APPROVED	\N	7	2026-03-16 14:45:00+08	2026-03-13 14:45:52.078791+08	\N	2026-03-04 14:49:42.248977+08	2026-03-13 14:45:52.095345+08	2026-03-05 08:00:00+08	\N
204aec20-aae2-482e-8e68-4c541f85696c	Mj	mj@gmail.com	09555123	\N	\N	Cebu City	kiosk	Rising Hope	\N	ORIENTATION	ACTIVE	\N	1	2026-03-23 10:30:00+08	2026-03-21 09:32:14.974995+08	\N	2026-02-27 17:34:06.662411+08	2026-03-21 09:32:14.994356+08	\N	\N
\.


--
-- Data for Name: franchise_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.franchise_requests (id, full_name, email, contact_number, proposed_location, preferred_package, remarks, created_at, best_contact_time, estimated_annual_income, referral) FROM stdin;
1	Jose Carlo Pagdanganan	jc@gmail.com	09691770822	Malolos, Bulacan	cart	Hi there JC!	2026-02-27 17:32:14.113639	\N	\N	\N
2	Mj	mj@gmail.com	09555123	Cebu City	kiosk	Rising Hope	2026-02-27 17:34:06.662411	\N	\N	\N
3	JC Pagdanganan	jc@gmail.com	0966912310	Malolos City	cart	I love Milkshop	2026-02-27 17:46:27.143076	Saturday 1pm - 3pm	1, 500, 000	MJ
4	JC Pagdanganan	jc@gmail.com	09691770822	SM Malolos	kiosk	I love Milkshop!	2026-03-02 16:11:56.613584	Saturday 1pm - 3pm	800,000	Lolo ko
5	Paul Camus	Paul@gmail.com	0969177000	Malolos	cart	I love milkshop	2026-03-02 16:20:26.078717	Saturday 1pm - 3pm	800,000	MJ
6	Testing	test@gmail.com	0966912310	Malolos City	kiosk	awdasd	2026-03-03 13:15:55.867528	2026-03-05T16:30	1200000	dd
7	Jc Pagdanganan	jc@gmail.com	0922355512	Malolos City	kiosk	Milkshop the best	2026-03-03 13:22:39.360987	2026-03-05T13:00	800000	MJ
8	asd	asd@gmail.com	12414124235	SM Malolos	kiosk	asdbtbttrb	2026-03-03 13:32:01.630897	2026-03-03T13:33	123334	cj
9	Kier	Kier@gmail.com	0933 563 2441	Malolos	kiosk	I love Milkshop	2026-03-03 17:03:13.109276	2026-03-05T17:00	800000	Lolo ko
10	Sir J	j@gmail.com	0922 456 6234	Malolos City	inline	I love milksup	2026-03-04 10:10:40.659922	2026-03-06T10:00	1,200,000	JC
11	JJJ	j@gmail.com	0922 324 1266	Malolos City	inline	Milkshop the best	2026-03-04 13:20:59.405233	2026-03-07T01:00	1,500,000	Lola ko
12	JC Pagdanganan	jc@gmail.com	09691770812	Apalit Pampanga	cart	Milkshop	2026-03-04 14:49:42.228614	2026-03-05T08:00	15000000	JC
13	Jose Carlo	jc@gmail.com	09691770822	Malolos City	cart	Milkshop best	2026-03-04 14:55:12.026761	2026-03-04T14:57	15000000	JC
14	Allen	Allen@gmail.com	0922445123	Malolos City	cart	Idol Milk	2026-03-04 16:03:05.550923	2026-03-05T16:05	12000002	
15	Juan	juan@gmail.com	0922 234 3334	Malolos City	kiosk	milkshop	2026-03-05 14:17:00.081421	2026-03-08T14:15	1000000	mj
16	Chris Brown	brown@gmail.com	0955 231 5782	SM Malolos	kiosk	Love MILKSHOP	2026-03-06 15:04:38.346497	2026-03-08T10:04	15000000	cj
17	Jose Carlo Pagdanganan	josecarlopagdanganan28@gmail.com	0922 123 5231	Malolos	cart	Love milkshop	2026-03-11 10:02:50.714436	2026-03-13T09:30	1200000	POGI
18	JIZZY	josecarlopagdanganan28@gmail.com	09691770822	Malolos City	kiosk	I love milkshop	2026-03-11 10:12:33.113426	2026-03-13T10:00	15000000	jjjj
19	JIZPOGI	josecarlopagdanganan28@gmail.com	0966912310	Malolos City	inline	asdsadasd	2026-03-11 10:25:29.863787	2026-03-13T10:30	800000	asdasda
20	Jc Pagdanganan	jcpagdanganan50@gmail.com	0923 455 1234	Apalit	inline	hahaa	2026-03-11 12:59:05.532387	2026-03-13T12:58	1500000	hehehe
21	Kier Angelo Bonton	kierbonton04@gmail.com	09327327482	SM Baliwag	cart	69th floor	2026-03-11 16:13:34.95592	2026-03-18T16:12	100000000	
22	Carla Gabriel	carla@rhet-corp.com	09311895303	Bulacan	kiosk	N/A	2026-03-12 10:52:30.72479	2026-03-12T01:52	100000	
23	Lebron James	jcshawmipho@gmail.com	09691770822	SM Malolos	kiosk	Sobra solid milkshop	2026-03-13 14:19:09.795712	2026-03-15T17:20	15000000	Luka
24	Kevin Durant	jcshawmipho@gmail.com	0960 803 1275	Malolos City	kiosk	SOLID MILKSHOP	2026-03-16 13:00:57.224265	2026-03-20T13:00	1200000	rat
25	Giannis Antetokounpu	josecarlopagdanganan28@gmail.com	09691770822	Malolos City	kiosk	sarap milksho	2026-03-16 13:01:58.271039	2026-03-15T13:01	15000000	MJ
26	test	jcpagdanganan50@gmail.com	0932 421 5155	Malolos City	cart	testing lang	2026-03-21 11:02:02.194338	2026-03-23T11:00	1200000	asd
\.


--
-- Data for Name: lead_contact_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lead_contact_logs (id, lead_id, contact_type, notes, outcome, created_at, next_followup_at, created_by) FROM stdin;
bc5daf6b-9a39-4937-b70f-79536ca3747c	7834ab36-5987-4e2a-a185-c112e88cd0e8	CALL	Contact record: Confirmed Schedule	\N	2026-03-03 15:55:52.387393+08	\N	\N
fad70910-5ffb-4d40-b958-ace9a64e8767	7834ab36-5987-4e2a-a185-c112e88cd0e8	CALL	Contact record: Confirmed Schedule	\N	2026-03-03 15:55:55.225479+08	\N	\N
7f1a902b-f3f7-4bbb-b729-5cc4735b465c	761b22dc-a461-4ed6-a688-157bf45b8c70	CALL	ekis	\N	2026-03-03 16:02:41.316461+08	\N	\N
cf3b7d11-955a-44f2-9120-21ccdda266cb	7834ab36-5987-4e2a-a185-c112e88cd0e8	CALL	Contact record: Confirmed Schedule	CONFIRMED_SCHEDULE	2026-03-03 16:06:28.425391+08	\N	\N
56306ca0-e272-45fc-8fae-5564ce694e1f	7834ab36-5987-4e2a-a185-c112e88cd0e8	CALL	Contact record: Confirmed Schedule	CONFIRMED_SCHEDULE	2026-03-03 16:06:29.881795+08	\N	\N
8d9ac8b2-0941-4f33-bfa6-13f37e497b5e	7834ab36-5987-4e2a-a185-c112e88cd0e8	CALL	Contact record: Confirmed Schedule	CONFIRMED_SCHEDULE	2026-03-03 16:06:30.537091+08	\N	\N
914bfda5-ae58-48a4-99e9-c801e77ab1e3	7834ab36-5987-4e2a-a185-c112e88cd0e8	CALL	Contact record: Confirmed Schedule	CONFIRMED_SCHEDULE	2026-03-03 16:06:31.064074+08	\N	\N
f4e83196-13b5-470d-95f1-9b3fa3f6eb72	7834ab36-5987-4e2a-a185-c112e88cd0e8	CALL	Contact record: Absent	ABSENT	2026-03-03 16:07:12.139744+08	\N	\N
2bb1c6be-aea7-4130-8d3a-681c82d6f274	7834ab36-5987-4e2a-a185-c112e88cd0e8	CALL	ATTENDED!	PRESENT	2026-03-03 16:11:03.409012+08	\N	\N
36f9b26e-ee48-4e53-b29e-0d28ab14bf39	7834ab36-5987-4e2a-a185-c112e88cd0e8	CALL	Contact record: Drop	\N	2026-03-03 16:47:01.940363+08	\N	\N
78249c95-ca3d-4713-8405-38b8752027ca	f10f11cd-4dfe-4cc7-92cd-0a3e3b361d24	CALL	KIER	\N	2026-03-03 17:03:45.749512+08	\N	\N
4da12a92-c34e-466d-8a64-b16b596c6104	f10f11cd-4dfe-4cc7-92cd-0a3e3b361d24	CALL	Contact record: Absent	ABSENT	2026-03-03 17:20:47.588363+08	\N	\N
97efd762-aa1c-43ae-8b0e-30cdbaf557a6	f10f11cd-4dfe-4cc7-92cd-0a3e3b361d24	CALL	Contact record: Confirmed Schedule	\N	2026-03-03 17:21:27.755575+08	\N	\N
437c9499-e7f2-4cd2-88e8-355ab407ac9c	f10f11cd-4dfe-4cc7-92cd-0a3e3b361d24	CALL	Contact record: Absent	ABSENT	2026-03-03 17:21:41.612629+08	\N	\N
756c154b-0f90-4877-8783-d50e990b801e	f10f11cd-4dfe-4cc7-92cd-0a3e3b361d24	CALL	Contact record: Confirmed Schedule	\N	2026-03-03 17:21:48.884174+08	\N	\N
6b023d93-55be-4246-a5cc-2475bb7a54d3	f10f11cd-4dfe-4cc7-92cd-0a3e3b361d24	CALL	Contact record: Present	PRESENT	2026-03-03 17:22:02.994422+08	\N	\N
7824ded7-9a43-45a0-96bf-55acdf99a95c	f10f11cd-4dfe-4cc7-92cd-0a3e3b361d24	CALL	Contact record: Paid	PAID	2026-03-03 17:23:58.36024+08	\N	\N
ae5e6eb2-3848-45c5-8e2f-1ea09ccb2c19	b42fda4a-a70d-4b71-a119-bdc51fe33d92	CALL	Contact record: Confirmed Schedule	\N	2026-03-04 11:16:53.466184+08	\N	\N
bf1cf6bf-b463-4012-8602-cf6b31c81bcd	9132ab5a-ecf4-416f-bfa6-f458b7bb9ba7	CALL	Contact record: Confirmed Schedule	\N	2026-03-04 14:08:08.111379+08	\N	\N
4a0ab4ee-e9df-4a93-8b0f-87707fcb0b32	270ae4bc-2f88-4d1c-b3a2-e73774f1667b	CALL	POTENTIAL	\N	2026-03-04 14:52:25.14183+08	\N	\N
3ee3ed51-ca02-46cd-b9e8-7b29553c28a7	270ae4bc-2f88-4d1c-b3a2-e73774f1667b	CALL	POTENTIAL	\N	2026-03-04 14:53:50.019894+08	\N	\N
c22b1b3a-4e9c-4351-b0b4-95cddf6a5c7a	73f42a3f-0f8b-4c63-91cb-dece0c4e8176	CALL	Contact record: Confirmed Schedule	\N	2026-03-04 14:56:49.640169+08	\N	\N
d849de1e-e7b4-45ff-b8ce-4d72b6640c80	270ae4bc-2f88-4d1c-b3a2-e73774f1667b	CALL	Contact record: Absent	ABSENT	2026-03-04 14:57:45.22078+08	\N	\N
cc97a684-b848-472e-a1a5-81e141baa7ac	73f42a3f-0f8b-4c63-91cb-dece0c4e8176	CALL	Contact record: Present	PRESENT	2026-03-04 14:58:35.802534+08	\N	\N
1939d458-f348-4cbe-822e-5c61440d4841	270ae4bc-2f88-4d1c-b3a2-e73774f1667b	CALL	Contact record: Confirmed Schedule	\N	2026-03-04 15:01:43.371101+08	\N	\N
22486a42-3cd0-4a16-9940-b9030ba916b0	ece000a5-d5bd-4d8d-9628-e1151f2af82f	CALL	Contact record: Confirmed Schedule	\N	2026-03-04 15:24:48.141528+08	\N	\N
57ff0d6b-0878-4856-a10e-8680b56aa0b4	ece000a5-d5bd-4d8d-9628-e1151f2af82f	CALL	Contact record: Present	PRESENT	2026-03-04 15:53:16.964187+08	\N	\N
7b8471b9-8f3e-4c71-9599-2357d8426377	73f42a3f-0f8b-4c63-91cb-dece0c4e8176	CALL	Contact record: Paid	PAID	2026-03-05 10:32:53.678264+08	\N	\N
752f1e29-ab19-410b-a1f1-98ad03db201c	270ae4bc-2f88-4d1c-b3a2-e73774f1667b	CALL	Contact record: Absent	ABSENT	2026-03-07 13:22:09.314755+08	\N	\N
44f62fa5-4f31-4911-be6b-4647cf548ac1	270ae4bc-2f88-4d1c-b3a2-e73774f1667b	CALL	Contact record: Confirmed Schedule	\N	2026-03-07 13:22:43.300155+08	\N	\N
11ce8753-5e06-4df9-973f-9a8063ca4a8b	9132ab5a-ecf4-416f-bfa6-f458b7bb9ba7	CALL	Contact record: Present	PRESENT	2026-03-07 13:23:08.62051+08	\N	\N
3edce351-a5a6-4822-9ef5-98f9a237f775	0e8e23ce-9667-4bde-ac4d-a933b7519f24	CALL	not picking up	NO_ANSWER	2026-03-12 16:17:10.815896+08	\N	\N
aedd9e07-7607-4194-ad08-8d8d108f0fa6	0e8e23ce-9667-4bde-ac4d-a933b7519f24	CALL	Contact record: No Response	NO_ANSWER	2026-03-12 16:17:35.904753+08	\N	\N
9e9a2e94-bc45-4b60-9143-e7802314affb	0e8e23ce-9667-4bde-ac4d-a933b7519f24	CALL	Contact record: No Response	NO_ANSWER	2026-03-12 16:17:49.125144+08	\N	\N
19114960-8ad5-4d4d-afe2-6791a19bb4aa	0e8e23ce-9667-4bde-ac4d-a933b7519f24	CALL	1st schedule	\N	2026-03-12 16:21:24.453302+08	\N	\N
692786c2-7a5d-4028-bee2-17cc0cebc1c5	85648d45-ee5d-4832-bdaf-6b44a9c30e86	CALL	No response	NO_ANSWER	2026-03-13 11:43:46.786475+08	\N	\N
d2789b80-d904-43b5-9101-6c1cd49ccda0	85648d45-ee5d-4832-bdaf-6b44a9c30e86	CALL	Contact record: No Response	NO_ANSWER	2026-03-13 11:44:11.975768+08	\N	\N
f9198c0b-2803-4ad8-bddb-88f4edec65ec	85648d45-ee5d-4832-bdaf-6b44a9c30e86	CALL	asd	NO_ANSWER	2026-03-13 11:46:44.497071+08	\N	\N
0df33492-e226-46ad-9d9f-89252fb57630	85648d45-ee5d-4832-bdaf-6b44a9c30e86	CALL	 Busy	NO_ANSWER	2026-03-13 13:03:02.788761+08	\N	\N
3bb1b10a-54f0-4c5c-8e8b-e844481868d8	7af3e7e5-d904-4d2a-bd47-2d47c8577d31	CALL	Ayaw	NO_ANSWER	2026-03-13 13:20:47.957903+08	2026-03-15 20:30:00+08	admin@milkshop.local
04c114ff-ff3a-4bdc-9332-b32c2c54afe9	85648d45-ee5d-4832-bdaf-6b44a9c30e86	CALL	hi	CONFIRMED_SCHEDULE	2026-03-13 13:31:28.313865+08	2026-03-15 13:30:00+08	admin@milkshop.local
9f8d4d39-987e-4663-803b-bd8acc2d5695	fa467936-f133-4662-86c8-9fdd1e070821	CALL	doppppp	ARCHIVE	2026-03-13 13:32:10.105342+08	2026-03-20 13:32:00+08	admin@milkshop.local
cb70c7d0-6583-492f-847a-b1a22fe52763	7370c9e9-89e3-44b3-bd72-ad2eb1495246	CALL	dropppp	DROP	2026-03-13 13:32:30.154628+08	\N	admin@milkshop.local
8a9c890e-8b19-4420-b20f-880f6e0c229b	55f6c880-c033-4b67-93cb-c0a2c56a931f	CALL	ayaw	ARCHIVE	2026-03-13 13:32:52.431791+08	2026-03-20 13:32:00+08	admin@milkshop.local
85d0035c-3b1f-4b38-b2a7-d9891d22b4c1	9d5e2eea-eae8-4ffd-894b-86eb77bfae01	CALL	CONFIRMEDDDDD	CONFIRMED_SCHEDULE	2026-03-13 14:05:57.912786+08	2026-03-15 14:05:00+08	admin@milkshop.local
33679e19-6630-4faf-aa5d-97906438ac6e	b8509b69-3f4d-4427-a433-a4c6569d8fef	CALL	Si lebron idol ko	CONFIRMED_SCHEDULE	2026-03-13 14:24:32.369041+08	2026-03-15 14:30:00+08	admin@milkshop.local
1e12479b-57ef-45b0-baf5-14d0cfd4d6f9	270ae4bc-2f88-4d1c-b3a2-e73774f1667b	CALL	asd	PRESENT	2026-03-13 14:45:52.068822+08	2026-03-16 14:45:00+08	admin@milkshop.local
862dc00b-4654-43cf-90aa-018fc6b09be0	b42fda4a-a70d-4b71-a119-bdc51fe33d92	CALL	SIRRJRJJERJEABO	PRESENT	2026-03-13 14:46:46.763837+08	2026-03-20 14:46:00+08	admin@milkshop.local
7858ce89-256c-4f5e-a468-6bb064a124de	65504000-ed45-4666-94e9-37c778b65e96	CALL	NOT RINGING	NO_ANSWER	2026-03-14 13:34:12.833655+08	2026-03-16 13:32:00+08	admin@milkshop.local
8dca046a-c190-45ec-b5c0-ea0a5dcd8345	65504000-ed45-4666-94e9-37c778b65e96	CALL	REMARKS TEST	CALLBACK	2026-03-14 13:38:50.397069+08	2026-03-16 13:38:00+08	admin@milkshop.local
4d6f37e8-2098-4706-b121-e8458b0c65d1	65504000-ed45-4666-94e9-37c778b65e96	CALL	Confirmedkp	CONFIRMED_SCHEDULE	2026-03-16 10:33:30.672349+08	2026-03-18 10:33:00+08	admin@milkshop.local
e76820ea-972a-4f5c-b5dd-e978486d98f4	65504000-ed45-4666-94e9-37c778b65e96	CALL	Wala sumasagot amp	CANCEL	2026-03-16 11:04:49.95481+08	2026-03-18 11:04:00+08	admin@milkshop.local
811ea5d1-4fe7-4a67-a595-f925fe34c6e5	65504000-ed45-4666-94e9-37c778b65e96	CALL	FInally	CONFIRMED_SCHEDULE	2026-03-16 11:05:16.041919+08	2026-03-20 13:00:00+08	admin@milkshop.local
77138454-f1fe-4414-8b5e-e4e8e8690525	7af3e7e5-d904-4d2a-bd47-2d47c8577d31	CALL	tawagan ko ulit later	CALLBACK	2026-03-16 11:15:31.609484+08	2026-03-18 11:15:00+08	admin@milkshop.local
d8d13a4d-fa9f-4e32-b373-e3c483f7edf6	9132ab5a-ecf4-416f-bfa6-f458b7bb9ba7	CALL	ayaw sumagot amp	NO_ANSWER	2026-03-16 11:17:20.110154+08	2026-03-20 17:30:00+08	admin@milkshop.local
00f853e9-a946-4d76-b005-350ba139eb55	ece000a5-d5bd-4d8d-9628-e1151f2af82f	CALL	Ayaw sumagot	NO_ANSWER	2026-03-16 11:30:05.77714+08	2026-03-20 11:30:00+08	admin@milkshop.local
e36482bf-ab5b-4c4d-acdd-4d578b608ebd	88a314ec-c21d-45f1-8e33-6ff544b96ff9	CALL	Ayaw amp	NO_ANSWER	2026-03-16 13:02:20.149651+08	2026-03-20 13:08:00+08	admin@milkshop.local
189992b7-ba99-4b0a-8018-0ec0759be3ba	55f6c880-c033-4b67-93cb-c0a2c56a931f	CALL	ulit tayo	CONFIRMED_SCHEDULE	2026-03-16 13:39:52.349402+08	2026-03-18 13:40:00+08	admin@milkshop.local
afbaa389-0796-4e93-8873-33fb00d1217f	204aec20-aae2-482e-8e68-4c541f85696c	CALL	tomorrpwww	CONFIRMED_SCHEDULE	2026-03-21 09:32:14.962605+08	2026-03-23 10:30:00+08	admin@milkshop.local
\.


--
-- Data for Name: user_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_accounts (id, email, username, password, role, is_active, created_at, updated_at) FROM stdin;
a9f069aa-3ea4-41a6-983b-15434ce4fc73	admin@milkshop.local	admin	$2a$06$NdMgeUiFyqV3.i5D9sQiver61R2KPHYWrCiBpQxI8SBkMI7.9o.7C	admin	t	2026-03-23 10:40:14.160267+08	2026-03-23 10:40:14.160267+08
d5f9a53f-1460-4dcb-af73-99bdb4b8f9b1	it.jose@milkshop.com	Jose	$2b$10$kgDmPoOEs43CocfMpYEZ3u9FbmYF/zg9KsHLW3Z4ZV8ZzSebDc1rq	user	t	2026-03-23 10:42:48.369954+08	2026-03-23 10:43:51.153444+08
\.


--
-- Data for Name: website_tracking_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.website_tracking_events (id, event_type, section_key, path, duration_ms, session_id, user_agent, ip_address, occurred_at, created_at) FROM stdin;
1	section_view_end	Born in Taiwan. Loved in Manila.	/	4333	1774247296684-7n7i02hs	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	::ffff:172.16.1.144	2026-03-23 15:02:23.814+08	2026-03-23 15:02:23.826138+08
2	section_view_end	Crafted With Precision	/	23687	1774247296684-7n7i02hs	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	::ffff:172.16.1.144	2026-03-23 15:02:52.811+08	2026-03-23 15:02:52.81679+08
3	nav_click	Menu	/	0	1774247296684-7n7i02hs	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	::ffff:172.16.1.144	2026-03-23 15:03:23.721+08	2026-03-23 15:03:23.795531+08
4	section_view_end	Real Stories. Real Success.	/	19853	1774247296684-7n7i02hs	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	::ffff:172.16.1.144	2026-03-23 15:03:23.78+08	2026-03-23 15:03:23.797986+08
5	nav_click	Locations	/products	0	1774247296684-7n7i02hs	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	::ffff:172.16.1.144	2026-03-23 15:03:41.436+08	2026-03-23 15:03:41.506161+08
6	nav_click	Home	/locations	0	1774247296684-7n7i02hs	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	::ffff:172.16.1.144	2026-03-23 15:05:54.419+08	2026-03-23 15:05:54.564489+08
7	nav_click	Menu	/	0	1774247296684-7n7i02hs	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	::ffff:172.16.1.144	2026-03-23 15:13:16.109+08	2026-03-23 15:13:16.599912+08
8	nav_click	Home	/products	0	1774247296684-7n7i02hs	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	::ffff:172.16.1.144	2026-03-23 15:13:16.915+08	2026-03-23 15:13:16.974825+08
9	nav_click	Locations	/	0	1774247296684-7n7i02hs	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	::ffff:172.16.1.144	2026-03-23 15:14:23.568+08	2026-03-23 15:14:23.721495+08
10	section_view_end	Every Sip,Burstingwith Joy.	/	48558	1774247296684-7n7i02hs	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	::ffff:172.16.1.144	2026-03-23 15:14:23.627+08	2026-03-23 15:14:23.727739+08
11	section_view_end	Locations CTA	/locations	21066	1774247296684-7n7i02hs	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	::ffff:172.16.1.144	2026-03-23 15:35:37.355+08	2026-03-23 15:35:37.656382+08
\.


--
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_users_id_seq', 1, true);


--
-- Name: franchise_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.franchise_requests_id_seq', 26, true);


--
-- Name: website_tracking_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.website_tracking_events_id_seq', 11, true);


--
-- Name: admin_users admin_users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_email_key UNIQUE (email);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: app_settings app_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_pkey PRIMARY KEY (key);


--
-- Name: franchise_leads franchise_leads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.franchise_leads
    ADD CONSTRAINT franchise_leads_pkey PRIMARY KEY (id);


--
-- Name: franchise_requests franchise_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.franchise_requests
    ADD CONSTRAINT franchise_requests_pkey PRIMARY KEY (id);


--
-- Name: lead_contact_logs lead_contact_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_contact_logs
    ADD CONSTRAINT lead_contact_logs_pkey PRIMARY KEY (id);


--
-- Name: user_accounts user_accounts_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_accounts
    ADD CONSTRAINT user_accounts_email_key UNIQUE (email);


--
-- Name: user_accounts user_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_accounts
    ADD CONSTRAINT user_accounts_pkey PRIMARY KEY (id);


--
-- Name: website_tracking_events website_tracking_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.website_tracking_events
    ADD CONSTRAINT website_tracking_events_pkey PRIMARY KEY (id);


--
-- Name: idx_admin_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_admin_users_email ON public.admin_users USING btree (email);


--
-- Name: idx_franchise_requests_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_franchise_requests_created_at ON public.franchise_requests USING btree (created_at);


--
-- Name: idx_franchise_requests_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_franchise_requests_email ON public.franchise_requests USING btree (email);


--
-- Name: idx_lead_contact_logs_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lead_contact_logs_created_at ON public.lead_contact_logs USING btree (created_at);


--
-- Name: idx_lead_contact_logs_lead_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lead_contact_logs_lead_id ON public.lead_contact_logs USING btree (lead_id);


--
-- Name: idx_wte_event_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_wte_event_type ON public.website_tracking_events USING btree (event_type);


--
-- Name: idx_wte_occurred_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_wte_occurred_at ON public.website_tracking_events USING btree (occurred_at);


--
-- Name: idx_wte_section_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_wte_section_key ON public.website_tracking_events USING btree (section_key);


--
-- Name: franchise_leads franchise_leads_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER franchise_leads_updated_at BEFORE UPDATE ON public.franchise_leads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: user_accounts user_accounts_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER user_accounts_updated_at BEFORE UPDATE ON public.user_accounts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: lead_contact_logs lead_contact_logs_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_contact_logs
    ADD CONSTRAINT lead_contact_logs_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.franchise_leads(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict o5dbC5FENKym2TjESfZTa4BcQ0O0UJxuRsQxhz3T5QdizIyaREX7l2wCmg5799D

