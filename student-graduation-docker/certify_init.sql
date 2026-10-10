CREATE DATABASE inji_certify
  ENCODING = 'UTF8'
  LC_COLLATE = 'en_US.UTF-8'
  LC_CTYPE = 'en_US.UTF-8'
  TABLESPACE = pg_default
  OWNER = postgres
  TEMPLATE  = template0;

COMMENT ON DATABASE inji_certify IS 'certify related data is stored in this database';

\c inji_certify postgres

DROP SCHEMA IF EXISTS certify CASCADE;
CREATE SCHEMA certify;
ALTER SCHEMA certify OWNER TO postgres;
ALTER DATABASE inji_certify SET search_path TO certify,pg_catalog,public;

--- keymanager specific DB changes ---
CREATE TABLE certify.key_alias(
                                  id character varying(36) NOT NULL,
                                  app_id character varying(36) NOT NULL,
                                  ref_id character varying(128),
                                  key_gen_dtimes timestamp,
                                  key_expire_dtimes timestamp,
                                  status_code character varying(36),
                                  lang_code character varying(3),
                                  cr_by character varying(256) NOT NULL,
                                  cr_dtimes timestamp NOT NULL,
                                  upd_by character varying(256),
                                  upd_dtimes timestamp,
                                  is_deleted boolean DEFAULT FALSE,
                                  del_dtimes timestamp,
                                  cert_thumbprint character varying(100),
                                  uni_ident character varying(50),
                                  CONSTRAINT pk_keymals_id PRIMARY KEY (id),
                                  CONSTRAINT uni_ident_const UNIQUE (uni_ident)
);

CREATE TABLE certify.key_policy_def(
                                       app_id character varying(36) NOT NULL,
                                       key_validity_duration smallint,
                                       is_active boolean NOT NULL,
                                       pre_expire_days smallint,
                                       access_allowed character varying(1024),
                                       cr_by character varying(256) NOT NULL,
                                       cr_dtimes timestamp NOT NULL,
                                       upd_by character varying(256),
                                       upd_dtimes timestamp,
                                       is_deleted boolean DEFAULT FALSE,
                                       del_dtimes timestamp,
                                       CONSTRAINT pk_keypdef_id PRIMARY KEY (app_id)
);

CREATE TABLE certify.key_store(
                                  id character varying(36) NOT NULL,
                                  master_key character varying(36) NOT NULL,
                                  private_key character varying(2500) NOT NULL,
                                  certificate_data character varying NOT NULL,
                                  cr_by character varying(256) NOT NULL,
                                  cr_dtimes timestamp NOT NULL,
                                  upd_by character varying(256),
                                  upd_dtimes timestamp,
                                  is_deleted boolean DEFAULT FALSE,
                                  del_dtimes timestamp,
                                  CONSTRAINT pk_keystr_id PRIMARY KEY (id)
);

CREATE TABLE certify.ca_cert_store(
    cert_id character varying(36) NOT NULL,
    cert_subject character varying(500) NOT NULL,
    cert_issuer character varying(500) NOT NULL,
    issuer_id character varying(36) NOT NULL,
    cert_not_before timestamp,
    cert_not_after timestamp,
    crl_uri character varying(120),
    cert_data character varying,
    cert_thumbprint character varying(100),
    cert_serial_no character varying(50),
    partner_domain character varying(36),
    cr_by character varying(256),
    cr_dtimes timestamp,
    upd_by character varying(256),
    upd_dtimes timestamp,
    is_deleted boolean DEFAULT FALSE,
    del_dtimes timestamp,
    ca_cert_type character varying(25),
    CONSTRAINT pk_cacs_id PRIMARY KEY (cert_id),
    CONSTRAINT cert_thumbprint_unique UNIQUE (cert_thumbprint,partner_domain)

);

CREATE TABLE certify.rendering_template (
                                    id varchar(128) NOT NULL,
                                    template VARCHAR NOT NULL,
                                    cr_dtimes timestamp NOT NULL,
                                    upd_dtimes timestamp,
                                    CONSTRAINT pk_svgtmp_id PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS certify.credential_config (
    credential_config_key_id VARCHAR(2048) NOT NULL UNIQUE,
    config_id VARCHAR(255) NOT NULL,
    status VARCHAR(255),
    vc_template VARCHAR,
    doctype VARCHAR,
    sd_jwt_vct VARCHAR,
    context VARCHAR,
    credential_type VARCHAR,
    credential_format VARCHAR(255) NOT NULL,
    did_url VARCHAR,
    key_manager_app_id VARCHAR(36),
    key_manager_ref_id VARCHAR(128),
    signature_algo VARCHAR(36),
    signature_crypto_suite VARCHAR(128),
    sd_claim VARCHAR,
    display JSONB NOT NULL,
    display_order TEXT[] NOT NULL,
    scope VARCHAR(255) NOT NULL,
    cryptographic_binding_methods_supported TEXT[] NOT NULL,
    credential_signing_alg_values_supported TEXT[] NOT NULL,
    proof_types_supported JSONB NOT NULL,
    credential_subject JSONB,
    sd_jwt_claims JSONB,
    mso_mdoc_claims JSONB,
    plugin_configurations JSONB,
    credential_status_purpose TEXT[],
    qr_settings JSONB,
    qr_signature_algo TEXT,
    cr_dtimes TIMESTAMP NOT NULL,
    upd_dtimes TIMESTAMP,
    CONSTRAINT pk_config_id PRIMARY KEY (config_id)
);

CREATE UNIQUE INDEX idx_credential_config_type_context_unique
ON certify.credential_config(credential_type, context, credential_format)
WHERE credential_type IS NOT NULL AND credential_type <> ''
AND context IS NOT NULL AND context <> '';

CREATE UNIQUE INDEX idx_credential_config_sd_jwt_vct_unique
ON certify.credential_config(sd_jwt_vct, credential_format)
WHERE sd_jwt_vct IS NOT NULL and sd_jwt_vct <> '';

CREATE UNIQUE INDEX idx_credential_config_doctype_unique
ON certify.credential_config(doctype, credential_format)
WHERE doctype IS NOT NULL and doctype <> '';

INSERT INTO certify.credential_config (
    credential_config_key_id,
    config_id,
    status,
    vc_template,
    doctype,
    sd_jwt_vct,
    context,
    credential_type,
    credential_format,
    did_url,
    key_manager_app_id,
    key_manager_ref_id,
    signature_algo,
    signature_crypto_suite,
    sd_claim,
    display,
    display_order,
    scope,
    cryptographic_binding_methods_supported,
    credential_signing_alg_values_supported,
    proof_types_supported,
    credential_subject,
    mso_mdoc_claims,
    plugin_configurations,
    credential_status_purpose,
    qr_settings,
    qr_signature_algo,
    cr_dtimes,
    upd_dtimes
)
VALUES (
    'FarmerCredential',
    gen_random_uuid()::VARCHAR(255),  -- generating a unique config_id
    'active',  -- assuming an active status
    'ewogICAgICAgICAgIkBjb250ZXh0IjogWwogICAgICAgICAgICAgICJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsCiAgICAgICAgICAgICAgImh0dHBzOi8vcGl5dXNoNzAzNC5naXRodWIuaW8vbXktZmlsZXMvZmFybWVyLmpzb24iLAogICAgICAgICAgICAgICJodHRwczovL3czaWQub3JnL3NlY3VyaXR5L3N1aXRlcy9lZDI1NTE5LTIwMjAvdjEiCiAgICAgICAgICBdLAogICAgICAgICAgImlzc3VlciI6ICIke19pc3N1ZXJ9IiwKICAgICAgICAgICJ0eXBlIjogWwogICAgICAgICAgICAgICJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsCiAgICAgICAgICAgICAgIkZhcm1lckNyZWRlbnRpYWwiCiAgICAgICAgICBdLAogICAgICAgICAgImlzc3VhbmNlRGF0ZSI6ICIke3ZhbGlkRnJvbX0iLAogICAgICAgICAgImV4cGlyYXRpb25EYXRlIjogIiR7dmFsaWRVbnRpbH0iLAogICAgICAgICAgImNyZWRlbnRpYWxTdWJqZWN0IjogewogICAgICAgICAgICAgICJpZCI6ICIke19ob2xkZXJJZH0iLAogICAgICAgICAgICAgICJmdWxsTmFtZSI6ICIke2Z1bGxOYW1lfSIsCiAgICAgICAgICAgICAgIm1vYmlsZU51bWJlciI6ICIke21vYmlsZU51bWJlcn0iLAogICAgICAgICAgICAgICJkYXRlT2ZCaXJ0aCI6ICIke2RhdGVPZkJpcnRofSIsCiAgICAgICAgICAgICAgImdlbmRlciI6ICIke2dlbmRlcn0iLAogICAgICAgICAgICAgICJzdGF0ZSI6ICIke3N0YXRlfSIsCiAgICAgICAgICAgICAgImRpc3RyaWN0IjogIiR7ZGlzdHJpY3R9IiwKICAgICAgICAgICAgICAidmlsbGFnZU9yVG93biI6ICIke3ZpbGxhZ2VPclRvd259IiwKICAgICAgICAgICAgICAicG9zdGFsQ29kZSI6ICIke3Bvc3RhbENvZGV9IiwKICAgICAgICAgICAgICAibGFuZEFyZWEiOiAiJHtsYW5kQXJlYX0iLAogICAgICAgICAgICAgICJsYW5kT3duZXJzaGlwVHlwZSI6ICIke2xhbmRPd25lcnNoaXBUeXBlfSIsCiAgICAgICAgICAgICAgInByaW1hcnlDcm9wVHlwZSI6ICIke3ByaW1hcnlDcm9wVHlwZX0iLAogICAgICAgICAgICAgICJzZWNvbmRhcnlDcm9wVHlwZSI6ICIke3NlY29uZGFyeUNyb3BUeXBlfSIsCiAgICAgICAgICAgICAgImZhY2UiOiAiJHtmYWNlfSIsCiAgICAgICAgICAgICAgImZhcm1lcklEIjogIiR7ZmFybWVySUR9IgogICAgICAgICAgfQogICAgIH0=',  -- the VC template from the JSON
    NULL,  -- doctype from JSON
    NULL,  -- vct for SD-JWT VC
    'https://www.w3.org/2018/credentials/v1',  -- context as comma-separated string
    'FarmerCredential,VerifiableCredential',  -- credential_type as comma-separated string
    'ldp_vc',  -- credential_format
    'did:web:8398-2405-201-1029-3025-e142-9ad3-e1f2-f543.ngrok-free.app',  -- did_url
    'CERTIFY_VC_SIGN_ED25519',  -- key_manager_app_id
    'ED25519_SIGN',  -- key_manager_ref_id (optional)
    'EdDSA',  -- signature_algo (optional)
    'Ed25519Signature2020',  -- signature_crypto_suite
    NULL,  -- sd_claim (optional)
    '[{"name": "Farmer Verifiable Credential", "locale": "en", "logo": {"url": "https://mosip.github.io/inji-config/logos/agro-vertias-logo.png", "alt_text": "Farmer Credential Logo"}, "background_color": "#12107c", "text_color": "#FFFFFF", "background_image": { "uri": "https://mosip.github.io/inji-config/logos/agro-vertias-logo.png" }}]'::JSONB,  -- display
    ARRAY['fullName', 'mobileNumber', 'dateOfBirth', 'gender', 'state', 'district', 'villageOrTown', 'postalCode', 'landArea', 'landOwnershipType', 'primaryCropType', 'secondaryCropType', 'farmerID'],  -- display_order
    'mock_identity_vc_ldp',  -- scope
    ARRAY['did:jwk'],  -- cryptographic_binding_methods_supported
    ARRAY['Ed25519Signature2020'],  -- credential_signing_alg_values_supported
    '{"jwt": {"proof_signing_alg_values_supported": ["RS256", "ES256"]}}'::JSONB,  -- proof_types_supported
    '{"fullName": {"display": [{"name": "Full Name", "locale": "en"}]}, "phone": {"display": [{"name": "Phone Number", "locale": "en"}]}, "dateOfBirth": {"display": [{"name": "Date of Birth", "locale": "en"}]}, "gender": {"display": [{"name": "Gender", "locale": "en"}]}}'::JSONB,  -- credential_subject
    NULL,  -- claims (optional)
    '[{"mosip.certify.mock.data-provider.csv.identifier-column": "id", "mosip.certify.mock.data-provider.csv.data-columns": "id,fullName,mobileNumber,dateOfBirth,gender,state,district,villageOrTown,postalCode,landArea,landOwnershipType,primaryCropType,secondaryCropType,face,farmerID", "mosip.certify.mock.data-provider.csv-registry-uri": "/home/mosip/config/farmer_identity_data.csv"}]'::JSONB,  -- plugin_configurations
    ARRAY['revocation'],  -- credential_status_purpose
    '[{"Full Name": "${fullName}", "Phone Number": "${mobileNumber}","Date Of Birth": "${dateOfBirth}"}]'::JSONB,  -- qr_settings (optional)
    'EdDSA',  -- qr_signature_algo (optional)
    NOW(),  -- cr_dtimes
    NULL  -- upd_dtimes (optional)
);

INSERT INTO certify.key_policy_def(APP_ID,KEY_VALIDITY_DURATION,PRE_EXPIRE_DAYS,ACCESS_ALLOWED,IS_ACTIVE,CR_BY,CR_DTIMES) VALUES('ROOT', 2920, 1125, 'NA', true, 'mosipadmin', now());
INSERT INTO certify.key_policy_def(APP_ID,KEY_VALIDITY_DURATION,PRE_EXPIRE_DAYS,ACCESS_ALLOWED,IS_ACTIVE,CR_BY,CR_DTIMES) VALUES('CERTIFY_SERVICE', 1095, 60, 'NA', true, 'mosipadmin', now());
INSERT INTO certify.key_policy_def(APP_ID,KEY_VALIDITY_DURATION,PRE_EXPIRE_DAYS,ACCESS_ALLOWED,IS_ACTIVE,CR_BY,CR_DTIMES) VALUES('CERTIFY_PARTNER', 1095, 60, 'NA', true, 'mosipadmin', now());
INSERT INTO certify.key_policy_def(APP_ID,KEY_VALIDITY_DURATION,PRE_EXPIRE_DAYS,ACCESS_ALLOWED,IS_ACTIVE,CR_BY,CR_DTIMES) VALUES('CERTIFY_VC_SIGN_RSA', 1095, 60, 'NA', true, 'mosipadmin', now());
INSERT INTO certify.key_policy_def(APP_ID,KEY_VALIDITY_DURATION,PRE_EXPIRE_DAYS,ACCESS_ALLOWED,IS_ACTIVE,CR_BY,CR_DTIMES) VALUES('CERTIFY_VC_SIGN_ED25519', 1095, 60, 'NA', true, 'mosipadmin', now());
INSERT INTO certify.key_policy_def(APP_ID,KEY_VALIDITY_DURATION,PRE_EXPIRE_DAYS,ACCESS_ALLOWED,IS_ACTIVE,CR_BY,CR_DTIMES) VALUES('BASE', 1095, 60, 'NA', true, 'mosipadmin', now());
INSERT INTO certify.key_policy_def(APP_ID,KEY_VALIDITY_DURATION,PRE_EXPIRE_DAYS,ACCESS_ALLOWED,IS_ACTIVE,CR_BY,CR_DTIMES) VALUES('CERTIFY_VC_SIGN_EC_K1', 1095, 60, 'NA', true, 'mosipadmin', now());
INSERT INTO certify.key_policy_def(APP_ID,KEY_VALIDITY_DURATION,PRE_EXPIRE_DAYS,ACCESS_ALLOWED,IS_ACTIVE,CR_BY,CR_DTIMES) VALUES('CERTIFY_VC_SIGN_EC_R1', 1095, 60, 'NA', true, 'mosipadmin', now());

CREATE TYPE credential_status_enum AS ENUM ('AVAILABLE', 'FULL');

-- Create status_list_credential table
CREATE TABLE certify.status_list_credential (
    id VARCHAR(255) PRIMARY KEY,          -- The unique ID (URL/DID/URN) extracted from the VC's 'id' field.
    vc_document VARCHAR NOT NULL,           -- Stores the entire Verifiable Credential JSON document.
    credential_type VARCHAR(100) NOT NULL, -- Type of the status list (e.g., 'StatusList2021Credential')
    status_purpose VARCHAR(100),             -- Intended purpose of this list within the system (e.g., 'revocation', 'suspension', 'general'). NULLABLE.
    capacity BIGINT,                        --- length of status list
    credential_status credential_status_enum, -- Use the created ENUM type here
    cr_dtimes timestamp NOT NULL default now(),
    upd_dtimes timestamp                    -- When this VC record was last updated in the system
);


CREATE INDEX IF NOT EXISTS idx_slc_status_purpose ON certify.status_list_credential(status_purpose);
CREATE INDEX IF NOT EXISTS idx_slc_credential_type ON certify.status_list_credential(credential_type);
CREATE INDEX IF NOT EXISTS idx_slc_credential_status ON certify.status_list_credential(credential_status);
CREATE INDEX IF NOT EXISTS idx_slc_cr_dtimes ON certify.status_list_credential(cr_dtimes);

-- Create the ledger table
CREATE TABLE certify.ledger (
    id SERIAL PRIMARY KEY,                          -- Auto-incrementing serial primary key
    credential_id VARCHAR(255),            -- Unique ID of the Verifiable Credential WHOSE STATUS IS BEING TRACKED
    issuer_id VARCHAR(255) NOT NULL,                -- Issuer of the TRACKED credential
    issuance_date TIMESTAMP NOT NULL,                -- Issuance date of the TRACKED credential
    expiration_date TIMESTAMP,                    -- Expiration date of the TRACKED credential, if any
    credential_type VARCHAR(100) NOT NULL,          -- Type of the TRACKED credential (e.g., 'VerifiableId')
    indexed_attributes JSONB,                       -- Optional searchable attributes from the TRACKED credential
    credential_status_details JSONB NOT NULL DEFAULT '[]'::jsonb,    -- Stores a list of status objects for this credential, defaults to an empty array.
    cr_dtimes TIMESTAMP NOT NULL DEFAULT NOW(),     -- Creation timestamp of this ledger entry for the tracked credential

    -- Constraints
    CONSTRAINT uq_ledger_tracked_credential_id UNIQUE (credential_id), -- Ensure tracked credential_id is unique
    CONSTRAINT ensure_credential_status_details_is_array CHECK (jsonb_typeof(credential_status_details) = 'array') -- Ensure it's always a JSON array
);


CREATE INDEX IF NOT EXISTS idx_ledger_credential_id ON certify.ledger(credential_id);
CREATE INDEX IF NOT EXISTS idx_ledger_issuer_id ON certify.ledger(issuer_id);
CREATE INDEX IF NOT EXISTS idx_ledger_credential_type ON certify.ledger(credential_type);
CREATE INDEX IF NOT EXISTS idx_ledger_issuance_date ON certify.ledger(issuance_date);
CREATE INDEX IF NOT EXISTS idx_ledger_expiration_date ON certify.ledger(expiration_date);
CREATE INDEX IF NOT EXISTS idx_ledger_cr_dtimes ON certify.ledger(cr_dtimes);
CREATE INDEX IF NOT EXISTS idx_gin_ledger_indexed_attrs ON certify.ledger USING GIN (indexed_attributes);
CREATE INDEX IF NOT EXISTS idx_gin_ledger_status_details ON certify.ledger USING GIN (credential_status_details);

CREATE TABLE IF NOT EXISTS certify.credential_status_transaction (
    transaction_log_id SERIAL PRIMARY KEY,        -- Unique ID for this transaction log entry
    credential_id VARCHAR(255), -- The ID of the credential this transaction pertains to (should exist in ledger.credential_id)
    status_purpose VARCHAR(100),                  -- The purpose of this status update
    status_value boolean,                         -- The status value (true/false)
    status_list_credential_id VARCHAR(255),       -- The ID of the status list credential involved, if any
    status_list_index BIGINT,                     -- The index on the status list, if any
    cr_dtimes TIMESTAMP NOT NULL DEFAULT NOW(),   -- Creation timestamp
    processed_dtimes TIMESTAMP,                      -- Timestamp when processed by status list batch job
    is_processed BOOLEAN NOT NULL DEFAULT FALSE   -- Indicates if processed by status list batch job
);

CREATE INDEX IF NOT EXISTS idx_cst_is_processed_created ON certify.credential_status_transaction (is_processed, cr_dtimes);

CREATE TABLE certify.status_list_available_indices (
    id SERIAL PRIMARY KEY,                         -- Serial primary key
    status_list_credential_id VARCHAR(255) NOT NULL, -- References status_list_credential.id
    list_index BIGINT NOT NULL,                    -- The numerical index within the status list
    is_assigned BOOLEAN NOT NULL DEFAULT FALSE,   -- Flag indicating if this index has been assigned
    cr_dtimes TIMESTAMP NOT NULL DEFAULT NOW(),   -- Creation timestamp
    upd_dtimes TIMESTAMP,                          -- Update timestamp

    -- Foreign key constraint
    CONSTRAINT fk_status_list_credential
        FOREIGN KEY(status_list_credential_id)
        REFERENCES certify.status_list_credential(id)
        ON DELETE CASCADE -- If a status list credential is deleted, its available index entries are also deleted.
        ON UPDATE CASCADE, -- If the ID of a status list credential changes, update it here too.

    -- Unique constraint to ensure each index within a list is represented only once
    CONSTRAINT uq_list_id_and_index
        UNIQUE (status_list_credential_id, list_index)
);

CREATE INDEX IF NOT EXISTS idx_sla_available_indices
    ON certify.status_list_available_indices (status_list_credential_id, is_assigned, list_index)
    WHERE is_assigned = FALSE;

-- Additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_sla_status_list_credential_id ON certify.status_list_available_indices(status_list_credential_id);
CREATE INDEX IF NOT EXISTS idx_sla_is_assigned ON certify.status_list_available_indices(is_assigned);
CREATE INDEX IF NOT EXISTS idx_sla_list_index ON certify.status_list_available_indices(list_index);
CREATE INDEX IF NOT EXISTS idx_sla_cr_dtimes ON certify.status_list_available_indices(cr_dtimes);

CREATE TABLE IF NOT EXISTS certify.shedlock (
  name VARCHAR(64),
  lock_until TIMESTAMPTZ(3) NOT NULL,
  locked_at TIMESTAMPTZ(3) NOT NULL,
  locked_by VARCHAR(255) NOT NULL,
  PRIMARY KEY (name)
);

-- This script creates the iar_session table for Interactive Authorization Request functionality

CREATE TABLE IF NOT EXISTS certify.iar_session (
                                                   id SERIAL PRIMARY KEY,
                                                   auth_session VARCHAR(128) NOT NULL UNIQUE,
    transaction_id VARCHAR(64) NOT NULL,
    request_id VARCHAR(64),
    verify_nonce VARCHAR(64),
    expires_at TIMESTAMP NOT NULL,
    client_id VARCHAR(128),
    scope VARCHAR(128),
    authorization_code VARCHAR(128) UNIQUE,
    response_uri VARCHAR(512),
    code_challenge VARCHAR(128),
    code_challenge_method VARCHAR(10),
    code_issued_at TIMESTAMP,
    is_code_used BOOLEAN NOT NULL DEFAULT FALSE,
    code_used_at TIMESTAMP,
    cr_dtimes TIMESTAMP NOT NULL DEFAULT NOW(),
    identity_data TEXT
    );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_iar_session_auth_session ON certify.iar_session(auth_session);
CREATE INDEX IF NOT EXISTS idx_iar_session_authorization_code ON certify.iar_session(authorization_code);
CREATE INDEX IF NOT EXISTS idx_iar_session_request_id ON certify.iar_session(request_id);
CREATE INDEX IF NOT EXISTS idx_iar_session_expires_at ON certify.iar_session(expires_at);
CREATE INDEX IF NOT EXISTS idx_iar_session_authorization_code_used ON certify.iar_session(authorization_code, is_code_used) WHERE authorization_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_iar_session_scope ON certify.iar_session(scope);
CREATE INDEX IF NOT EXISTS idx_iar_session_transaction_id ON certify.iar_session(transaction_id);

-- ======================================================================
-- Student Use-Case Tables (Issue #834)
-- ======================================================================

CREATE TABLE IF NOT EXISTS certify.students (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id          VARCHAR(50) NOT NULL,
    full_name           VARCHAR(200) NOT NULL,
    email               VARCHAR(255) NOT NULL,
    phone_number        VARCHAR(20) NOT NULL,
    date_of_birth       DATE NOT NULL,
    address             TEXT NOT NULL,
    course_program      VARCHAR(150) NOT NULL,
    enrollment_date     DATE NOT NULL,
    academic_year       VARCHAR(20) NOT NULL,
    cgpa                NUMERIC(3,2),
    guardian_name       VARCHAR(200) NOT NULL,
    guardian_phone      VARCHAR(20) NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_students_student_id UNIQUE (student_id),
    CONSTRAINT uq_students_email UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS certify.student_graduation_details (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id              UUID NOT NULL,
    registration_number     VARCHAR(100) NOT NULL,
    degree_title            VARCHAR(200) NOT NULL,
    graduation_month        SMALLINT CHECK (graduation_month IS NULL OR (graduation_month BETWEEN 1 AND 12)),
    graduation_year         INTEGER NOT NULL,
    classification          VARCHAR(100),
    certificate_status      VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sgd_student FOREIGN KEY (student_id)
        REFERENCES certify.students(id) ON DELETE CASCADE,
    CONSTRAINT uq_sgd_registration_number UNIQUE (registration_number)
);

-- API Keys table for inji-usecase authentication
CREATE TABLE IF NOT EXISTS certify.api_keys (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_hash     VARCHAR(64) NOT NULL,      -- SHA-256 hex of the raw key
    name         VARCHAR(100) NOT NULL,     -- human-readable label
    role         VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at   TIMESTAMP,                 -- NULL = never expires
    last_used_at TIMESTAMP,
    CONSTRAINT uq_api_keys_hash UNIQUE (key_hash)
);

-- Sample student data
INSERT INTO certify.students
    (id, student_id, full_name, email, phone_number, date_of_birth,
     address, course_program, enrollment_date, academic_year, cgpa,
     guardian_name, guardian_phone, status)
VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567801','STU-2022-001','Aarav Sharma',
     'aarav.sharma@university.edu','+91-9876543210','2001-03-15',
     '123 MG Road, Bangalore, Karnataka 560001','B.Tech Computer Science',
     '2022-08-01','2022-2026',8.75,'Rajesh Sharma','+91-9876543211','ACTIVE'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567802','STU-2022-002','Priya Patel',
     'priya.patel@university.edu','+91-9876543220','2001-07-22',
     '456 Nehru Nagar, Mumbai, Maharashtra 400001','B.Tech Electronics',
     '2022-08-01','2022-2026',9.10,'Amit Patel','+91-9876543221','ACTIVE'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567803','STU-2021-003','Rahul Verma',
     'rahul.verma@university.edu','+91-9876543230','2000-11-05',
     '789 Gandhi Road, Delhi 110001','M.Tech Artificial Intelligence',
     '2021-08-01','2021-2023',8.50,'Suresh Verma','+91-9876543231','GRADUATED'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567804','STU-2023-004','Ananya Reddy',
     'ananya.reddy@university.edu','+91-9876543240','2002-01-30',
     '321 Tank Bund Road, Hyderabad, Telangana 500001','B.Sc Data Science',
     '2023-08-01','2023-2026',7.80,'Krishna Reddy','+91-9876543241','ACTIVE'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567805','STU-2020-005','Vikram Singh',
     'vikram.singh@university.edu','+91-9876543250','1999-06-18',
     '654 Rajpath, Jaipur, Rajasthan 302001','B.Tech Mechanical Engineering',
     '2020-08-01','2020-2024',8.20,'Baldev Singh','+91-9876543251','GRADUATED')
ON CONFLICT (student_id) DO NOTHING;

INSERT INTO certify.student_graduation_details
    (student_id, registration_number, degree_title,
     graduation_month, graduation_year, classification, certificate_status)
VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567805','REG001200',
     'Bachelor of Technology in Mechanical Engineering',5,2024,
     'First Class','ISSUED'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567803','REG001201',
     'Master of Technology in Artificial Intelligence',6,2023,
     'First Class with Distinction','ISSUED'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567801','REG001202',
     'Bachelor of Technology in Computer Science',6,2026,
     'First Class with Distinction','PENDING'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567802','REG001203',
     'Bachelor of Technology in Electronics',6,2026,
     'First Class','PENDING'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567804','REG001204',
     'B.Sc Data Science',6,2026,
     'First Class','PENDING')
ON CONFLICT (registration_number) DO NOTHING;


-- Seed default admin API key (raw value: "certify-admin-key-change-me")
INSERT INTO certify.api_keys (key_hash, name, role, active)
VALUES (
    'c5dcfe9326b9b27bcf10a7fb3b4a67c71ba83cb134b0858e3b2a293ed613ecec',
    'Default Admin Key',
    'ADMIN',
    TRUE
) ON CONFLICT (key_hash) DO NOTHING;

-- StudentGraduationCredential config
INSERT INTO certify.credential_config (
    credential_config_key_id, config_id, status,
    vc_template,
    context, credential_type, credential_format,
    did_url, key_manager_app_id, key_manager_ref_id,
    signature_algo, signature_crypto_suite,
    display, display_order, scope,
    cryptographic_binding_methods_supported,
    credential_signing_alg_values_supported,
    proof_types_supported, credential_subject,
    plugin_configurations,
    credential_status_purpose, cr_dtimes
)
VALUES (
    'StudentGraduationCredential',
    gen_random_uuid()::VARCHAR(255),
    'active',
    'eyJAY29udGV4dCI6IFsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiLCAiaHR0cHM6Ly93M2lkLm9yZy9zZWN1cml0eS9zdWl0ZXMvZWQyNTUxOS0yMDIwL3YxIl0sICJpc3N1ZXIiOiAiJHtfaXNzdWVyfSIsICJ0eXBlIjogWyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsICJTdHVkZW50R3JhZHVhdGlvbkNyZWRlbnRpYWwiXSwgImlzc3VhbmNlRGF0ZSI6ICIke3ZhbGlkRnJvbX0iLCAiZXhwaXJhdGlvbkRhdGUiOiAiJHt2YWxpZFVudGlsfSIsICJjcmVkZW50aWFsU3ViamVjdCI6IHsiaWQiOiAiJHtfaG9sZGVySWR9IiwgInN0dWRlbnRJZCI6ICIke3N0dWRlbnRfaWR9IiwgImZ1bGxOYW1lIjogIiR7ZnVsbF9uYW1lfSIsICJlbWFpbCI6ICIke2VtYWlsfSIsICJwaG9uZU51bWJlciI6ICIke3Bob25lX251bWJlcn0iLCAiZGF0ZU9mQmlydGgiOiAiJHtkYXRlX29mX2JpcnRofSIsICJjb3Vyc2VQcm9ncmFtIjogIiR7Y291cnNlX3Byb2dyYW19IiwgImVucm9sbG1lbnREYXRlIjogIiR7ZW5yb2xsbWVudF9kYXRlfSIsICJhY2FkZW1pY1llYXIiOiAiJHthY2FkZW1pY195ZWFyfSIsICJjZ3BhIjogIiR7Y2dwYX0iLCAicmVnaXN0cmF0aW9uTnVtYmVyIjogIiR7cmVnaXN0cmF0aW9uX251bWJlcn0iLCAiZGVncmVlVGl0bGUiOiAiJHtkZWdyZWVfdGl0bGV9IiwgImdyYWR1YXRpb25Nb250aCI6ICIke2dyYWR1YXRpb25fbW9udGh9IiwgImdyYWR1YXRpb25ZZWFyIjogIiR7Z3JhZHVhdGlvbl95ZWFyfSIsICJjbGFzc2lmaWNhdGlvbiI6ICIke2NsYXNzaWZpY2F0aW9ufSIsICJjZXJ0aWZpY2F0ZVN0YXR1cyI6ICIke2NlcnRpZmljYXRlX3N0YXR1c30ifX0=',
    'https://www.w3.org/2018/credentials/v1',
    'StudentGraduationCredential,VerifiableCredential',
    'ldp_vc',
    'did:web:localhost:8091',
    'CERTIFY_VC_SIGN_ED25519',
    'ED25519_SIGN',
    'EdDSA',
    'Ed25519Signature2020',
    '[{"name": "Student Graduation Credential", "locale": "en",
       "background_color": "#1a3c6e", "text_color": "#FFFFFF"}]'::JSONB,
    ARRAY['studentId','fullName','email','phoneNumber','dateOfBirth',
          'courseProgram','enrollmentDate','academicYear','cgpa',
          'registrationNumber','degreeTitle','graduationMonth',
          'graduationYear','classification','certificateStatus'],
    'student_graduation_vc_ldp',
    ARRAY['did:jwk'],
    ARRAY['Ed25519Signature2020'],
    '{"jwt":{"proof_signing_alg_values_supported":["RS256","ES256"]}}'::JSONB,
    '{"studentId":{"display":[{"name":"Student ID","locale":"en"}]},
      "fullName":{"display":[{"name":"Full Name","locale":"en"}]},
      "degreeTitle":{"display":[{"name":"Degree","locale":"en"}]},
      "graduationYear":{"display":[{"name":"Year","locale":"en"}]},
      "classification":{"display":[{"name":"Class","locale":"en"}]}
     }'::JSONB,
    NULL,
    ARRAY['revocation'],
    NOW()
) ON CONFLICT (credential_config_key_id) DO NOTHING;