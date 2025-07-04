package dev.freya02.letsenroll.api.security

import com.nimbusds.jose.jwk.source.ImmutableSecret
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.security.oauth2.jose.jws.MacAlgorithm
import org.springframework.security.oauth2.jwt.*
import org.springframework.stereotype.Component
import javax.crypto.spec.SecretKeySpec
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi
import kotlin.io.path.Path
import kotlin.io.path.readText

@OptIn(ExperimentalEncodingApi::class)
@Component
class JwtService(
    @Value($$"${api.jwt.secret-key-file}")
    keyFile: String,
) {

    private final val secretKey: SecretKeySpec

    init {
        val keyBytes = Path(keyFile)
            .readText().replace(Regex("\\s+"), "")
            .let { Base64.decode(it) }

        secretKey = SecretKeySpec(keyBytes, "HmacSHA512")
    }

    @get:Bean
    val decoder: NimbusJwtDecoder =
        NimbusJwtDecoder
            .withSecretKey(secretKey)
            .macAlgorithm(MacAlgorithm.HS512)
            .build()

    private val encoder: NimbusJwtEncoder =
        NimbusJwtEncoder(ImmutableSecret(secretKey))

    fun createToken(claims: JwtClaimsSet): String {
        val header = JwsHeader.with(MacAlgorithm.HS512).build()
        return encoder.encode(JwtEncoderParameters.from(header, claims)).tokenValue
    }
}
