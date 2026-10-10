package com.mosip.inji_usecase.controller;

import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mosip.inji_usecase.dto.CredentialOfferTriggerRequest;
import com.mosip.inji_usecase.dto.CredentialOfferTriggerResponse;
import com.mosip.inji_usecase.dto.student.StudentDto;
import com.mosip.inji_usecase.dto.student.StudentGraduationDto;
import com.mosip.inji_usecase.service.CredentialOfferService;
import com.mosip.inji_usecase.service.StudentGraduationService;
import com.mosip.inji_usecase.service.StudentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Validated
public class StudentDataController {

    private static final Logger LOGGER = LoggerFactory.getLogger(StudentDataController.class);

    private final StudentService studentService;
    private final StudentGraduationService graduationService;
    private final CredentialOfferService credentialOfferService;

    // ======================== STUDENT ENDPOINTS ========================

    /**
     * Create a new student
     */
    @PostMapping("/students")
    public ResponseEntity<?> createStudent(@Valid @RequestBody StudentDto studentDto) {
        try {
            StudentDto created = studentService.createStudent(studentDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            LOGGER.warn("Failed to create student: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    /**
     * Get student by student_id (e.g., STU-2022-001)
     */
    @GetMapping("/students/{studentId}")
    public ResponseEntity<?> getStudentByStudentId(@PathVariable("studentId") String studentId) {
        try {
            StudentDto student = studentService.getByStudentId(studentId);
            return ResponseEntity.ok(student);
        } catch (IllegalArgumentException e) {
            LOGGER.warn("Student not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Get all students
     */
    @GetMapping("/students")
    public ResponseEntity<List<StudentDto>> getAllStudents() {
        List<StudentDto> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    /**
     * Update student by student_id
     */
    @PutMapping("/students/{studentId}")
    public ResponseEntity<?> updateStudent(
            @PathVariable("studentId") String studentId,
            @Valid @RequestBody StudentDto studentDto) {
        try {
            StudentDto updated = studentService.updateStudent(studentId, studentDto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            LOGGER.warn("Failed to update student: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Delete student by student_id
     */
    @DeleteMapping("/students/{studentId}")
    public ResponseEntity<?> deleteStudent(@PathVariable("studentId") String studentId) {
        try {
            studentService.deleteStudent(studentId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            LOGGER.warn("Failed to delete student: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // ======================== GRADUATION ENDPOINTS ========================

    /**
     * Add graduation details for a student
     */
    @PostMapping("/students/{studentId}/graduation")
    public ResponseEntity<?> addGraduationDetails(
            @PathVariable("studentId") String studentId,
            @Valid @RequestBody StudentGraduationDto graduationDto) {
        try {
            StudentGraduationDto created = graduationService.addGraduationDetails(studentId, graduationDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            LOGGER.warn("Failed to add graduation details: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Get graduation details for a student
     */
    @GetMapping("/students/{studentId}/graduation")
    public ResponseEntity<?> getGraduationDetailsByStudentId(@PathVariable("studentId") String studentId) {
        try {
            List<StudentGraduationDto> details = graduationService.getGraduationDetailsByStudentId(studentId);
            return ResponseEntity.ok(details);
        } catch (IllegalArgumentException e) {
            LOGGER.warn("Student not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Update graduation details by UUID
     */
    @PutMapping("/graduation/{id}")
    public ResponseEntity<?> updateGraduationDetails(
            @PathVariable("id") UUID id,
            @Valid @RequestBody StudentGraduationDto graduationDto) {
        try {
            StudentGraduationDto updated = graduationService.updateGraduationDetails(id, graduationDto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            LOGGER.warn("Failed to update graduation details: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Delete graduation detail by UUID
     */
    @DeleteMapping("/graduation/{id}")
    public ResponseEntity<?> deleteGraduationDetail(@PathVariable("id") UUID id) {
        try {
            graduationService.deleteGraduationDetail(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            LOGGER.warn("Failed to delete graduation detail: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Search graduation records by filters
     */
    @GetMapping("/graduation/search")
    public ResponseEntity<?> searchGraduation(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String registrationNumber) {

        if (registrationNumber != null) {
            try {
                StudentGraduationDto detail = graduationService.getByRegistrationNumber(registrationNumber);
                return ResponseEntity.ok(List.of(detail));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
        }

        if (year != null) {
            return ResponseEntity.ok(graduationService.getByGraduationYear(year));
        }

        if (status != null) {
            return ResponseEntity.ok(graduationService.getByCertificateStatus(status));
        }

        // Return all if no filter specified
        return ResponseEntity.ok(graduationService.getByCertificateStatus("ISSUED"));
    }

    // ======================== CREDENTIAL ISSUANCE TRIGGER ========================

    /**
     * POST /api/students/{studentId}/request-credential
     *
     * Validates student graduation eligibility, then calls Inji Certify to generate
     * a pre-authorized code. Returns the credential_offer_uri (encode as QR code in frontend).
     *
     * Required role: ADMIN or STUDENT
     */
    @PostMapping("/students/{studentId}/request-credential")
    public ResponseEntity<?> requestCredential(
            @PathVariable("studentId") String studentId,
            @RequestBody(required = false) CredentialOfferTriggerRequest request) {
        try {
            if (request == null) {
                request = new CredentialOfferTriggerRequest();
            }
            CredentialOfferTriggerResponse response =
                    credentialOfferService.triggerCredentialOffer(studentId, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            LOGGER.warn("Student not found for credential offer: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        } catch (IllegalStateException e) {
            LOGGER.warn("Student not eligible for credential offer: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        } catch (Exception e) {
            LOGGER.error("Failed to trigger credential offer for student {}", studentId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Failed to generate credential offer"));
        }
    }
}
