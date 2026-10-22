package com.mosip.inji_usecase.service;

import com.mosip.inji_usecase.dto.CredentialOfferTriggerRequest;
import com.mosip.inji_usecase.dto.CredentialOfferTriggerResponse;
import com.mosip.inji_usecase.entity.student.Student;
import com.mosip.inji_usecase.entity.student.StudentGraduationDetail;
import com.mosip.inji_usecase.repository.student.StudentGraduationRepository;
import com.mosip.inji_usecase.repository.student.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * TC-OFFER-01 through TC-OFFER-07
 */
@ExtendWith(MockitoExtension.class)
class CredentialOfferServiceTest {

    @Mock private StudentRepository studentRepository;
    @Mock private StudentGraduationRepository graduationRepository;
    @Mock private RestTemplate restTemplate;

    @InjectMocks
    private CredentialOfferService credentialOfferService;

    private static final String STUDENT_ID = "STU-2022-001";
    private static final UUID STUDENT_UUID = UUID.fromString("a1b2c3d4-e5f6-7890-abcd-ef1234567801");

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(credentialOfferService,
            "certifyPreAuthEndpoint",
            "http://certify/v1/certify/pre-authorized-data");
    }

    private Student mockStudent() {
        return Student.builder().id(STUDENT_UUID).studentId(STUDENT_ID).fullName("Aarav").build();
    }

    private StudentGraduationDetail mockGrad() {
        return StudentGraduationDetail.builder()
            .id(UUID.randomUUID())
            .registrationNumber("REG-001")
            .degreeTitle("B.Tech CS")
            .graduationMonth((short)6)
            .graduationYear(2026)
            .classification("First Class")
            .build();
    }

    @Test
    void triggerOffer_throwsIllegalArgument_whenStudentNotFound() {  // TC-OFFER-01
        when(studentRepository.findByStudentId(STUDENT_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() ->
            credentialOfferService.triggerCredentialOffer(STUDENT_ID, new CredentialOfferTriggerRequest())
        ).isInstanceOf(IllegalArgumentException.class)
         .hasMessageContaining(STUDENT_ID);
    }

    @Test
    void triggerOffer_throwsIllegalState_whenNoGraduationRecords() {  // TC-OFFER-02
        when(studentRepository.findByStudentId(STUDENT_ID))
            .thenReturn(Optional.of(mockStudent()));
        when(graduationRepository.findByStudentId(STUDENT_UUID))
            .thenReturn(Collections.emptyList());  // no graduation records

        assertThatThrownBy(() ->
            credentialOfferService.triggerCredentialOffer(STUDENT_ID, new CredentialOfferTriggerRequest())
        ).isInstanceOf(IllegalStateException.class)
         .hasMessageContaining("not eligible");
    }

    @Test
    void triggerOffer_callsCertify_andReturnsUri() {  // TC-OFFER-03
        when(studentRepository.findByStudentId(STUDENT_ID))
            .thenReturn(Optional.of(mockStudent()));
        when(graduationRepository.findByStudentId(STUDENT_UUID))
            .thenReturn(List.of(mockGrad()));

        Map<String, Object> certifyBody = Map.of(
            "credential_offer_uri",
            "openid-credential-offer://?credential_offer_uri=http%3A//certify/offer/123"
        );
        when(restTemplate.exchange(anyString(), any(), any(), eq(Map.class)))
            .thenReturn(ResponseEntity.ok(certifyBody));

        CredentialOfferTriggerResponse result =
            credentialOfferService.triggerCredentialOffer(STUDENT_ID, new CredentialOfferTriggerRequest());

        assertThat(result.getStudentId()).isEqualTo(STUDENT_ID);
        assertThat(result.getCredentialOfferUri()).startsWith("openid-credential-offer://");
        assertThat(result.getExpiresAt()).isGreaterThan(System.currentTimeMillis());
    }

    @Test
    void triggerOffer_throwsRuntime_whenCertifyFails() {  // TC-OFFER-04
        when(studentRepository.findByStudentId(STUDENT_ID))
            .thenReturn(Optional.of(mockStudent()));
        when(graduationRepository.findByStudentId(STUDENT_UUID))
            .thenReturn(List.of(mockGrad()));
        when(restTemplate.exchange(anyString(), any(), any(), eq(Map.class)))
            .thenThrow(new RuntimeException("Connection refused"));

        assertThatThrownBy(() ->
            credentialOfferService.triggerCredentialOffer(STUDENT_ID, new CredentialOfferTriggerRequest())
        ).isInstanceOf(RuntimeException.class)
         .hasMessageContaining("Failed to reach Certify");
    }

    @Test
    void triggerOffer_throwsRuntime_whenCertifyResponseMissingUri() {  // TC-OFFER-05
        when(studentRepository.findByStudentId(STUDENT_ID))
            .thenReturn(Optional.of(mockStudent()));
        when(graduationRepository.findByStudentId(STUDENT_UUID))
            .thenReturn(List.of(mockGrad()));
        when(restTemplate.exchange(anyString(), any(), any(), eq(Map.class)))
            .thenReturn(ResponseEntity.ok(Map.of("some_other_field", "value")));

        assertThatThrownBy(() ->
            credentialOfferService.triggerCredentialOffer(STUDENT_ID, new CredentialOfferTriggerRequest())
        ).isInstanceOf(RuntimeException.class)
         .hasMessageContaining("credential_offer_uri");
    }

    @Test
    void triggerOffer_sendsStudentIdInClaims() {  // TC-OFFER-06
        when(studentRepository.findByStudentId(STUDENT_ID))
            .thenReturn(Optional.of(mockStudent()));
        when(graduationRepository.findByStudentId(STUDENT_UUID))
            .thenReturn(List.of(mockGrad()));

        var bodyCaptor = org.mockito.ArgumentCaptor.forClass(org.springframework.http.HttpEntity.class);
        Map<String, Object> certifyBody = Map.of("credential_offer_uri", "openid-credential-offer://...");
        when(restTemplate.exchange(anyString(), any(), bodyCaptor.capture(), eq(Map.class)))
            .thenReturn(ResponseEntity.ok(certifyBody));

        credentialOfferService.triggerCredentialOffer(STUDENT_ID, new CredentialOfferTriggerRequest());

        @SuppressWarnings("unchecked")
        Map<String, Object> sentBody = (Map<String, Object>) bodyCaptor.getValue().getBody();
        assertThat(sentBody).containsKey("credential_configuration_id");
        assertThat(sentBody.get("credential_configuration_id"))
            .isEqualTo("StudentGraduationCredential");
        @SuppressWarnings("unchecked")
        Map<String, Object> claims = (Map<String, Object>) sentBody.get("claims");
        assertThat(claims.get("studentId")).isEqualTo(STUDENT_ID);
    }

    @Test
    void triggerOffer_sendsTxCode_whenProvided() {  // TC-OFFER-07
        when(studentRepository.findByStudentId(STUDENT_ID))
            .thenReturn(Optional.of(mockStudent()));
        when(graduationRepository.findByStudentId(STUDENT_UUID))
            .thenReturn(List.of(mockGrad()));

        var bodyCaptor = org.mockito.ArgumentCaptor.forClass(org.springframework.http.HttpEntity.class);
        Map<String, Object> certifyBody = Map.of("credential_offer_uri", "openid-credential-offer://...");
        when(restTemplate.exchange(anyString(), any(), bodyCaptor.capture(), eq(Map.class)))
            .thenReturn(ResponseEntity.ok(certifyBody));

        CredentialOfferTriggerRequest req = new CredentialOfferTriggerRequest();
        req.setTxCode("12345");
        credentialOfferService.triggerCredentialOffer(STUDENT_ID, req);

        @SuppressWarnings("unchecked")
        Map<String, Object> sentBody = (Map<String, Object>) bodyCaptor.getValue().getBody();
        assertThat(sentBody.get("tx_code")).isEqualTo("12345");
    }
}
