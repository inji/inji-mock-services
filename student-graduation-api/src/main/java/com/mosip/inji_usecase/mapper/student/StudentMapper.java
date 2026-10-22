package com.mosip.inji_usecase.mapper.student;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.mosip.inji_usecase.dto.student.StudentDto;
import com.mosip.inji_usecase.entity.student.Student;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface StudentMapper {

    @Mapping(target = "graduationDetails", ignore = true)
    Student toEntity(StudentDto dto);

    @Mapping(target = "graduationDetails", ignore = true)
    @Mapping(target = "registrationNumber", ignore = true)
    StudentDto toDto(Student entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "graduationDetails", ignore = true)
    void updateEntityFromDto(StudentDto dto, @MappingTarget Student entity);
}
