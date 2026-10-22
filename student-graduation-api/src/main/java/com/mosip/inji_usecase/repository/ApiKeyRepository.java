package com.mosip.inji_usecase.repository;

import com.mosip.inji_usecase.entity.ApiKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApiKeyRepository extends JpaRepository<ApiKey, UUID> {

    Optional<ApiKey> findByKeyHashAndActiveTrue(String keyHash);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE ApiKey k SET k.lastUsedAt = :now WHERE k.keyHash = :hash")
    void updateLastUsed(String hash, LocalDateTime now);
}
