\c student_management;

SET search_path TO student;

INSERT INTO students (id, student_id, full_name, email, phone_number, date_of_birth, address, course_program, enrollment_date, academic_year, cgpa, guardian_name, guardian_phone, status)
VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567801', 'STU-2022-001', 'Aarav Sharma', 'aarav.sharma@university.edu', '+91-9876543210', '2001-03-15', '123 MG Road, Bangalore, Karnataka 560001', 'B.Tech Computer Science', '2022-08-01', '2022-2026', 8.75, 'Rajesh Sharma', '+91-9876543211', 'ACTIVE'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567802', 'STU-2022-002', 'Priya Patel', 'priya.patel@university.edu', '+91-9876543220', '2001-07-22', '456 Nehru Nagar, Mumbai, Maharashtra 400001', 'B.Tech Electronics', '2022-08-01', '2022-2026', 9.10, 'Amit Patel', '+91-9876543221', 'ACTIVE'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567803', 'STU-2021-003', 'Rahul Verma', 'rahul.verma@university.edu', '+91-9876543230', '2000-11-05', '789 Gandhi Road, Delhi 110001', 'M.Tech Artificial Intelligence', '2021-08-01', '2021-2023', 8.50, 'Suresh Verma', '+91-9876543231', 'ACTIVE'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567804', 'STU-2023-004', 'Ananya Reddy', 'ananya.reddy@university.edu', '+91-9876543240', '2002-01-30', '321 Tank Bund Road, Hyderabad, Telangana 500001', 'B.Sc Data Science', '2023-08-01', '2023-2026', 7.80, 'Krishna Reddy', '+91-9876543241', 'ACTIVE'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567805', 'STU-2020-005', 'Vikram Singh', 'vikram.singh@university.edu', '+91-9876543250', '1999-06-18', '654 Rajpath, Jaipur, Rajasthan 302001', 'B.Tech Mechanical Engineering', '2020-08-01', '2020-2024', 8.20, 'Baldev Singh', '+91-9876543251', 'ACTIVE');

INSERT INTO student_graduation_details (student_id, registration_number, degree_title, graduation_month, graduation_year, classification, certificate_status)
VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567805', 'REG001200', 'Bachelor of Technology in Mechanical Engineering', NULL, 2024, NULL, 'PENDING'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567803', 'REG001201', 'Master of Technology in Artificial Intelligence', NULL, 2023, NULL, 'PENDING'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567801', 'REG001202', 'Bachelor of Technology in Computer Science', NULL, 2026, NULL, 'PENDING'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567802', 'REG001203', 'Bachelor of Technology in Electronics', NULL, 2026, NULL, 'PENDING'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567804', 'REG001204', 'B.Sc Data Science', NULL, 2026, NULL, 'PENDING');

