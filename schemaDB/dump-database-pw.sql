--
-- PostgreSQL database dump
--

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 17.0

-- Started on 2026-09-21 10:00:07

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
-- TOC entry 7 (class 2615 OID 16839)
-- Name: anamnesi; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA anamnesi;


ALTER SCHEMA anamnesi OWNER TO postgres;

--
-- TOC entry 8 (class 2615 OID 32900)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO postgres;

--
-- TOC entry 2 (class 3079 OID 16390)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 3633 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 271 (class 1255 OID 16450)
-- Name: crea_record_paziente(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.crea_record_paziente() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    target_table text := TG_ARGV[0];
BEGIN
    EXECUTE format(
        'INSERT INTO %I (id_paziente) VALUES ($1)',
        target_table
    )
    USING NEW.id;

    RETURN NEW;
END;
$_$;


ALTER FUNCTION public.crea_record_paziente() OWNER TO postgres;

--
-- TOC entry 270 (class 1255 OID 16435)
-- Name: imposta_timestamp_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.imposta_timestamp_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.imposta_timestamp_update() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 16840)
-- Name: analisi_psico_sociale; Type: TABLE; Schema: anamnesi; Owner: postgres
--

CREATE TABLE anamnesi.analisi_psico_sociale (
    lavoro character varying(255),
    stress character varying(255),
    supporto_familiare character varying(255),
    condizioni_abitative character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id_paziente uuid NOT NULL
);


ALTER TABLE anamnesi.analisi_psico_sociale OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16906)
-- Name: anamnesi_familiare; Type: TABLE; Schema: anamnesi; Owner: postgres
--

CREATE TABLE anamnesi.anamnesi_familiare (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    malattie_ereditarie character varying(255),
    note_ambientali character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id_paziente uuid NOT NULL
);


ALTER TABLE anamnesi.anamnesi_familiare OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16851)
-- Name: anamnesi_patologica_attuale; Type: TABLE; Schema: anamnesi; Owner: postgres
--

CREATE TABLE anamnesi.anamnesi_patologica_attuale (
    sintomatologia_principale character varying(255),
    insorgenza date,
    durata character varying(255),
    fattori_miglioramento character varying(255),
    fattori_peggioramento character varying(255),
    sintomi_associati character varying(255),
    updated_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    id_paziente uuid NOT NULL
);


ALTER TABLE anamnesi.anamnesi_patologica_attuale OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16862)
-- Name: anamnesi_patologica_remota; Type: TABLE; Schema: anamnesi; Owner: postgres
--

CREATE TABLE anamnesi.anamnesi_patologica_remota (
    malattie_pregresse character varying(255),
    interventi_chirurgici character varying(255),
    ricoveri character varying(255),
    traumi character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id_paziente uuid NOT NULL
);


ALTER TABLE anamnesi.anamnesi_patologica_remota OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16873)
-- Name: farmaci_allergie; Type: TABLE; Schema: anamnesi; Owner: postgres
--

CREATE TABLE anamnesi.farmaci_allergie (
    terapie_in_corso character varying(255),
    farmaci_passati character varying(255),
    allergie character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id_paziente uuid NOT NULL
);


ALTER TABLE anamnesi.farmaci_allergie OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16884)
-- Name: stato_fratelli; Type: TABLE; Schema: anamnesi; Owner: postgres
--

CREATE TABLE anamnesi.stato_fratelli (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome character varying(255) NOT NULL,
    stato character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id_anamnesi_familiare uuid NOT NULL
);


ALTER TABLE anamnesi.stato_fratelli OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16895)
-- Name: stato_genitori; Type: TABLE; Schema: anamnesi; Owner: postgres
--

CREATE TABLE anamnesi.stato_genitori (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    padre character varying(255),
    madre character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id_anamnesi_familiare uuid NOT NULL
);


ALTER TABLE anamnesi.stato_genitori OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 32934)
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.refresh_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    token character varying(255) NOT NULL,
    expiry timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    expiry_date timestamp(6) with time zone NOT NULL
);


ALTER TABLE auth.refresh_tokens OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 73744)
-- Name: user_roles; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.user_roles (
    user_id uuid NOT NULL,
    is_admin boolean NOT NULL,
    is_doctor boolean NOT NULL,
    is_user boolean NOT NULL
);


ALTER TABLE auth.user_roles OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 32901)
-- Name: users; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE auth.users OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16927)
-- Name: appuntamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appuntamento (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    id_medico uuid NOT NULL,
    id_paziente uuid,
    id_slot uuid,
    data date NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.appuntamento OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16436)
-- Name: contatti; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contatti (
    telefono character varying(30),
    email character varying(50),
    mobile character varying(30),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    id_paziente uuid NOT NULL
);


ALTER TABLE public.contatti OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16826)
-- Name: medico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medico (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome character varying(100) NOT NULL,
    cognome character varying(100) NOT NULL,
    specializzazione character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.medico OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16427)
-- Name: paziente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paziente (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome character varying(100) NOT NULL,
    cognome character varying(100) NOT NULL,
    codice_fiscale character varying(16) NOT NULL,
    data_nascita date NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.paziente OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16452)
-- Name: residenza; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.residenza (
    indirizzo character varying(250),
    numero_civico character varying(30),
    citta character varying(255),
    cap character varying(5),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    id_paziente uuid NOT NULL
);


ALTER TABLE public.residenza OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16947)
-- Name: slot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.slot (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ora_inizio character varying(36) NOT NULL,
    ora_fine character varying(36) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.slot OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 81941)
-- Name: view_appuntamenti; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.view_appuntamenti AS
 SELECT a.id AS id_appuntamento,
    a.id_paziente,
    p.nome AS nome_paziente,
    p.cognome AS cognome_paziente,
    a.id_medico,
    m.nome AS nome_medico,
    m.cognome AS cognome_medico,
    a.id_slot,
    s.ora_inizio,
    s.ora_fine,
    a.data
   FROM (((public.appuntamento a
     JOIN public.paziente p ON ((a.id_paziente = p.id)))
     JOIN public.medico m ON ((a.id_medico = m.id)))
     JOIN public.slot s ON ((a.id_slot = s.id)));


ALTER VIEW public.view_appuntamenti OWNER TO postgres;

--
-- TOC entry 3616 (class 0 OID 16840)
-- Dependencies: 221
-- Data for Name: analisi_psico_sociale; Type: TABLE DATA; Schema: anamnesi; Owner: postgres
--

INSERT INTO anamnesi.analisi_psico_sociale VALUES ('stressante', 'medio alto', 'parziale', 'buone', '2026-09-20 13:03:24.073682+00', '2026-09-20 13:04:56.54386+00', '99294f28-31e8-48d5-88bf-63f68db3352a');


--
-- TOC entry 3622 (class 0 OID 16906)
-- Dependencies: 227
-- Data for Name: anamnesi_familiare; Type: TABLE DATA; Schema: anamnesi; Owner: postgres
--

INSERT INTO anamnesi.anamnesi_familiare VALUES ('504f79ca-3d6e-41be-aed6-d800d3d0aedc', 'alopecia', 'vive in pianura Padana', '2026-09-20 13:46:22.847121+00', '2026-09-20 13:46:36.471336+00', '99294f28-31e8-48d5-88bf-63f68db3352a');


--
-- TOC entry 3617 (class 0 OID 16851)
-- Dependencies: 222
-- Data for Name: anamnesi_patologica_attuale; Type: TABLE DATA; Schema: anamnesi; Owner: postgres
--

INSERT INTO anamnesi.anamnesi_patologica_attuale VALUES ('pertosse', '2026-09-13', 'una settimana', 'nessuno', 'nessuno', 'nessuno', '2026-09-20 08:35:39.267404+00', '2026-09-20 08:03:24.206103+00', '99294f28-31e8-48d5-88bf-63f68db3352a');
INSERT INTO anamnesi.anamnesi_patologica_attuale VALUES ('nevralgia', '2026-09-13', 'una settimana', 'nessuno', 'movimenti della schiena', 'dolore gamba dx', '2026-09-20 09:09:24.541511+00', '2026-09-20 09:09:24.541511+00', 'bb8b42c1-59ed-48f8-ac80-86a7aec9d453');


--
-- TOC entry 3618 (class 0 OID 16862)
-- Dependencies: 223
-- Data for Name: anamnesi_patologica_remota; Type: TABLE DATA; Schema: anamnesi; Owner: postgres
--

INSERT INTO anamnesi.anamnesi_patologica_remota VALUES ('nessuno', 'nessuno', 'nessuno', 'nessuno', '2026-09-20 09:59:13.210939+00', '2026-09-20 09:59:13.210939+00', '99294f28-31e8-48d5-88bf-63f68db3352a');


--
-- TOC entry 3619 (class 0 OID 16873)
-- Dependencies: 224
-- Data for Name: farmaci_allergie; Type: TABLE DATA; Schema: anamnesi; Owner: postgres
--



--
-- TOC entry 3620 (class 0 OID 16884)
-- Dependencies: 225
-- Data for Name: stato_fratelli; Type: TABLE DATA; Schema: anamnesi; Owner: postgres
--



--
-- TOC entry 3621 (class 0 OID 16895)
-- Dependencies: 226
-- Data for Name: stato_genitori; Type: TABLE DATA; Schema: anamnesi; Owner: postgres
--



--
-- TOC entry 3626 (class 0 OID 32934)
-- Dependencies: 231
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: postgres
--



--
-- TOC entry 3627 (class 0 OID 73744)
-- Dependencies: 232
-- Data for Name: user_roles; Type: TABLE DATA; Schema: auth; Owner: postgres
--



--
-- TOC entry 3625 (class 0 OID 32901)
-- Dependencies: 230
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: postgres
--

INSERT INTO auth.users VALUES ('46df7f9e-c6c3-4841-a038-a97c4a2c590b', 'mario', '$2a$10$.c75s3M4WMmQBwWhtav8Buy2jSdb4yz1Ic7SMffwZ1WCHSHFAToHa', true, '2026-04-11 14:18:00.944187+00', NULL);


--
-- TOC entry 3623 (class 0 OID 16927)
-- Dependencies: 228
-- Data for Name: appuntamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.appuntamento VALUES ('0da0ffa1-42ed-4f6a-8157-3c65b33ce789', '36d979dd-a9f8-4249-9334-e8ceab9db7fd', 'bb8b42c1-59ed-48f8-ac80-86a7aec9d453', 'f7c7bb21-e7ed-4b64-a7b4-08e96262a12e', '2026-10-10', '2026-09-19 15:49:57.675352+00', '2026-09-19 15:50:05.077299+00');


--
-- TOC entry 3613 (class 0 OID 16436)
-- Dependencies: 218
-- Data for Name: contatti; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.contatti VALUES ('0521 778912', 'luca.bianchi@example.com', '3479123456', '2026-09-06 08:38:32.894524+00', '2026-09-06 08:38:33.491309+00', 'bb8b42c1-59ed-48f8-ac80-86a7aec9d453');
INSERT INTO public.contatti VALUES ('3524565897', 'email@example.com', '3524565897', '2026-09-06 09:53:43.649224+00', '2026-09-20 07:34:01.393491+00', '99294f28-31e8-48d5-88bf-63f68db3352a');
INSERT INTO public.contatti VALUES (NULL, NULL, NULL, '2026-09-20 09:31:39.900405+00', NULL, '0277ce6e-5b9a-4fd2-9291-d5cb132cff34');


--
-- TOC entry 3615 (class 0 OID 16826)
-- Dependencies: 220
-- Data for Name: medico; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.medico VALUES ('18e11b99-c83c-4c7d-b736-8c3859b820d2', 'Mario', 'Rossi', 'Medicina Generale', '2026-05-10 14:17:10.891463+00', '2026-05-10 14:17:10.891463+00');
INSERT INTO public.medico VALUES ('49594b63-49b3-44b5-ba3d-8ae2445cfd66', 'Laura', 'Bianchi', 'Pediatria', '2026-05-10 14:17:10.891463+00', '2026-05-10 14:17:10.891463+00');
INSERT INTO public.medico VALUES ('323bf5c8-1f22-4818-a15b-c32c5f443644', 'Paolo', 'Verdi', 'Cardiologia', '2026-05-10 14:17:10.891463+00', '2026-05-10 14:17:10.891463+00');
INSERT INTO public.medico VALUES ('36d979dd-a9f8-4249-9334-e8ceab9db7fd', 'Anna', 'Gallo', 'Dermatologia', '2026-05-10 14:17:10.891463+00', '2026-05-10 14:17:10.891463+00');
INSERT INTO public.medico VALUES ('fa4e4cfa-a9d9-4c58-b8a2-9713963f0203', 'Luca', 'Ferrari', 'Ortopedia', '2026-05-10 14:17:10.891463+00', '2026-05-10 14:17:10.891463+00');
INSERT INTO public.medico VALUES ('adf6d294-13cd-4f76-b91f-1956b38d0197', 'Sara', 'Russo', 'Neurologia', '2026-05-10 14:17:10.891463+00', '2026-05-10 14:17:10.891463+00');
INSERT INTO public.medico VALUES ('66c1afb2-86a2-4c7a-a836-d0b788c40c9d', 'Giulia', 'Moretti', 'Ginecologia', '2026-05-10 14:17:10.891463+00', '2026-05-10 14:17:10.891463+00');
INSERT INTO public.medico VALUES ('10b08159-c602-4bbf-befc-601e342a0df6', 'Marco', 'Bruni', 'Psichiatria', '2026-05-10 14:17:10.891463+00', '2026-05-10 14:17:10.891463+00');
INSERT INTO public.medico VALUES ('4d9562a9-bd55-4197-bc0b-a60e35497cf6', 'Elena', 'Neri', 'Endocrinologia', '2026-05-10 14:17:10.891463+00', '2026-05-10 14:17:10.891463+00');
INSERT INTO public.medico VALUES ('9f279547-e0f5-40a9-bb82-90f732faad7b', 'Francesco', 'Conti', 'Oculistica', '2026-05-10 14:17:10.891463+00', '2026-05-10 14:17:10.891463+00');


--
-- TOC entry 3612 (class 0 OID 16427)
-- Dependencies: 217
-- Data for Name: paziente; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.paziente VALUES ('99294f28-31e8-48d5-88bf-63f68db3352a', 'Giulia', 'Ferri', 'FRRGLL90S62H501T', '1990-11-22', '2026-09-06 09:53:43.649224+00', '2026-09-06 09:53:43.649224+00');
INSERT INTO public.paziente VALUES ('bb8b42c1-59ed-48f8-ac80-86a7aec9d453', 'Luca', 'Bianchi', 'BNCLCU85C12H501Z', '1985-03-12', '2026-09-06 08:38:32.894524+00', '2026-09-07 07:21:21.918409+00');
INSERT INTO public.paziente VALUES ('0277ce6e-5b9a-4fd2-9291-d5cb132cff34', 'Andrea', 'Fucsia', 'ANASKY68T01A123K', '2002-12-15', '2026-09-20 09:31:39.900405+00', '2026-09-20 09:31:39.900405+00');


--
-- TOC entry 3614 (class 0 OID 16452)
-- Dependencies: 219
-- Data for Name: residenza; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.residenza VALUES ('Via Verdi', '14', 'Parma', '43121', '2026-09-06 08:38:32.894524+00', '2026-09-06 08:38:33.158845+00', 'bb8b42c1-59ed-48f8-ac80-86a7aec9d453');
INSERT INTO public.residenza VALUES ('Via Cavour', '3', 'Reggio Emilia', '42121', '2026-09-06 09:53:43.649224+00', '2026-09-06 09:53:44.01438+00', '99294f28-31e8-48d5-88bf-63f68db3352a');
INSERT INTO public.residenza VALUES ('Strada delle Marie', '15', '43100', 'Parma', '2026-09-20 09:31:39.900405+00', '2026-09-20 09:31:39.917883+00', '0277ce6e-5b9a-4fd2-9291-d5cb132cff34');


--
-- TOC entry 3624 (class 0 OID 16947)
-- Dependencies: 229
-- Data for Name: slot; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.slot VALUES ('88b8d8d3-d275-44e9-b5b3-81b1b5368b80', '09:00', '09:30', '2026-05-10 14:07:47.970094+00', '2026-05-10 14:07:47.970094+00');
INSERT INTO public.slot VALUES ('f7c7bb21-e7ed-4b64-a7b4-08e96262a12e', '09:30', '10:00', '2026-05-10 14:07:47.970094+00', '2026-05-10 14:07:47.970094+00');
INSERT INTO public.slot VALUES ('b01be8cb-cb6d-4a48-b26b-7851a100dc72', '10:00', '10:30', '2026-05-10 14:07:47.970094+00', '2026-05-10 14:07:47.970094+00');
INSERT INTO public.slot VALUES ('7df1634a-1a61-4926-bda9-504dd06586af', '10:30', '11:00', '2026-05-10 14:07:47.970094+00', '2026-05-10 14:07:47.970094+00');
INSERT INTO public.slot VALUES ('d2a97450-ced0-4f86-93cc-ad83326277e9', '11:00', '11:30', '2026-05-10 14:07:47.970094+00', '2026-05-10 14:07:47.970094+00');
INSERT INTO public.slot VALUES ('8d269dc3-6e12-4014-8479-2f7d00d969e2', '11:30', '12:00', '2026-05-10 14:07:47.970094+00', '2026-05-10 14:07:47.970094+00');
INSERT INTO public.slot VALUES ('994e5c11-6ad7-4a3d-aef1-f54d54a16e2c', '12:00', '12:30', '2026-05-10 14:07:47.970094+00', '2026-05-10 14:07:47.970094+00');
INSERT INTO public.slot VALUES ('2e77e41c-93f2-4f48-8d5c-28e616f6fc1f', '12:30', '13:00', '2026-05-10 14:07:47.970094+00', '2026-05-10 14:07:47.970094+00');
INSERT INTO public.slot VALUES ('5bf7d089-974a-4ed0-a35f-2854630a72a8', '13:00', '13:30', '2026-05-10 14:07:47.970094+00', '2026-05-10 14:07:47.970094+00');
INSERT INTO public.slot VALUES ('0906f900-1f5b-4599-85e3-e772a9cbb966', '13:30', '14:00', '2026-05-10 14:07:47.970094+00', '2026-05-10 14:07:47.970094+00');
INSERT INTO public.slot VALUES ('4e915311-4154-4e76-bbdc-c1a49ea3acaf', '14:00', '14:30', '2026-05-10 14:07:47.970094+00', '2026-05-10 14:07:47.970094+00');
INSERT INTO public.slot VALUES ('d4ef5685-388d-475f-b4bb-e07c17719bff', '14:30', '15:00', '2026-05-10 14:07:47.970094+00', '2026-05-10 14:07:47.970094+00');
INSERT INTO public.slot VALUES ('af9b940c-d761-46cf-a2de-66c2f4ca72e5', '15:00', '15:30', '2026-05-10 14:07:47.970094+00', '2026-05-10 14:07:47.970094+00');
INSERT INTO public.slot VALUES ('a34b2278-571d-4629-a550-3cb5d4eb3b0b', '15:30', '16:00', '2026-05-10 14:07:47.970094+00', '2026-05-10 14:07:47.970094+00');
INSERT INTO public.slot VALUES ('a39876b6-7d6b-4d1a-85ae-abeea997a355', '16:00', '16:30', '2026-05-10 14:07:47.970094+00', '2026-05-10 14:07:47.970094+00');
INSERT INTO public.slot VALUES ('6703f859-1455-429f-bf3b-8424753b75d9', '16:30', '17:00', '2026-05-10 14:07:47.970094+00', '2026-05-10 14:07:47.970094+00');


--
-- TOC entry 3401 (class 2606 OID 24655)
-- Name: analisi_psico_sociale analisi_psico_sociale_pk; Type: CONSTRAINT; Schema: anamnesi; Owner: postgres
--

ALTER TABLE ONLY anamnesi.analisi_psico_sociale
    ADD CONSTRAINT analisi_psico_sociale_pk PRIMARY KEY (id_paziente);


--
-- TOC entry 3413 (class 2606 OID 16914)
-- Name: anamnesi_familiare anamnesi_familiare_pk; Type: CONSTRAINT; Schema: anamnesi; Owner: postgres
--

ALTER TABLE ONLY anamnesi.anamnesi_familiare
    ADD CONSTRAINT anamnesi_familiare_pk PRIMARY KEY (id);


--
-- TOC entry 3403 (class 2606 OID 24657)
-- Name: anamnesi_patologica_attuale anamnesi_patologica_attuale_pk; Type: CONSTRAINT; Schema: anamnesi; Owner: postgres
--

ALTER TABLE ONLY anamnesi.anamnesi_patologica_attuale
    ADD CONSTRAINT anamnesi_patologica_attuale_pk PRIMARY KEY (id_paziente);


--
-- TOC entry 3405 (class 2606 OID 24664)
-- Name: anamnesi_patologica_remota anamnesi_patologica_remota_pk; Type: CONSTRAINT; Schema: anamnesi; Owner: postgres
--

ALTER TABLE ONLY anamnesi.anamnesi_patologica_remota
    ADD CONSTRAINT anamnesi_patologica_remota_pk PRIMARY KEY (id_paziente);


--
-- TOC entry 3407 (class 2606 OID 24676)
-- Name: farmaci_allergie farmaci_allergie_pk; Type: CONSTRAINT; Schema: anamnesi; Owner: postgres
--

ALTER TABLE ONLY anamnesi.farmaci_allergie
    ADD CONSTRAINT farmaci_allergie_pk PRIMARY KEY (id_paziente);


--
-- TOC entry 3409 (class 2606 OID 16892)
-- Name: stato_fratelli stato_fratelli_pk; Type: CONSTRAINT; Schema: anamnesi; Owner: postgres
--

ALTER TABLE ONLY anamnesi.stato_fratelli
    ADD CONSTRAINT stato_fratelli_pk PRIMARY KEY (id);


--
-- TOC entry 3411 (class 2606 OID 16903)
-- Name: stato_genitori stato_genitori_pk; Type: CONSTRAINT; Schema: anamnesi; Owner: postgres
--

ALTER TABLE ONLY anamnesi.stato_genitori
    ADD CONSTRAINT stato_genitori_pk PRIMARY KEY (id);


--
-- TOC entry 3423 (class 2606 OID 32942)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 3425 (class 2606 OID 73748)
-- Name: user_roles user_roles_pk; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.user_roles
    ADD CONSTRAINT user_roles_pk PRIMARY KEY (user_id);


--
-- TOC entry 3419 (class 2606 OID 32908)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3421 (class 2606 OID 41061)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 3415 (class 2606 OID 16935)
-- Name: appuntamento appuntamento_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appuntamento
    ADD CONSTRAINT appuntamento_pk PRIMARY KEY (id);


--
-- TOC entry 3395 (class 2606 OID 24651)
-- Name: contatti contatti_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contatti
    ADD CONSTRAINT contatti_pk PRIMARY KEY (id_paziente);


--
-- TOC entry 3399 (class 2606 OID 16834)
-- Name: medico medico_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medico
    ADD CONSTRAINT medico_pk PRIMARY KEY (id);


--
-- TOC entry 3393 (class 2606 OID 16432)
-- Name: paziente paziente_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paziente
    ADD CONSTRAINT paziente_pk PRIMARY KEY (id);


--
-- TOC entry 3397 (class 2606 OID 24653)
-- Name: residenza residenza_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.residenza
    ADD CONSTRAINT residenza_pk PRIMARY KEY (id_paziente);


--
-- TOC entry 3417 (class 2606 OID 16953)
-- Name: slot slot_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.slot
    ADD CONSTRAINT slot_pk PRIMARY KEY (id);


--
-- TOC entry 3449 (class 2620 OID 16849)
-- Name: analisi_psico_sociale update_after_create; Type: TRIGGER; Schema: anamnesi; Owner: postgres
--

CREATE TRIGGER update_after_create AFTER INSERT ON anamnesi.analisi_psico_sociale FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3461 (class 2620 OID 16925)
-- Name: anamnesi_familiare update_after_create; Type: TRIGGER; Schema: anamnesi; Owner: postgres
--

CREATE TRIGGER update_after_create AFTER INSERT ON anamnesi.anamnesi_familiare FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3451 (class 2620 OID 16860)
-- Name: anamnesi_patologica_attuale update_after_create; Type: TRIGGER; Schema: anamnesi; Owner: postgres
--

CREATE TRIGGER update_after_create AFTER INSERT ON anamnesi.anamnesi_patologica_attuale FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3453 (class 2620 OID 16871)
-- Name: anamnesi_patologica_remota update_after_create; Type: TRIGGER; Schema: anamnesi; Owner: postgres
--

CREATE TRIGGER update_after_create AFTER INSERT ON anamnesi.anamnesi_patologica_remota FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3455 (class 2620 OID 16882)
-- Name: farmaci_allergie update_after_create; Type: TRIGGER; Schema: anamnesi; Owner: postgres
--

CREATE TRIGGER update_after_create AFTER INSERT ON anamnesi.farmaci_allergie FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3457 (class 2620 OID 16893)
-- Name: stato_fratelli update_after_create; Type: TRIGGER; Schema: anamnesi; Owner: postgres
--

CREATE TRIGGER update_after_create AFTER INSERT ON anamnesi.stato_fratelli FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3459 (class 2620 OID 16904)
-- Name: stato_genitori update_after_create; Type: TRIGGER; Schema: anamnesi; Owner: postgres
--

CREATE TRIGGER update_after_create AFTER INSERT ON anamnesi.stato_genitori FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3450 (class 2620 OID 16850)
-- Name: analisi_psico_sociale update_before_aggiornamento; Type: TRIGGER; Schema: anamnesi; Owner: postgres
--

CREATE TRIGGER update_before_aggiornamento AFTER INSERT ON anamnesi.analisi_psico_sociale FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3462 (class 2620 OID 16926)
-- Name: anamnesi_familiare update_before_aggiornamento; Type: TRIGGER; Schema: anamnesi; Owner: postgres
--

CREATE TRIGGER update_before_aggiornamento AFTER INSERT ON anamnesi.anamnesi_familiare FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3452 (class 2620 OID 16861)
-- Name: anamnesi_patologica_attuale update_before_aggiornamento; Type: TRIGGER; Schema: anamnesi; Owner: postgres
--

CREATE TRIGGER update_before_aggiornamento AFTER INSERT ON anamnesi.anamnesi_patologica_attuale FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3454 (class 2620 OID 16872)
-- Name: anamnesi_patologica_remota update_before_aggiornamento; Type: TRIGGER; Schema: anamnesi; Owner: postgres
--

CREATE TRIGGER update_before_aggiornamento AFTER INSERT ON anamnesi.anamnesi_patologica_remota FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3456 (class 2620 OID 16883)
-- Name: farmaci_allergie update_before_aggiornamento; Type: TRIGGER; Schema: anamnesi; Owner: postgres
--

CREATE TRIGGER update_before_aggiornamento AFTER INSERT ON anamnesi.farmaci_allergie FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3458 (class 2620 OID 16894)
-- Name: stato_fratelli update_before_aggiornamento; Type: TRIGGER; Schema: anamnesi; Owner: postgres
--

CREATE TRIGGER update_before_aggiornamento AFTER INSERT ON anamnesi.stato_fratelli FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3460 (class 2620 OID 16905)
-- Name: stato_genitori update_before_aggiornamento; Type: TRIGGER; Schema: anamnesi; Owner: postgres
--

CREATE TRIGGER update_before_aggiornamento AFTER INSERT ON anamnesi.stato_genitori FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3467 (class 2620 OID 49158)
-- Name: users update_before_nuovo; Type: TRIGGER; Schema: auth; Owner: postgres
--

CREATE TRIGGER update_before_nuovo BEFORE INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3468 (class 2620 OID 49157)
-- Name: users updatede_after_update; Type: TRIGGER; Schema: auth; Owner: postgres
--

CREATE TRIGGER updatede_after_update AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3443 (class 2620 OID 16445)
-- Name: contatti aggiorna_update_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER aggiorna_update_at AFTER INSERT ON public.contatti FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3444 (class 2620 OID 16446)
-- Name: contatti imposta_updated_at_modifica; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER imposta_updated_at_modifica BEFORE UPDATE ON public.contatti FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3439 (class 2620 OID 16451)
-- Name: paziente trg_crea_contatti; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_crea_contatti AFTER INSERT ON public.paziente FOR EACH ROW EXECUTE FUNCTION public.crea_record_paziente('contatti');


--
-- TOC entry 3440 (class 2620 OID 16462)
-- Name: paziente trg_crea_residenza; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_crea_residenza AFTER INSERT ON public.paziente FOR EACH ROW EXECUTE FUNCTION public.crea_record_paziente('residenza');


--
-- TOC entry 3441 (class 2620 OID 57348)
-- Name: paziente update_after_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_after_insert BEFORE INSERT ON public.paziente FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3463 (class 2620 OID 65542)
-- Name: appuntamento update_after_nuovo; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_after_nuovo BEFORE INSERT ON public.appuntamento FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3465 (class 2620 OID 65541)
-- Name: slot update_after_nuovo; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_after_nuovo BEFORE INSERT ON public.slot FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3442 (class 2620 OID 16449)
-- Name: paziente update_before_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_before_update AFTER INSERT ON public.paziente FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3445 (class 2620 OID 16461)
-- Name: residenza update_before_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_before_update AFTER INSERT ON public.residenza FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3464 (class 2620 OID 16937)
-- Name: appuntamento updated_before_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER updated_before_update BEFORE UPDATE ON public.appuntamento FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3447 (class 2620 OID 16837)
-- Name: medico updated_before_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER updated_before_update BEFORE UPDATE ON public.medico FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3466 (class 2620 OID 16955)
-- Name: slot updated_before_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER updated_before_update BEFORE UPDATE ON public.slot FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3448 (class 2620 OID 65540)
-- Name: medico updated_nuovo; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER updated_nuovo BEFORE INSERT ON public.medico FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3446 (class 2620 OID 16460)
-- Name: residenza updated_nuovo; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER updated_nuovo AFTER INSERT ON public.residenza FOR EACH ROW EXECUTE FUNCTION public.imposta_timestamp_update();


--
-- TOC entry 3428 (class 2606 OID 24580)
-- Name: analisi_psico_sociale analisi_psico_sociale_paziente_fk; Type: FK CONSTRAINT; Schema: anamnesi; Owner: postgres
--

ALTER TABLE ONLY anamnesi.analisi_psico_sociale
    ADD CONSTRAINT analisi_psico_sociale_paziente_fk FOREIGN KEY (id_paziente) REFERENCES public.paziente(id) ON DELETE CASCADE;


--
-- TOC entry 3429 (class 2606 OID 24658)
-- Name: anamnesi_patologica_attuale anamnesi_patologica_attuale_paziente_fk; Type: FK CONSTRAINT; Schema: anamnesi; Owner: postgres
--

ALTER TABLE ONLY anamnesi.anamnesi_patologica_attuale
    ADD CONSTRAINT anamnesi_patologica_attuale_paziente_fk FOREIGN KEY (id_paziente) REFERENCES public.paziente(id) ON DELETE CASCADE;


--
-- TOC entry 3430 (class 2606 OID 24670)
-- Name: anamnesi_patologica_remota anamnesi_patologica_remota_paziente_fk; Type: FK CONSTRAINT; Schema: anamnesi; Owner: postgres
--

ALTER TABLE ONLY anamnesi.anamnesi_patologica_remota
    ADD CONSTRAINT anamnesi_patologica_remota_paziente_fk FOREIGN KEY (id_paziente) REFERENCES public.paziente(id) ON DELETE CASCADE;


--
-- TOC entry 3431 (class 2606 OID 24605)
-- Name: farmaci_allergie farmaci_allergie_paziente_fk; Type: FK CONSTRAINT; Schema: anamnesi; Owner: postgres
--

ALTER TABLE ONLY anamnesi.farmaci_allergie
    ADD CONSTRAINT farmaci_allergie_paziente_fk FOREIGN KEY (id_paziente) REFERENCES public.paziente(id) ON DELETE CASCADE;


--
-- TOC entry 3434 (class 2606 OID 41068)
-- Name: anamnesi_familiare fk6d66t8r6ckhj88eogvagb0xdx; Type: FK CONSTRAINT; Schema: anamnesi; Owner: postgres
--

ALTER TABLE ONLY anamnesi.anamnesi_familiare
    ADD CONSTRAINT fk6d66t8r6ckhj88eogvagb0xdx FOREIGN KEY (id_paziente) REFERENCES public.paziente(id);


--
-- TOC entry 3432 (class 2606 OID 24610)
-- Name: stato_fratelli stato_fratelli_anamnesi_familiare_fk; Type: FK CONSTRAINT; Schema: anamnesi; Owner: postgres
--

ALTER TABLE ONLY anamnesi.stato_fratelli
    ADD CONSTRAINT stato_fratelli_anamnesi_familiare_fk FOREIGN KEY (id_anamnesi_familiare) REFERENCES anamnesi.anamnesi_familiare(id) ON DELETE CASCADE;


--
-- TOC entry 3433 (class 2606 OID 24615)
-- Name: stato_genitori stato_genitori_anamnesi_familiare_fk; Type: FK CONSTRAINT; Schema: anamnesi; Owner: postgres
--

ALTER TABLE ONLY anamnesi.stato_genitori
    ADD CONSTRAINT stato_genitori_anamnesi_familiare_fk FOREIGN KEY (id_anamnesi_familiare) REFERENCES anamnesi.anamnesi_familiare(id) ON DELETE CASCADE;


--
-- TOC entry 3438 (class 2606 OID 32943)
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 3435 (class 2606 OID 24630)
-- Name: appuntamento appuntamento_medico_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appuntamento
    ADD CONSTRAINT appuntamento_medico_fk FOREIGN KEY (id_medico) REFERENCES public.medico(id) ON DELETE CASCADE;


--
-- TOC entry 3436 (class 2606 OID 24645)
-- Name: appuntamento appuntamento_paziente_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appuntamento
    ADD CONSTRAINT appuntamento_paziente_fk FOREIGN KEY (id_paziente) REFERENCES public.paziente(id) ON DELETE CASCADE;


--
-- TOC entry 3437 (class 2606 OID 24640)
-- Name: appuntamento appuntamento_slot_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appuntamento
    ADD CONSTRAINT appuntamento_slot_fk FOREIGN KEY (id_slot) REFERENCES public.slot(id) ON DELETE CASCADE;


--
-- TOC entry 3426 (class 2606 OID 24625)
-- Name: contatti contatti_paziente_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contatti
    ADD CONSTRAINT contatti_paziente_fk FOREIGN KEY (id_paziente) REFERENCES public.paziente(id) ON DELETE CASCADE;


--
-- TOC entry 3427 (class 2606 OID 24620)
-- Name: residenza residenza_paziente_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.residenza
    ADD CONSTRAINT residenza_paziente_fk FOREIGN KEY (id_paziente) REFERENCES public.paziente(id) ON DELETE CASCADE;


-- Completed on 2026-09-21 10:00:07

--
-- PostgreSQL database dump complete
--

