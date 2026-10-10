package com.mosip.inji_usecase.entity;

import org.junit.jupiter.api.Test;
import java.lang.reflect.Method;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * TC-LOMBOK-01 through TC-LOMBOK-04
 * Verifies Lombok generates correct getter/setter for boolean `active` field.
 * Guards against the isIsActive() double-is bug.
 */
class ApiKeyLombokTest {

    @Test
    void booleanActive_generatesIsActiveGetter() throws NoSuchMethodException {  // TC-LOMBOK-01
        Method getter = ApiKey.class.getMethod("isActive");
        assertThat(getter.getReturnType()).isEqualTo(boolean.class);
    }

    @Test
    void booleanActive_generatesSetActiveSetter() throws NoSuchMethodException {  // TC-LOMBOK-02
        Method setter = ApiKey.class.getMethod("setActive", boolean.class);
        assertThat(setter).isNotNull();
    }

    @Test
    void noDoubleIsGetter_isIsActiveDoesNotExist() {  // TC-LOMBOK-03
        try {
            ApiKey.class.getMethod("isIsActive");
            assertThat(true).as("isIsActive() must NOT exist").isFalse();
        } catch (NoSuchMethodException e) {
            // PASS — the double-is getter does not exist
        }
    }

    @Test
    void builderDefault_activeTrueByDefault() {  // TC-LOMBOK-04
        ApiKey key = ApiKey.builder().keyHash("abc").name("test").build();
        assertThat(key.isActive()).isTrue();
        assertThat(key.getRole()).isEqualTo("ADMIN");
    }
}
