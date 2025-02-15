package dev.freya02.commandinator.api.controllers

import dev.freya02.commandinator.api.security.JwtService
import org.springframework.context.annotation.Profile
import org.springframework.security.oauth2.jwt.JwtClaimsSet
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Instant

@Profile("dev")
@RestController
class DevJwtController(
    private val jwtService: JwtService,
) {

    // This is only to test that the JWTs are recognized, with [[JWT.http]]
    @GetMapping("/api/jwt")
    fun retrieveJwt(): String {
        return jwtService.createToken(
            JwtClaimsSet.builder()
                .issuedAt(Instant.now())
                .build()
        )
    }

    @GetMapping("/api/jwt/test")
    fun testJwt() {

    }
}