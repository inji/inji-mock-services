package com.mosip.inji_usecase.dto;

import lombok.Data;

@Data
public class CredentialOfferTriggerResponse {
    private String studentId;
    private String credentialOfferUri;  // openid-credential-offer://...
    private long expiresAt;             // epoch millis
}
