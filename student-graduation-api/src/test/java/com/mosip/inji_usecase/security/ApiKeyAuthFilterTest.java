package com.mosip.inji_usecase.security;

import com.mosip.inji_usecase.entity.ApiKey;
import com.mosip.inji_usecase.repository.ApiKeyRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * TC-FILTER-01 through TC-FILTER-08
 * Pure unit tests — no Spring context, no DB.
 */
@ExtendWith(MockitoExtension.class)
class ApiKeyAuthFilterTest {

    @Mock
    private ApiKeyRepository apiKeyRepository;

    @Mock
    private FilterChain filterChain;

    private ApiKeyAuthFilter filter;

    @BeforeEach
    void setUp() {
        filter = new ApiKeyAuthFilter(apiKeyRepository);
        SecurityContextHolder.clearContext();
    }

    // --- SHA-256 utility ---

    @Test
    void sha256_producesCorrect64CharHex() {  // TC-FILTER-01
        String hash = ApiKeyAuthFilter.sha256("hello");
        assertThat(hash).hasSize(64);
        assertThat(hash).matches("[0-9a-f]+");
    }

    @Test
    void sha256_isSameForSameInput() {  // TC-FILTER-02
        assertThat(ApiKeyAuthFilter.sha256("key"))
            .isEqualTo(ApiKeyAuthFilter.sha256("key"));
    }

    @Test
    void sha256_isDifferentForDifferentInputs() {  // TC-FILTER-03
        assertThat(ApiKeyAuthFilter.sha256("key1"))
            .isNotEqualTo(ApiKeyAuthFilter.sha256("key2"));
    }

    // --- Filter behaviour ---

    @Test
    void filter_returns401_whenNoApiKeyHeader() throws Exception {  // TC-FILTER-04
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, filterChain);

        assertThat(response.getStatus()).isEqualTo(HttpServletResponse.SC_UNAUTHORIZED);
        assertThat(response.getContentAsString()).contains("Missing X-API-Key header");
        verifyNoInteractions(filterChain);
    }

    @Test
    void filter_returns401_whenKeyNotFoundInDB() throws Exception {  // TC-FILTER-05
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("X-API-Key", "invalid-key");
        MockHttpServletResponse response = new MockHttpServletResponse();

        when(apiKeyRepository.findByKeyHashAndActiveTrue(anyString()))
            .thenReturn(Optional.empty());

        filter.doFilter(request, response, filterChain);

        assertThat(response.getStatus()).isEqualTo(401);
        assertThat(response.getContentAsString()).contains("Invalid or inactive API key");
        verifyNoInteractions(filterChain);
    }

    @Test
    void filter_returns401_whenKeyIsExpired() throws Exception {  // TC-FILTER-06
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("X-API-Key", "some-key");
        MockHttpServletResponse response = new MockHttpServletResponse();

        ApiKey expiredKey = ApiKey.builder()
            .keyHash(ApiKeyAuthFilter.sha256("some-key"))
            .name("Expired")
            .role("ADMIN")
            .active(true)
            .expiresAt(LocalDateTime.now().minusHours(1))  // expired 1 hour ago
            .build();
        when(apiKeyRepository.findByKeyHashAndActiveTrue(anyString()))
            .thenReturn(Optional.of(expiredKey));

        filter.doFilter(request, response, filterChain);

        assertThat(response.getStatus()).isEqualTo(401);
        assertThat(response.getContentAsString()).contains("expired");
        verifyNoInteractions(filterChain);
    }

    @Test
    void filter_setsSecurityContext_andCallsChain_withValidKey() throws Exception {  // TC-FILTER-07
        String rawKey = "valid-key";
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("X-API-Key", rawKey);
        MockHttpServletResponse response = new MockHttpServletResponse();

        ApiKey validKey = ApiKey.builder()
            .keyHash(ApiKeyAuthFilter.sha256(rawKey))
            .name("Admin Portal")
            .role("ADMIN")
            .active(true)
            .build();
        when(apiKeyRepository.findByKeyHashAndActiveTrue(anyString()))
            .thenReturn(Optional.of(validKey));
        doNothing().when(apiKeyRepository).updateLastUsed(any(), any());

        filter.doFilter(request, response, filterChain);

        assertThat(response.getStatus()).isEqualTo(200);  // not 401
        verify(filterChain, times(1)).doFilter(request, response);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
        assertThat(SecurityContextHolder.getContext().getAuthentication().getName())
            .isEqualTo("Admin Portal");
        assertThat(SecurityContextHolder.getContext().getAuthentication().getAuthorities())
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    @Test
    void filter_allowsNonExpiredKey_withFutureExpiresAt() throws Exception {  // TC-FILTER-08
        String rawKey = "future-key";
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("X-API-Key", rawKey);
        MockHttpServletResponse response = new MockHttpServletResponse();

        ApiKey validKey = ApiKey.builder()
            .keyHash(ApiKeyAuthFilter.sha256(rawKey))
            .name("Future Key")
            .role("STUDENT")
            .active(true)
            .expiresAt(LocalDateTime.now().plusDays(30))  // valid for 30 days
            .build();
        when(apiKeyRepository.findByKeyHashAndActiveTrue(anyString()))
            .thenReturn(Optional.of(validKey));
        doNothing().when(apiKeyRepository).updateLastUsed(any(), any());

        filter.doFilter(request, response, filterChain);

        assertThat(response.getStatus()).isEqualTo(200);
        verify(filterChain, times(1)).doFilter(request, response);
        assertThat(SecurityContextHolder.getContext().getAuthentication().getAuthorities())
            .anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT"));
    }
}
