package com.mosip.inji_usecase.repository.student;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.mosip.inji_usecase.entity.student.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, UUID>, JpaSpecificationExecutor<Student> {

    Optional<Student> findByStudentId(String studentId);

    Optional<Student> findByEmail(String email);

    boolean existsByStudentId(String studentId);

    boolean existsByEmail(String email);
}
