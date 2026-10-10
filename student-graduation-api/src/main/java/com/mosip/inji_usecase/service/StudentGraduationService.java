package com.mosip.inji_usecase.service;

import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mosip.inji_usecase.dto.student.StudentGraduationDto;
import com.mosip.inji_usecase.entity.student.Student;
import com.mosip.inji_usecase.entity.student.StudentGraduationDetail;
import com.mosip.inji_usecase.mapper.student.StudentGraduationMapper;
import com.mosip.inji_usecase.repository.student.StudentGraduationRepository;
import com.mosip.inji_usecase.repository.student.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentGraduationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(StudentGraduationService.class);

    private final StudentGraduationRepository graduationRepository;
    private final StudentRepository studentRepository;
    private final StudentGraduationMapper graduationMapper;

    @Transactional
    public StudentGraduationDto addGraduationDetails(String studentId, StudentGraduationDto dto) {
        LOGGER.info("Adding graduation details for student: {}", studentId);

        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));

        if (graduationRepository.existsByRegistrationNumber(dto.getRegistrationNumber())) {
            throw new IllegalArgumentException(
                    "Graduation record with registration number '" + dto.getRegistrationNumber() + "' already exists");
        }

        StudentGraduationDetail entity = graduationMapper.toEntity(dto);
        entity.setStudent(student);
        if (entity.getCertificateStatus() == null) {
            entity.setCertificateStatus("PENDING");
        }

        student.setStatus("GRADUATED");
        studentRepository.save(student);

        StudentGraduationDetail saved = graduationRepository.save(entity);
        LOGGER.info("Graduation details added with id: {}", saved.getId());
        return graduationMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<StudentGraduationDto> getGraduationDetailsByStudentId(String studentId) {
        LOGGER.debug("Fetching graduation details for student: {}", studentId);

        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));

        return graduationRepository.findByStudentId(student.getId()).stream()
                .map(graduationMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public StudentGraduationDto getById(UUID id) {
        LOGGER.debug("Fetching graduation detail by UUID: {}", id);
        StudentGraduationDetail detail = graduationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Graduation detail not found with UUID: " + id));
        return graduationMapper.toDto(detail);
    }

    @Transactional(readOnly = true)
    public StudentGraduationDto getByRegistrationNumber(String registrationNumber) {
        LOGGER.debug("Fetching graduation detail by registration number: {}", registrationNumber);
        StudentGraduationDetail detail = graduationRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Graduation detail not found with registration number: " + registrationNumber));
        return graduationMapper.toDto(detail);
    }

    @Transactional(readOnly = true)
    public List<StudentGraduationDto> getByGraduationYear(Integer year) {
        LOGGER.debug("Fetching graduation details for year: {}", year);
        return graduationRepository.findByGraduationYear(year).stream()
                .map(graduationMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<StudentGraduationDto> getByCertificateStatus(String status) {
        LOGGER.debug("Fetching graduation details with certificate status: {}", status);
        return graduationRepository.findByCertificateStatus(status).stream()
                .map(graduationMapper::toDto)
                .toList();
    }

    @Transactional
    public StudentGraduationDto updateGraduationDetails(UUID id, StudentGraduationDto dto) {
        LOGGER.info("Updating graduation detail with id: {}", id);
        StudentGraduationDetail existing = graduationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Graduation detail not found with UUID: " + id));

        // Check registration number uniqueness if changed
        if (dto.getRegistrationNumber() != null
                && !dto.getRegistrationNumber().equals(existing.getRegistrationNumber())) {
            if (graduationRepository.existsByRegistrationNumber(dto.getRegistrationNumber())) {
                throw new IllegalArgumentException(
                        "Registration number '" + dto.getRegistrationNumber() + "' is already in use");
            }
        }

        graduationMapper.updateEntityFromDto(dto, existing);
        StudentGraduationDetail saved = graduationRepository.save(existing);
        LOGGER.info("Graduation detail updated: {}", saved.getId());
        return graduationMapper.toDto(saved);
    }

    @Transactional
    public void deleteGraduationDetail(UUID id) {
        LOGGER.info("Deleting graduation detail with id: {}", id);
        if (!graduationRepository.existsById(id)) {
            throw new IllegalArgumentException("Graduation detail not found with UUID: " + id);
        }
        graduationRepository.deleteById(id);
        LOGGER.info("Graduation detail deleted: {}", id);
    }
}
