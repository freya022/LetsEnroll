package dev.freya02.commandinator.bot.config

import com.akuleshov7.ktoml.Toml
import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import java.nio.file.Path
import kotlin.io.path.absolutePathString
import kotlin.io.path.readText

private val logger = KotlinLogging.logger { }
private val configFilePath: Path = Environment.configFolder.resolve("config.toml")

@Serializable
data class Config(
    val token: String = readEnv("TOKEN"),
    @get:BService
    val database: Database = Database(),
) {

    @Serializable
    data class Database(
        val host: String = readEnv("DATABASE_HOST"),
        val port: Int = readEnv("DATABASE_PORT").toInt(),
        val username: String = readEnv("DATABASE_USERNAME"),
        val password: String = readEnv("DATABASE_PASSWORD"),
        val database: String = readEnv("DATABASE_NAME"),
    )

    companion object {

        @get:BService
        val instance: Config by lazy {
            logger.info { "Loading configuration at ${configFilePath.absolutePathString()}" }
            Toml.decodeFromString(configFilePath.readText())
        }
    }
}

private fun readEnv(name: String): String =
    System.getenv(name) ?: error("Environment variable '$name' is missing, and was absent from config")