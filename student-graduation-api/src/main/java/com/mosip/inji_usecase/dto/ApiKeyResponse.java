package com.mosip.inji_usecase.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ApiKeyResponse {
    private UUID id;
    private String name;
    private String role;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private LocalDateTime lastUsedAt;
    // Only populated at creation time, never persisted:
    private String rawKey;
}
