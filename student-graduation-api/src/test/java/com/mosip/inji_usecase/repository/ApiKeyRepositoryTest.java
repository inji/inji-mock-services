package com.mosip.inji_usecase.repository;

import com.mosip.inji_usecase.entity.ApiKey;
import com.mosip.inji_usecase.security.ApiKeyAuthFilter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.test.context.TestPropertySource;

/**
 * TC-REPO-01 through TC-REPO-05
 * @DataJpaTest spins up H2 + JPA only — no web layer, no security.
 */
@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;INIT=CREATE SCHEMA IF NOT EXISTS certify"
})
class ApiKeyRepositoryTest {

    @Autowired
    private ApiKeyRepository apiKeyRepository;

    private static final String RAW_KEY = "test-raw-key-value";
    private static final String KEY_HASH = ApiKeyAuthFilter.sha256(RAW_KEY);

    private ApiKey saveActiveKey() {
        return apiKeyRepository.save(
            ApiKey.builder()
                .keyHash(KEY_HASH)
                .name("Test Key")
                .role("ADMIN")
                .active(true)
                .build()
        );
    }

    @Test
    void findByKeyHashAndActiveTrue_findsActiveKey() {  // TC-REPO-01
        saveActiveKey();
        Optional<ApiKey> result = apiKeyRepository.findByKeyHashAndActiveTrue(KEY_HASH);
        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Test Key");
        assertThat(result.get().isActive()).isTrue();
    }

    @Test
    void findByKeyHashAndActiveTrue_returnsEmptyForInactiveKey() {  // TC-REPO-02
        ApiKey key = saveActiveKey();
        key.setActive(false);
        apiKeyRepository.save(key);

        Optional<ApiKey> result = apiKeyRepository.findByKeyHashAndActiveTrue(KEY_HASH);
        assertThat(result).isEmpty();
    }

    @Test
    void findByKeyHashAndActiveTrue_returnsEmptyForWrongHash() {  // TC-REPO-03
        saveActiveKey();
        Optional<ApiKey> result = apiKeyRepository.findByKeyHashAndActiveTrue("wrong-hash");
        assertThat(result).isEmpty();
    }

    @Test
    void updateLastUsed_updatesTimestamp() {  // TC-REPO-04
        saveActiveKey();
        LocalDateTime before = LocalDateTime.now();
        apiKeyRepository.updateLastUsed(KEY_HASH, LocalDateTime.now().plusSeconds(1));

        ApiKey found = apiKeyRepository.findByKeyHashAndActiveTrue(KEY_HASH).orElseThrow();
        assertThat(found.getLastUsedAt()).isNotNull();
        assertThat(found.getLastUsedAt()).isAfterOrEqualTo(before);
    }

    @Test
    void uniqueConstraint_preventsduplicateKeyHash() {  // TC-REPO-05
        saveActiveKey();
        ApiKey duplicate = ApiKey.builder()
            .keyHash(KEY_HASH)  // same hash
            .name("Duplicate")
            .active(true)
            .build();
        org.junit.jupiter.api.Assertions.assertThrows(
            Exception.class,
            () -> apiKeyRepository.saveAndFlush(duplicate)
        );
    }
}
