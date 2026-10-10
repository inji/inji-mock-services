package com.mosip.inji_usecase.security;

import com.mosip.inji_usecase.entity.ApiKey;
import com.mosip.inji_usecase.repository.ApiKeyRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HexFormat;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
public class ApiKeyAuthFilter extends OncePerRequestFilter {

    public static final String API_KEY_HEADER = "X-API-Key";

    private final ApiKeyRepository apiKeyRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String rawKey = request.getHeader(API_KEY_HEADER);

        if (rawKey == null || rawKey.isBlank()) {
            sendUnauthorized(response, "Missing X-API-Key header");
            return;
        }

        String keyHash = sha256(rawKey);
        Optional<ApiKey> apiKeyOpt = apiKeyRepository.findByKeyHashAndActiveTrue(keyHash);

        if (apiKeyOpt.isEmpty()) {
            log.warn("Invalid or inactive API key attempt from {}", request.getRemoteAddr());
            sendUnauthorized(response, "Invalid or inactive API key");
            return;
        }

        ApiKey apiKey = apiKeyOpt.get();

        // Check expiry
        if (apiKey.getExpiresAt() != null && LocalDateTime.now().isAfter(apiKey.getExpiresAt())) {
            log.warn("Expired API key used: {}", apiKey.getName());
            sendUnauthorized(response, "API key has expired");
            return;
        }

        // Update last used timestamp (best-effort)
        try {
            apiKeyRepository.updateLastUsed(keyHash, LocalDateTime.now());
        } catch (Exception e) {
            log.warn("Could not update last_used_at for key '{}': {}", apiKey.getName(), e.getMessage());
        }

        // Set authentication in security context with ROLE_ prefix
        var auth = new UsernamePasswordAuthenticationToken(
                apiKey.getName(),
                null,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + apiKey.getRole()))
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        filterChain.doFilter(request, response);
    }

    private void sendUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write(
            "{\"status\":\"error\",\"message\":\"" + message + "\"}"
        );
    }

    /**
     * Compute SHA-256 hex digest of input string.
     * Used both here (for validation) and in ApiKeyService (for key creation).
     */
    public static String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
