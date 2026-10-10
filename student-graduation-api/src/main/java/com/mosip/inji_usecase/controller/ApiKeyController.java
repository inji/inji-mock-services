package com.mosip.inji_usecase.controller;

import com.mosip.inji_usecase.dto.ApiKeyResponse;
import com.mosip.inji_usecase.dto.CreateApiKeyRequest;
import com.mosip.inji_usecase.service.ApiKeyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/api-keys")
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    /**
     * Create a new API key.
     * The raw key is returned ONCE — store it securely; it cannot be retrieved again.
     */
    @PostMapping
    public ResponseEntity<ApiKeyResponse> createKey(@Valid @RequestBody CreateApiKeyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(apiKeyService.createApiKey(request));
    }

    /**
     * Revoke an API key by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> revokeKey(@PathVariable UUID id) {
        apiKeyService.revokeApiKey(id);
        return ResponseEntity.noContent().build();
    }
}
