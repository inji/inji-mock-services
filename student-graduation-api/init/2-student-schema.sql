\c student_management;

CREATE SCHEMA IF NOT EXISTS student;

SET search_path TO student;

CREATE TABLE students (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id          VARCHAR(50) NOT NULL UNIQUE,
    full_name           VARCHAR(200) NOT NULL,
    email               VARCHAR(255) NOT NULL UNIQUE,
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
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_graduation_details (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id              UUID NOT NULL,
    registration_number     VARCHAR(50) NOT NULL,
    degree_title            VARCHAR(200) NOT NULL,
    graduation_month        SMALLINT CHECK (graduation_month IS NULL OR (graduation_month BETWEEN 1 AND 12)),
    graduation_year         INTEGER NOT NULL,
    classification          VARCHAR(100),
    certificate_status      VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT uq_registration_number UNIQUE (registration_number)
);
