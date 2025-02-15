package dev.freya02.commandinator.bot.config

import com.nimbusds.jose.JWSAlgorithm
import com.nimbusds.jose.JWSHeader
import com.nimbusds.jose.JWSObject
import com.nimbusds.jose.Payload
import com.nimbusds.jose.crypto.MACSigner
import io.github.cdimascio.dotenv.dotenv
import io.github.freya022.botcommands.api.core.service.annotations.BService
import javax.crypto.spec.SecretKeySpec
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi
import kotlin.io.path.Path
import kotlin.io.path.readText

data class Config(
    val isDev: Boolean,
    val token: String,
    @get:BService
    val database: Database,
    @get:BService
    val api: Api,
) {

    data class Database(
        val host: String,
        val port: Int,
        val username: String,
        val password: String,
        val database: String,
    )

    data class Api(
        val host: String,
        val port: Int,
        val jwt: String,
    )

    companion object {

        @get:BService
        val instance: Config by lazy {
            val env = dotenv {
                directory = "./config"
            }

            Config(
                env["DEV"].toBooleanStrict(),
                env["BOT_TOKEN"],
                Database(
                    env["DATABASE_HOST"],
                    env["DATABASE_PORT"].toInt(),
                    env["POSTGRES_USER"],
                    env["POSTGRES_PASSWORD"],
                    env["POSTGRES_DB"],
                ),
                Api(
                    env["API_HOST"],
                    env["API_PORT"].toInt(),
                    generateJwt(env["API_PRIVATE_KEY_FILE"]),
                )
            )
        }
    }
}

@OptIn(ExperimentalEncodingApi::class)
private fun generateJwt(privateKeyFile: String): String {
    val keyBytes = Path(privateKeyFile)
        .readText().replace(Regex("\\s+"), "")
        .let { Base64.decode(it) }

    val signer = MACSigner(SecretKeySpec(keyBytes, "HmacSHA512"))
    val jwsObject = JWSObject(JWSHeader(JWSAlgorithm.HS512), Payload(mapOf("iat" to 0)))
    jwsObject.sign(signer)
    return jwsObject.serialize()
}