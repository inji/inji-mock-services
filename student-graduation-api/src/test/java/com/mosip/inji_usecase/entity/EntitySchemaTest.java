package com.mosip.inji_usecase.entity;

import com.mosip.inji_usecase.entity.student.Student;
import com.mosip.inji_usecase.entity.student.StudentGraduationDetail;
import org.junit.jupiter.api.Test;

import jakarta.persistence.Table;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * TC-ENTITY-01 through TC-ENTITY-02
 * Verifies that JPA @Table annotations point to the correct schema.
 * These are pure reflection tests — no DB needed.
 */
class EntitySchemaTest {

    @Test
    void studentEntity_hasCorrectSchemaAndTable() {  // TC-ENTITY-01
        Table annotation = Student.class.getAnnotation(Table.class);
        assertThat(annotation).isNotNull();
        assertThat(annotation.schema()).isEqualTo("certify");
        assertThat(annotation.name()).isEqualTo("students");
    }

    @Test
    void studentGraduationDetailEntity_hasCorrectSchemaAndTable() {  // TC-ENTITY-02
        Table annotation = StudentGraduationDetail.class.getAnnotation(Table.class);
        assertThat(annotation).isNotNull();
        assertThat(annotation.schema()).isEqualTo("certify");
        assertThat(annotation.name()).isEqualTo("student_graduation_details");
    }
}
