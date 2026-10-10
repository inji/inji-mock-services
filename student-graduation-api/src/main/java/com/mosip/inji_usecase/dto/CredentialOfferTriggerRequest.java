package com.mosip.inji_usecase.dto;

import lombok.Data;

@Data
public class CredentialOfferTriggerRequest {
    private Integer expiresInSeconds = 600;  // default 10 min
    private String txCode;                    // optional PIN (4–8 alphanumeric)
}
