-- Adminer 4.8.1 PostgreSQL 17.4 (Ubuntu 17.4-1.pgdg20.04+2) dump

DROP TABLE IF EXISTS "categories";
DROP SEQUENCE IF EXISTS categories_id_seq;
CREATE SEQUENCE categories_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."categories" (
    "id" integer DEFAULT nextval('categories_id_seq') NOT NULL,
    "name" text NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "display_status" boolean DEFAULT true NOT NULL,
    CONSTRAINT "categories_name_key" UNIQUE ("name"),
    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "colleges";
DROP SEQUENCE IF EXISTS colleges_id_seq;
CREATE SEQUENCE colleges_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."colleges" (
    "id" integer DEFAULT nextval('colleges_id_seq') NOT NULL,
    "name" text NOT NULL,
    "course_id" integer NOT NULL,
    "state_id" integer NOT NULL,
    "college_type" text NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "display_status" boolean DEFAULT true NOT NULL,
    CONSTRAINT "colleges_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "idx_colleges_course_state" ON "public"."colleges" USING btree ("course_id", "state_id");


DROP TABLE IF EXISTS "courses";
DROP SEQUENCE IF EXISTS courses_id_seq;
CREATE SEQUENCE courses_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."courses" (
    "id" integer DEFAULT nextval('courses_id_seq') NOT NULL,
    "name" text NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "display_status" boolean DEFAULT true NOT NULL,
    CONSTRAINT "courses_name_key" UNIQUE ("name"),
    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


-- Added for Quotas Master feature
DROP TABLE IF EXISTS "quotas";
DROP SEQUENCE IF EXISTS quotas_id_seq;
CREATE SEQUENCE quotas_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."quotas" (
    "id" integer DEFAULT nextval('quotas_id_seq') NOT NULL,
    "name" text NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "display_status" boolean DEFAULT true NOT NULL,
    CONSTRAINT "quotas_name_key" UNIQUE ("name"),
    CONSTRAINT "quotas_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "cutoffs";
DROP SEQUENCE IF EXISTS cutoffs_id_seq;
CREATE SEQUENCE cutoffs_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."cutoffs" (
    "id" integer DEFAULT nextval('cutoffs_id_seq') NOT NULL,
    "college_id" integer NOT NULL,
    "year" integer NOT NULL,
    "category_id" integer NOT NULL,
    "quota_id" integer NOT NULL, -- Changed from quota text
    "closing_rank" integer,
    "opening_rank" integer,
    CONSTRAINT "cutoffs_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "idx_cutoffs_lookup" ON "public"."cutoffs" USING btree ("college_id", "year", "category_id");


DROP TABLE IF EXISTS "expert_requests";
DROP SEQUENCE IF EXISTS expert_requests_id_seq;
CREATE SEQUENCE expert_requests_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."expert_requests" (
    "id" integer DEFAULT nextval('expert_requests_id_seq') NOT NULL,
    "email" text NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT "expert_requests_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "mark_rank_bands";
DROP SEQUENCE IF EXISTS mark_rank_bands_id_seq;
CREATE SEQUENCE mark_rank_bands_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."mark_rank_bands" (
    "id" integer DEFAULT nextval('mark_rank_bands_id_seq') NOT NULL,
    "year" integer NOT NULL,
    "mark_low" integer NOT NULL,
    "mark_high" integer NOT NULL,
    "rank_low" integer NOT NULL,
    "rank_high" integer NOT NULL,
    CONSTRAINT "mark_rank_bands_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "idx_mark_rank_bands_year_marks" ON "public"."mark_rank_bands" USING btree ("year", "mark_low", "mark_high");


DROP TABLE IF EXISTS "states";
DROP SEQUENCE IF EXISTS states_id_seq;
CREATE SEQUENCE states_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."states" (
    "id" integer DEFAULT nextval('states_id_seq') NOT NULL,
    "name" text NOT NULL,
    "is_ut" boolean DEFAULT false NOT NULL,
    "is_all_india" boolean DEFAULT false NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "display_status" boolean DEFAULT true NOT NULL,
    CONSTRAINT "states_name_key" UNIQUE ("name"),
    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "users";
DROP SEQUENCE IF EXISTS users_id_seq;
CREATE SEQUENCE users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1;

CREATE TABLE "public"."users" (
    "id" bigint DEFAULT nextval('users_id_seq') NOT NULL,
    "user_type" character varying(10) DEFAULT 'student' NOT NULL,
    "fullname" character varying(255) NOT NULL,
    "email" character varying(320) NOT NULL,
    "password" text NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "created_by" bigint,
    "updated_at" timestamptz,
    "updated_by" bigint,
    CONSTRAINT "users_email_key" UNIQUE ("email"),
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


ALTER TABLE ONLY "public"."colleges" ADD CONSTRAINT "colleges_course_id_fkey" FOREIGN KEY (course_id) REFERENCES courses(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."colleges" ADD CONSTRAINT "colleges_state_id_fkey" FOREIGN KEY (state_id) REFERENCES states(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."cutoffs" ADD CONSTRAINT "cutoffs_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."cutoffs" ADD CONSTRAINT "cutoffs_college_id_fkey" FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."cutoffs" ADD CONSTRAINT "cutoffs_quota_id_fkey" FOREIGN KEY (quota_id) REFERENCES quotas(id) ON DELETE CASCADE NOT DEFERRABLE;

-- Counselling Calendar Tables
CREATE TABLE "public"."authorities" (
    "id" SERIAL PRIMARY KEY,
    "name" text NOT NULL,
    "quota_id" integer NOT NULL,
    "state_id" integer,
    "logo_url" text,
    "active" boolean DEFAULT true NOT NULL,
    FOREIGN KEY ("quota_id") REFERENCES "public"."quotas"("id") ON DELETE RESTRICT,
    FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE SET NULL
);

CREATE TABLE "public"."counselling_rounds" (
    "id" SERIAL PRIMARY KEY,
    "authority_id" integer NOT NULL,
    "year" integer NOT NULL,
    "round_name" text NOT NULL,
    "round_order" integer NOT NULL,
    "start_date" date,
    "end_date" date,
    FOREIGN KEY ("authority_id") REFERENCES "public"."authorities"("id") ON DELETE CASCADE
);
CREATE INDEX "idx_rounds_authority_year" ON "public"."counselling_rounds" USING btree ("authority_id", "year", "round_order");

CREATE TABLE "public"."counselling_updates" (
    "id" SERIAL PRIMARY KEY,
    "authority_id" integer NOT NULL,
    "title" text NOT NULL,
    "detail" text,
    "source_url" text,
    "published_at" timestamptz DEFAULT now() NOT NULL,
    FOREIGN KEY ("authority_id") REFERENCES "public"."authorities"("id") ON DELETE CASCADE
);
CREATE INDEX "idx_updates_authority_date" ON "public"."counselling_updates" USING btree ("authority_id", "published_at" DESC);