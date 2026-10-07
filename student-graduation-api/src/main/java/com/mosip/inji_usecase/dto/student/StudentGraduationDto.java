package com.mosip.inji_usecase.dto.student;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentGraduationDto {

    private UUID id;

    private UUID studentId;

    // Read-only fields populated from the student record
    private String studentIdCode;
    private String studentName;

    @NotBlank(message = "Registration number is required")
    @Size(max = 50, message = "Registration number must not exceed 50 characters")
    private String registrationNumber;

    @NotBlank(message = "Degree title is required")
    @Size(max = 200, message = "Degree title must not exceed 200 characters")
    private String degreeTitle;

    @Min(value = 1, message = "Graduation month must be between 1 and 12")
    @Max(value = 12, message = "Graduation month must be between 1 and 12")
    private Short graduationMonth;

    @NotNull(message = "Graduation year is required")
    private Integer graduationYear;

    @Size(max = 100, message = "Classification must not exceed 100 characters")
    private String classification;


    private String certificateStatus;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
