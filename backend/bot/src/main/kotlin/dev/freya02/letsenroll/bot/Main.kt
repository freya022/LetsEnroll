package dev.freya02.letsenroll.bot

import ch.qos.logback.classic.ClassicConstants
import dev.freya02.botcommands.method.accessors.api.MethodAccessorsConfig
import dev.freya02.botcommands.method.accessors.api.annotations.ExperimentalMethodAccessorsApi
import dev.freya02.letsenroll.bot.config.Config
import io.github.freya022.botcommands.api.core.BotCommands
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlin.io.path.*
import kotlin.system.exitProcess

private val logger by lazy { KotlinLogging.logger { } }

fun main() {
    try {
        val logbackPath = Path("config", "logback.xml")
        if (logbackPath.exists()) {
            System.setProperty(ClassicConstants.CONFIG_FILE_PROPERTY, logbackPath.absolutePathString())
            logger.info { "Loading logback configuration from current directory (${logbackPath.absolute().parent.pathString})" }
        } else {
            logger.info { "Using packaged logback configuration as there is no logback.xml in ${logbackPath.absolute().parent.pathString}" }
        }

        @OptIn(ExperimentalMethodAccessorsApi::class)
        MethodAccessorsConfig.preferClassFileAccessors()

        val config = Config.instance
        BotCommands.create {
            disableExceptionsInDMs = config.isDev

            addSearchPath("dev.freya02.letsenroll.bot")

            coroutineScopes {
                eventManagerScopeFactory = defaultFactory("Let's Enroll Coroutine", 4)
            }

            components {
                enable = true
            }

            localization {
                addResponseBundle("responses")
            }

            textCommands {
                enable = false
            }

            modals {
                enable = false
            }
        }

        logger.info { "Loaded bot" }
    } catch (e: Exception) {
        logger.error(e) { "Unable to start the bot" }
        exitProcess(1)
    }
}
