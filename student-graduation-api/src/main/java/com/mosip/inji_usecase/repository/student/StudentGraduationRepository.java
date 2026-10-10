package com.mosip.inji_usecase.repository.student;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.mosip.inji_usecase.entity.student.StudentGraduationDetail;

@Repository
public interface StudentGraduationRepository extends JpaRepository<StudentGraduationDetail, UUID>,
        JpaSpecificationExecutor<StudentGraduationDetail> {

    List<StudentGraduationDetail> findByStudentId(UUID studentId);

    Optional<StudentGraduationDetail> findByRegistrationNumber(String registrationNumber);

    List<StudentGraduationDetail> findByGraduationYear(Integer graduationYear);

    List<StudentGraduationDetail> findByCertificateStatus(String certificateStatus);

    boolean existsByRegistrationNumber(String registrationNumber);

    @org.springframework.data.jpa.repository.Query("SELECT g.registrationNumber FROM StudentGraduationDetail g")
    List<String> findAllRegistrationNumbers();
}
