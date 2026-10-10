package com.mosip.inji_usecase.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreateApiKeyRequest {

    @NotBlank(message = "Key name is required")
    private String name;

    @Pattern(regexp = "ADMIN|STUDENT", message = "Role must be ADMIN or STUDENT")
    private String role = "ADMIN";

    private LocalDateTime expiresAt; // null = never expires
}
