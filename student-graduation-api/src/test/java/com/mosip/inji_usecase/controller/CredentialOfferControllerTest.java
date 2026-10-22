package com.mosip.inji_usecase.controller;

import com.mosip.inji_usecase.config.SecurityConfig;
import com.mosip.inji_usecase.dto.CredentialOfferTriggerRequest;
import com.mosip.inji_usecase.dto.CredentialOfferTriggerResponse;
import com.mosip.inji_usecase.entity.ApiKey;
import com.mosip.inji_usecase.repository.ApiKeyRepository;
import com.mosip.inji_usecase.security.ApiKeyAuthFilter;
import com.mosip.inji_usecase.service.CredentialOfferService;
import com.mosip.inji_usecase.service.StudentGraduationService;
import com.mosip.inji_usecase.service.StudentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * TC-CCTRL-01 through TC-CCTRL-05
 * Tests the /request-credential endpoint wired into StudentDataController.
 */
@WebMvcTest(StudentDataController.class)
@Import(SecurityConfig.class)
class CredentialOfferControllerTest {

    @Autowired MockMvc mockMvc;
    @MockBean StudentService studentService;
    @MockBean StudentGraduationService graduationService;
    @MockBean CredentialOfferService credentialOfferService;
    @MockBean ApiKeyRepository apiKeyRepository;

    private static final String ADMIN_KEY = "admin-key";

    private void mockAdminKey() {
        String hash = ApiKeyAuthFilter.sha256(ADMIN_KEY);
        ApiKey key = ApiKey.builder().keyHash(hash).name("Admin").role("ADMIN").active(true).build();
        when(apiKeyRepository.findByKeyHashAndActiveTrue(hash)).thenReturn(Optional.of(key));
    }

    @Test
    void requestCredential_returns200_withValidAdminKeyAndEligibleStudent() throws Exception {  // TC-CCTRL-01
        mockAdminKey();

        CredentialOfferTriggerResponse response = new CredentialOfferTriggerResponse();
        response.setStudentId("STU-2022-001");
        response.setCredentialOfferUri("openid-credential-offer://?credential_offer_uri=http%3A//certify/offer/abc");
        response.setExpiresAt(System.currentTimeMillis() + 600_000);

        when(credentialOfferService.triggerCredentialOffer(eq("STU-2022-001"), any()))
            .thenReturn(response);

        mockMvc.perform(post("/api/students/STU-2022-001/request-credential")
            .header("X-API-Key", ADMIN_KEY)
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"expiresInSeconds\": 600, \"txCode\": \"12345\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.studentId").value("STU-2022-001"))
            .andExpect(jsonPath("$.credentialOfferUri").value(org.hamcrest.Matchers.startsWith("openid-credential-offer://")));
    }

    @Test
    void requestCredential_returns404_whenStudentNotFound() throws Exception {  // TC-CCTRL-02
        mockAdminKey();
        when(credentialOfferService.triggerCredentialOffer(eq("STU-UNKNOWN"), any()))
            .thenThrow(new IllegalArgumentException("Student not found: STU-UNKNOWN"));

        mockMvc.perform(post("/api/students/STU-UNKNOWN/request-credential")
            .header("X-API-Key", ADMIN_KEY)
            .contentType(MediaType.APPLICATION_JSON)
            .content("{}"))
            .andExpect(status().isNotFound());
    }

    @Test
    void requestCredential_returns403_whenStudentNotEligible() throws Exception {  // TC-CCTRL-03
        mockAdminKey();
        when(credentialOfferService.triggerCredentialOffer(eq("STU-2023-004"), any()))
            .thenThrow(new IllegalStateException("Student STU-2023-004 is not eligible"));

        mockMvc.perform(post("/api/students/STU-2023-004/request-credential")
            .header("X-API-Key", ADMIN_KEY)
            .contentType(MediaType.APPLICATION_JSON)
            .content("{}"))
            .andExpect(status().isForbidden());
    }

    @Test
    void requestCredential_returns401_withNoApiKey() throws Exception {  // TC-CCTRL-04
        mockMvc.perform(post("/api/students/STU-2022-001/request-credential")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{}"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void requestCredential_works_withNullBody() throws Exception {  // TC-CCTRL-05
        mockAdminKey();
        CredentialOfferTriggerResponse response = new CredentialOfferTriggerResponse();
        response.setStudentId("STU-2022-001");
        response.setCredentialOfferUri("openid-credential-offer://...");
        response.setExpiresAt(System.currentTimeMillis() + 600_000);

        when(credentialOfferService.triggerCredentialOffer(eq("STU-2022-001"), any()))
            .thenReturn(response);

        mockMvc.perform(post("/api/students/STU-2022-001/request-credential")
            .header("X-API-Key", ADMIN_KEY))
            .andExpect(status().isOk());
    }
}
