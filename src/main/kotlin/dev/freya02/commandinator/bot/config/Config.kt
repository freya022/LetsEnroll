package dev.freya02.commandinator.bot.config

import io.github.cdimascio.dotenv.dotenv
import io.github.freya022.botcommands.api.core.service.annotations.BService

data class Config(
    val token: String,
    @get:BService
    val database: Database,
) {

    data class Database(
        val host: String,
        val port: Int,
        val username: String,
        val password: String,
        val database: String,
    )

    companion object {

        @get:BService
        val instance: Config by lazy {
            val env = dotenv {
                directory = "./config"
            }

            Config(
                env["BOT_TOKEN"],
                Database(
                    env["DATABASE_HOST"],
                    env["DATABASE_PORT"].toInt(),
                    env["DATABASE_USERNAME"],
                    env["DATABASE_PASSWORD"],
                    env["DATABASE_NAME"],
                ),
            )
        }
    }
}
