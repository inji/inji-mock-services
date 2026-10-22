package com.mosip.inji_usecase.mapper.student;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.mosip.inji_usecase.dto.student.StudentGraduationDto;
import com.mosip.inji_usecase.entity.student.StudentGraduationDetail;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface StudentGraduationMapper {

    @Mapping(target = "student", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    StudentGraduationDetail toEntity(StudentGraduationDto dto);

    @Mapping(source = "student.id", target = "studentId")
    @Mapping(source = "student.studentId", target = "studentIdCode")
    @Mapping(source = "student.fullName", target = "studentName")
    StudentGraduationDto toDto(StudentGraduationDetail entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "student", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(StudentGraduationDto dto, @MappingTarget StudentGraduationDetail entity);
}
