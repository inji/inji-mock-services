package com.mosip.inji_usecase.service;

import com.mosip.inji_usecase.dto.CredentialOfferTriggerRequest;
import com.mosip.inji_usecase.dto.CredentialOfferTriggerResponse;
import com.mosip.inji_usecase.entity.student.StudentGraduationDetail;
import com.mosip.inji_usecase.repository.student.StudentGraduationRepository;
import com.mosip.inji_usecase.repository.student.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CredentialOfferService {

    private final StudentRepository studentRepository;
    private final StudentGraduationRepository graduationRepository;
    private final RestTemplate restTemplate;

    @Value("${certify.pre-auth-endpoint}")
    private String certifyPreAuthEndpoint;

    @Transactional(readOnly = true)
    public CredentialOfferTriggerResponse triggerCredentialOffer(String studentId,
                                                                 CredentialOfferTriggerRequest request) {
        // 1. Verify student exists
        var student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Student not found: " + studentId));

        // 2. Use repository to avoid LazyInitializationException
        List<StudentGraduationDetail> graduations =
                graduationRepository.findByStudentId(student.getId());

        if (graduations.isEmpty()) {
            throw new IllegalStateException(
                    "Student " + studentId + " is not eligible: no graduation record found");
        }

        StudentGraduationDetail gradDetail = graduations.get(0);
        if (!"ISSUED".equalsIgnoreCase(gradDetail.getCertificateStatus()) ||
            gradDetail.getGraduationMonth() == null ||
            gradDetail.getClassification() == null ||
            gradDetail.getClassification().isBlank()) {
            throw new IllegalStateException(
                    "Student " + studentId + " is not eligible: graduation details (graduation month and classification) have not been completed by the administration yet");
        }


        // 3. Build the request body for Certify's /pre-authorized-data
        Map<String, Object> claims = new HashMap<>();
        claims.put("studentId", studentId);

        Map<String, Object> certifyBody = new HashMap<>();
        certifyBody.put("credential_configuration_id", "StudentGraduationCredential");
        certifyBody.put("claims", claims);
        certifyBody.put("expires_in",
                request.getExpiresInSeconds() != null ? request.getExpiresInSeconds() : 600);
        if (request.getTxCode() != null && !request.getTxCode().isBlank()) {
            certifyBody.put("tx_code", request.getTxCode());
        }

        // 4. Call Certify machine-to-machine
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(certifyBody, headers);

        log.info("Calling Certify pre-auth endpoint for student {}", studentId);
        ResponseEntity<Map> certifyResponse;
        try {
            certifyResponse = restTemplate.exchange(
                    certifyPreAuthEndpoint, HttpMethod.POST, entity, Map.class);
        } catch (Exception e) {
            log.error("Failed to call Certify at {}: {}", certifyPreAuthEndpoint, e.getMessage());
            throw new RuntimeException("Failed to reach Certify service: " + e.getMessage(), e);
        }

        if (!certifyResponse.getStatusCode().is2xxSuccessful() ||
                certifyResponse.getBody() == null) {
            throw new RuntimeException(
                    "Certify returned error: " + certifyResponse.getStatusCode());
        }

        // 5. Extract credential_offer_uri from Certify response
        String offerUri = (String) certifyResponse.getBody().get("credential_offer_uri");
        if (offerUri == null) {
            throw new RuntimeException(
                    "Certify response missing 'credential_offer_uri' field");
        }

        // 6. Build and return response
        CredentialOfferTriggerResponse result = new CredentialOfferTriggerResponse();
        result.setStudentId(studentId);
        result.setCredentialOfferUri(offerUri);
        result.setExpiresAt(System.currentTimeMillis() +
                ((request.getExpiresInSeconds() != null
                  ? request.getExpiresInSeconds() : 600) * 1000L));
        return result;
    }
}
