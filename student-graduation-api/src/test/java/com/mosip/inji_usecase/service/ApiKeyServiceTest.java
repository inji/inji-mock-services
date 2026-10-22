package com.mosip.inji_usecase.service;

import com.mosip.inji_usecase.dto.ApiKeyResponse;
import com.mosip.inji_usecase.dto.CreateApiKeyRequest;
import com.mosip.inji_usecase.entity.ApiKey;
import com.mosip.inji_usecase.repository.ApiKeyRepository;
import com.mosip.inji_usecase.security.ApiKeyAuthFilter;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * TC-SERVICE-01 through TC-SERVICE-07
 */
@ExtendWith(MockitoExtension.class)
class ApiKeyServiceTest {

    @Mock
    private ApiKeyRepository apiKeyRepository;

    @InjectMocks
    private ApiKeyService apiKeyService;

    @Test
    void createApiKey_returnsRawKeyOnlyOnCreation() {  // TC-SERVICE-01
        CreateApiKeyRequest req = new CreateApiKeyRequest();
        req.setName("Test Key");
        req.setRole("ADMIN");

        when(apiKeyRepository.save(any())).thenAnswer(inv -> {
            ApiKey k = inv.getArgument(0);
            return k;
        });

        ApiKeyResponse response = apiKeyService.createApiKey(req);

        assertThat(response.getRawKey()).isNotBlank();
        assertThat(response.getRawKey()).hasSizeGreaterThanOrEqualTo(40);  // Base64URL of 32 bytes ≈ 43 chars
        assertThat(response.getName()).isEqualTo("Test Key");
        assertThat(response.getRole()).isEqualTo("ADMIN");
        assertThat(response.isActive()).isTrue();
    }

    @Test
    void createApiKey_storesHashNotRawKey() {  // TC-SERVICE-02
        CreateApiKeyRequest req = new CreateApiKeyRequest();
        req.setName("Key");

        ArgumentCaptor<ApiKey> captor = ArgumentCaptor.forClass(ApiKey.class);
        when(apiKeyRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ApiKeyResponse response = apiKeyService.createApiKey(req);
        verify(apiKeyRepository).save(captor.capture());

        String storedHash = captor.getValue().getKeyHash();
        String rawKey = response.getRawKey();

        // The stored hash must be the SHA-256 of the raw key
        assertThat(storedHash).isEqualTo(ApiKeyAuthFilter.sha256(rawKey));
        // The raw key must NOT be stored
        assertThat(storedHash).isNotEqualTo(rawKey);
    }

    @Test
    void createApiKey_twoCallsProduceDifferentKeys() {  // TC-SERVICE-03
        CreateApiKeyRequest req = new CreateApiKeyRequest();
        req.setName("Key");
        when(apiKeyRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ApiKeyResponse r1 = apiKeyService.createApiKey(req);
        ApiKeyResponse r2 = apiKeyService.createApiKey(req);

        assertThat(r1.getRawKey()).isNotEqualTo(r2.getRawKey());
    }

    @Test
    void revokeApiKey_setsActiveFalse() {  // TC-SERVICE-04
        UUID id = UUID.randomUUID();
        ApiKey key = ApiKey.builder().id(id).name("K").active(true).build();
        when(apiKeyRepository.findById(id)).thenReturn(Optional.of(key));
        when(apiKeyRepository.save(any())).thenReturn(key);

        apiKeyService.revokeApiKey(id);

        assertThat(key.isActive()).isFalse();
        verify(apiKeyRepository).save(key);
    }

    @Test
    void revokeApiKey_throwsWhenKeyNotFound() {  // TC-SERVICE-05
        UUID id = UUID.randomUUID();
        when(apiKeyRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> apiKeyService.revokeApiKey(id))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining(id.toString());
    }

    @Test
    void createApiKey_defaultsRoleToAdmin_whenRoleIsNull() {  // TC-SERVICE-06
        CreateApiKeyRequest req = new CreateApiKeyRequest();
        req.setName("Key");
        req.setRole(null);  // explicitly null

        ArgumentCaptor<ApiKey> captor = ArgumentCaptor.forClass(ApiKey.class);
        when(apiKeyRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        apiKeyService.createApiKey(req);
        verify(apiKeyRepository).save(captor.capture());
        assertThat(captor.getValue().getRole()).isEqualTo("ADMIN");
    }

    @Test
    void createApiKey_respectsStudentRole() {  // TC-SERVICE-07
        CreateApiKeyRequest req = new CreateApiKeyRequest();
        req.setName("Student Key");
        req.setRole("STUDENT");

        ArgumentCaptor<ApiKey> captor = ArgumentCaptor.forClass(ApiKey.class);
        when(apiKeyRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        apiKeyService.createApiKey(req);
        verify(apiKeyRepository).save(captor.capture());
        assertThat(captor.getValue().getRole()).isEqualTo("STUDENT");
    }
}
