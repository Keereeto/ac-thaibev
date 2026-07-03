--
-- PostgreSQL database dump
--

\restrict Zu7HEuQn5MarXJgeUoTL87HyditBWz3qJ2uJzuGuCPzVRRFAIIh1IohanT7h2Cx

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

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
-- Name: ac-app; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA "ac-app";


ALTER SCHEMA "ac-app" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: products; Type: TABLE; Schema: ac-app; Owner: postgres
--

CREATE TABLE "ac-app".products (
    id integer NOT NULL,
    product_id character varying(30) NOT NULL,
    CONSTRAINT products_product_id_check CHECK (((product_id)::text ~ '^[A-Z0-9]{30}$'::text))
);


ALTER TABLE "ac-app".products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: ac-app; Owner: postgres
--

ALTER TABLE "ac-app".products ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "ac-app".products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: ac-app; Owner: postgres
--

ALTER TABLE ONLY "ac-app".products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_product_id_key; Type: CONSTRAINT; Schema: ac-app; Owner: postgres
--

ALTER TABLE ONLY "ac-app".products
    ADD CONSTRAINT products_product_id_key UNIQUE (product_id);


--
-- PostgreSQL database dump complete
--

\unrestrict Zu7HEuQn5MarXJgeUoTL87HyditBWz3qJ2uJzuGuCPzVRRFAIIh1IohanT7h2Cx

