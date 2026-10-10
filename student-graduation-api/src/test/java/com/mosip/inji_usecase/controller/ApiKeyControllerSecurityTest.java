package com.mosip.inji_usecase.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosip.inji_usecase.config.SecurityConfig;
import com.mosip.inji_usecase.dto.ApiKeyResponse;
import com.mosip.inji_usecase.dto.CreateApiKeyRequest;
import com.mosip.inji_usecase.entity.ApiKey;
import com.mosip.inji_usecase.repository.ApiKeyRepository;
import com.mosip.inji_usecase.security.ApiKeyAuthFilter;
import com.mosip.inji_usecase.service.ApiKeyService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * TC-CTRL-01 through TC-CTRL-07
 * @WebMvcTest loads only the web layer — no DB, full security filter applied.
 */
@WebMvcTest(ApiKeyController.class)
@Import(SecurityConfig.class)
class ApiKeyControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ApiKeyService apiKeyService;

    @MockBean
    private ApiKeyRepository apiKeyRepository;  // needed by SecurityConfig's filter

    private static final String ADMIN_RAW_KEY = "test-admin-raw-key";
    private static final String STUDENT_RAW_KEY = "test-student-raw-key";

    private void mockApiKey(String rawKey, String role) {
        String hash = ApiKeyAuthFilter.sha256(rawKey);
        ApiKey key = ApiKey.builder()
            .keyHash(hash).name("Test").role(role).active(true).build();
        when(apiKeyRepository.findByKeyHashAndActiveTrue(hash))
            .thenReturn(Optional.of(key));
    }

    @Test
    void createKey_returns401_withNoApiKey() throws Exception {  // TC-CTRL-01
        mockMvc.perform(post("/api/admin/api-keys")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(new CreateApiKeyRequest())))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void createKey_returns403_withStudentRoleKey() throws Exception {  // TC-CTRL-02
        mockApiKey(STUDENT_RAW_KEY, "STUDENT");
        mockMvc.perform(post("/api/admin/api-keys")
            .header("X-API-Key", STUDENT_RAW_KEY)
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\": \"New Key\"}"))
            .andExpect(status().isForbidden());
    }

    @Test
    void createKey_returns201_withAdminRoleKey() throws Exception {  // TC-CTRL-03
        mockApiKey(ADMIN_RAW_KEY, "ADMIN");

        ApiKeyResponse mockResponse = new ApiKeyResponse();
        mockResponse.setId(UUID.randomUUID());
        mockResponse.setName("New Key");
        mockResponse.setRole("ADMIN");
        mockResponse.setActive(true);
        mockResponse.setRawKey("some-generated-raw-key");
        when(apiKeyService.createApiKey(any())).thenReturn(mockResponse);

        mockMvc.perform(post("/api/admin/api-keys")
            .header("X-API-Key", ADMIN_RAW_KEY)
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\": \"New Key\", \"role\": \"ADMIN\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.rawKey").value("some-generated-raw-key"))
            .andExpect(jsonPath("$.name").value("New Key"));
    }

    @Test
    void revokeKey_returns204_withAdminKey() throws Exception {  // TC-CTRL-04
        mockApiKey(ADMIN_RAW_KEY, "ADMIN");
        UUID keyId = UUID.randomUUID();

        mockMvc.perform(delete("/api/admin/api-keys/" + keyId)
            .header("X-API-Key", ADMIN_RAW_KEY))
            .andExpect(status().isNoContent());
    }

    @Test
    void revokeKey_returns401_withNoKey() throws Exception {  // TC-CTRL-05
        mockMvc.perform(delete("/api/admin/api-keys/" + UUID.randomUUID()))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void createKey_returns400_whenNameIsBlank() throws Exception {  // TC-CTRL-06
        mockApiKey(ADMIN_RAW_KEY, "ADMIN");
        mockMvc.perform(post("/api/admin/api-keys")
            .header("X-API-Key", ADMIN_RAW_KEY)
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\": \"\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    void createKey_returns400_whenRoleIsInvalid() throws Exception {  // TC-CTRL-07
        mockApiKey(ADMIN_RAW_KEY, "ADMIN");
        mockMvc.perform(post("/api/admin/api-keys")
            .header("X-API-Key", ADMIN_RAW_KEY)
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\": \"K\", \"role\": \"SUPERUSER\"}"))
            .andExpect(status().isBadRequest());
    }
}
