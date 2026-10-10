package com.mosip.inji_usecase.config;

import com.mosip.inji_usecase.repository.ApiKeyRepository;
import com.mosip.inji_usecase.security.ApiKeyAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final ApiKeyRepository apiKeyRepository;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(
                new ApiKeyAuthFilter(apiKeyRepository),
                UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                // API key management — ADMIN only
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                // Write operations on students/graduation — ADMIN only
                .requestMatchers(HttpMethod.POST,   "/api/students").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/api/students/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/students/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST,   "/api/students/*/graduation").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/api/graduation/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/graduation/**").hasRole("ADMIN")
                // Credential trigger — ADMIN or STUDENT
                .requestMatchers(HttpMethod.POST, "/api/students/*/request-credential")
                    .hasAnyRole("ADMIN", "STUDENT")
                // All GET requests — any authenticated key
                .requestMatchers(HttpMethod.GET, "/api/**").authenticated()
                // Everything else — deny unless authenticated
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
