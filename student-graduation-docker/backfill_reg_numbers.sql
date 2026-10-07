DO $$
DECLARE
    rec RECORD;
    seq INT := 1200;
    reg_no VARCHAR;
    yr INT;
BEGIN
    FOR rec IN 
        SELECT id, student_id, course_program, academic_year 
        FROM certify.students 
        ORDER BY created_at ASC, enrollment_date ASC, student_id ASC 
    LOOP
        reg_no := 'REG' || LPAD(seq::text, 6, '0');
        
        yr := 2026;
        IF rec.academic_year ~ '[0-9]{4}' THEN
            IF rec.academic_year ~ '-[0-9]{4}' THEN
                yr := (regexp_matches(rec.academic_year, '-([0-9]{4})'))[1]::int;
            ELSE
                yr := (regexp_matches(rec.academic_year, '([0-9]{4})'))[1]::int;
            END IF;
        END IF;

        IF EXISTS (SELECT 1 FROM certify.student_graduation_details WHERE student_id = rec.id) THEN
            UPDATE certify.student_graduation_details
            SET registration_number = reg_no,
                updated_at = NOW()
            WHERE student_id = rec.id;
        ELSE
            INSERT INTO certify.student_graduation_details
                (student_id, registration_number, degree_title, graduation_month, graduation_year, classification, certificate_status)
            VALUES
                (rec.id, reg_no, rec.course_program, 5, yr, 'First Class with Distinction', 'PENDING');
        END IF;

        seq := seq + 1;
    END LOOP;
END $$;
