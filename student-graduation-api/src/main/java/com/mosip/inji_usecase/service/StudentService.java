package com.mosip.inji_usecase.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mosip.inji_usecase.dto.student.StudentDto;
import com.mosip.inji_usecase.dto.student.StudentGraduationDto;
import com.mosip.inji_usecase.entity.student.Student;
import com.mosip.inji_usecase.entity.student.StudentGraduationDetail;
import com.mosip.inji_usecase.mapper.student.StudentGraduationMapper;
import com.mosip.inji_usecase.mapper.student.StudentMapper;
import com.mosip.inji_usecase.repository.student.StudentGraduationRepository;
import com.mosip.inji_usecase.repository.student.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {

    private static final Logger LOGGER = LoggerFactory.getLogger(StudentService.class);

    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;
    private final StudentGraduationRepository graduationRepository;
    private final StudentGraduationMapper graduationMapper;

    /**
     * Generates the next sequential registration number starting from REG001200.
     * Searches all existing registration numbers matching 'REG[0-9]+', finds the maximum,
     * and increments by 1.
     */
    public synchronized String generateNextRegistrationNumber() {
        List<String> regNumbers = graduationRepository.findAllRegistrationNumbers();
        int maxSeq = 1199; // Base start: 1199 + 1 = 1200 -> "REG001200"
        Pattern pattern = Pattern.compile("^REG(\\d+)$");
        for (String reg : regNumbers) {
            if (reg != null) {
                Matcher m = pattern.matcher(reg.trim());
                if (m.matches()) {
                    try {
                        int val = Integer.parseInt(m.group(1));
                        if (val > maxSeq) {
                            maxSeq = val;
                        }
                    } catch (NumberFormatException ignored) {
                    }
                }
            }
        }
        int nextSeq = maxSeq + 1;
        while (graduationRepository.existsByRegistrationNumber(String.format("REG%06d", nextSeq))) {
            nextSeq++;
        }
        return String.format("REG%06d", nextSeq);
    }

    private int parseGraduationYear(String academicYear) {
        if (academicYear != null) {
            Matcher mRange = Pattern.compile("-(\\d{4})").matcher(academicYear);
            if (mRange.find()) {
                return Integer.parseInt(mRange.group(1));
            }
            Matcher mSingle = Pattern.compile("(\\d{4})").matcher(academicYear);
            if (mSingle.find()) {
                return Integer.parseInt(mSingle.group(1));
            }
            if (academicYear.toLowerCase().contains("final")) {
                return LocalDate.now().getYear();
            }
        }
        return LocalDate.now().getYear();
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void backfillMissingRegistrationNumbers() {
        LOGGER.info("Checking for students requiring registration numbers backfill...");
        List<Student> students = studentRepository.findAll(
                Sort.by(Sort.Direction.ASC, "createdAt", "enrollmentDate", "studentId"));

        int seq = 1200;
        for (Student s : students) {
            List<StudentGraduationDetail> details = graduationRepository.findByStudentId(s.getId());
            if (details.isEmpty()) {
                String regNo = String.format("REG%06d", seq);
                while (graduationRepository.existsByRegistrationNumber(regNo)) {
                    seq++;
                    regNo = String.format("REG%06d", seq);
                }
                int gradYear = parseGraduationYear(s.getAcademicYear());
                StudentGraduationDetail newDetail = StudentGraduationDetail.builder()
                        .student(s)
                        .registrationNumber(regNo)
                        .degreeTitle(s.getCourseProgram() != null && !s.getCourseProgram().isBlank()
                                ? s.getCourseProgram() : "Bachelor Degree")
                        .graduationMonth(null)
                        .graduationYear(gradYear)
                        .classification(null)
                        .certificateStatus("PENDING")
                        .build();
                graduationRepository.save(newDetail);
                LOGGER.info("Backfilled registration number {} for student {}", regNo, s.getStudentId());
                seq++;
            }
        }
    }

    @Transactional
    public StudentDto createStudent(StudentDto dto) {
        LOGGER.info("Creating student with studentId: {}", dto.getStudentId());

        if (studentRepository.existsByStudentId(dto.getStudentId())) {
            throw new IllegalArgumentException("Student with ID '" + dto.getStudentId() + "' already exists");
        }
        if (studentRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Student with email '" + dto.getEmail() + "' already exists");
        }

        Student entity = studentMapper.toEntity(dto);
        if (entity.getStatus() == null) {
            entity.setStatus("ACTIVE");
        }
        Student saved = studentRepository.save(entity);
        LOGGER.info("Student created with id: {}", saved.getId());

        // Chronologically assign the next sequential registration number starting at REG001200
        String regNumber = generateNextRegistrationNumber();
        LOGGER.info("Assigned registration number: {} to student: {}", regNumber, saved.getStudentId());

        int gradYear = parseGraduationYear(dto.getAcademicYear());
        String degree = dto.getCourseProgram() != null && !dto.getCourseProgram().isBlank()
                ? dto.getCourseProgram() : "Bachelor Degree";

        StudentGraduationDetail gradDetail = StudentGraduationDetail.builder()
                .student(saved)
                .registrationNumber(regNumber)
                .degreeTitle(degree)
                .graduationMonth(null) // Leave empty like Figma
                .graduationYear(gradYear)
                .classification(null) // Leave empty like Figma
                .certificateStatus("PENDING")
                .build();

        StudentGraduationDetail savedGrad = graduationRepository.save(gradDetail);
        saved.setGraduationDetails(List.of(savedGrad));

        StudentDto result = studentMapper.toDto(saved);
        result.setGraduationDetails(graduationMapper.toDto(savedGrad));
        result.setRegistrationNumber(regNumber);
        return result;
    }


    private StudentDto enrichWithGraduationDetails(Student student, StudentDto dto) {
        if (student.getGraduationDetails() != null && !student.getGraduationDetails().isEmpty()) {
            StudentGraduationDetail gd = student.getGraduationDetails().get(0);
            dto.setGraduationDetails(graduationMapper.toDto(gd));
            dto.setRegistrationNumber(gd.getRegistrationNumber());
        }
        return dto;
    }

    @Transactional(readOnly = true)
    public StudentDto getByStudentId(String studentId) {
        LOGGER.debug("Fetching student by studentId: {}", studentId);
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));
        StudentDto dto = studentMapper.toDto(student);
        return enrichWithGraduationDetails(student, dto);
    }

    @Transactional(readOnly = true)
    public StudentDto getById(UUID id) {
        LOGGER.debug("Fetching student by UUID: {}", id);
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with UUID: " + id));
        StudentDto dto = studentMapper.toDto(student);
        return enrichWithGraduationDetails(student, dto);
    }

    @Transactional(readOnly = true)
    public List<StudentDto> getAllStudents() {
        LOGGER.debug("Fetching all students");
        return studentRepository.findAll().stream()
                .map(s -> {
                    StudentDto dto = studentMapper.toDto(s);
                    return enrichWithGraduationDetails(s, dto);
                })
                .toList();
    }

    @Transactional
    public StudentDto updateStudent(String studentId, StudentDto dto) {
        LOGGER.info("Updating student with studentId: {}", studentId);
        Student existing = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));

        // Check email uniqueness if changed
        if (dto.getEmail() != null && !dto.getEmail().equals(existing.getEmail())) {
            if (studentRepository.existsByEmail(dto.getEmail())) {
                throw new IllegalArgumentException("Email '" + dto.getEmail() + "' is already in use");
            }
        }

        studentMapper.updateEntityFromDto(dto, existing);

        // Process graduation/certificate details if provided
        if (dto.getGraduationDetails() != null) {
            StudentGraduationDto gradDto = dto.getGraduationDetails();
            if (gradDto.getRegistrationNumber() != null && !gradDto.getRegistrationNumber().isBlank()) {
                StudentGraduationDetail gradDetail;
                if (existing.getGraduationDetails() != null && !existing.getGraduationDetails().isEmpty()) {
                    gradDetail = existing.getGraduationDetails().get(0);
                    if (!gradDto.getRegistrationNumber().equals(gradDetail.getRegistrationNumber())) {
                        if (graduationRepository.existsByRegistrationNumber(gradDto.getRegistrationNumber())) {
                            throw new IllegalArgumentException(
                                    "Registration number '" + gradDto.getRegistrationNumber() + "' is already in use");
                        }
                    }
                    graduationMapper.updateEntityFromDto(gradDto, gradDetail);
                } else {
                    if (graduationRepository.existsByRegistrationNumber(gradDto.getRegistrationNumber())) {
                        throw new IllegalArgumentException(
                                "Registration number '" + gradDto.getRegistrationNumber() + "' is already in use");
                    }
                    gradDetail = graduationMapper.toEntity(gradDto);
                    gradDetail.setStudent(existing);
                }

                // If both graduation month and classification are provided, unlock credentials
                if (gradDto.getGraduationMonth() != null && gradDto.getClassification() != null
                        && !gradDto.getClassification().isBlank()) {
                    gradDetail.setGraduationMonth(gradDto.getGraduationMonth());
                    gradDetail.setClassification(gradDto.getClassification().trim());
                    gradDetail.setCertificateStatus("ISSUED");
                    existing.setStatus("GRADUATED");
                } else {
                    gradDetail.setGraduationMonth(null);
                    gradDetail.setClassification(null);
                    gradDetail.setCertificateStatus("PENDING");
                    if ("GRADUATED".equalsIgnoreCase(existing.getStatus())) {
                        existing.setStatus("ACTIVE");
                    }
                }
                graduationRepository.save(gradDetail);
            }
        }


        Student saved = studentRepository.save(existing);
        LOGGER.info("Student updated: {}", saved.getStudentId());
        StudentDto result = studentMapper.toDto(saved);
        return enrichWithGraduationDetails(saved, result);
    }

    @Transactional
    public void deleteStudent(String studentId) {
        LOGGER.info("Deleting student with studentId: {}", studentId);
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));
        studentRepository.delete(student);
        LOGGER.info("Student deleted: {}", studentId);
    }
}

