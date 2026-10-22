package com.mosip.inji_usecase.service;

import com.mosip.inji_usecase.dto.ApiKeyResponse;
import com.mosip.inji_usecase.dto.CreateApiKeyRequest;
import com.mosip.inji_usecase.entity.ApiKey;
import com.mosip.inji_usecase.repository.ApiKeyRepository;
import com.mosip.inji_usecase.security.ApiKeyAuthFilter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Transactional
    public ApiKeyResponse createApiKey(CreateApiKeyRequest request) {
        // Generate cryptographically secure 32-byte key, Base64URL-encoded
        byte[] keyBytes = new byte[32];
        SECURE_RANDOM.nextBytes(keyBytes);
        String rawKey = Base64.getUrlEncoder().withoutPadding().encodeToString(keyBytes);
        String keyHash = ApiKeyAuthFilter.sha256(rawKey);

        ApiKey entity = ApiKey.builder()
                .keyHash(keyHash)
                .name(request.getName())
                .role(request.getRole() != null ? request.getRole() : "ADMIN")
                .active(true)
                .expiresAt(request.getExpiresAt())
                .build();

        ApiKey saved = apiKeyRepository.save(entity);
        log.info("Created API key '{}' with role {}", saved.getName(), saved.getRole());

        ApiKeyResponse response = toResponse(saved);
        response.setRawKey(rawKey); // shown only once!
        return response;
    }

    @Transactional
    public void revokeApiKey(UUID id) {
        ApiKey key = apiKeyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("API key not found: " + id));
        key.setActive(false); // setActive() from Lombok @Data on "boolean active" field
        apiKeyRepository.save(key);
        log.info("Revoked API key: {}", key.getName());
    }

    private ApiKeyResponse toResponse(ApiKey entity) {
        ApiKeyResponse r = new ApiKeyResponse();
        r.setId(entity.getId());
        r.setName(entity.getName());
        r.setRole(entity.getRole());
        r.setActive(entity.isActive()); // isActive() correct getter for "boolean active"
        r.setCreatedAt(entity.getCreatedAt());
        r.setExpiresAt(entity.getExpiresAt());
        r.setLastUsedAt(entity.getLastUsedAt());
        return r;
    }
}
