package dev.freya02.commandinator.bot.server

import dev.freya02.commandinator.bot.config.Config
import dev.freya02.commandinator.bot.server.modules.KtorModule
import io.github.freya022.botcommands.api.core.annotations.BEventListener
import io.github.freya022.botcommands.api.core.events.InjectedJDAEvent
import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.resources.*
import io.ktor.server.routing.*

@BService
class BotServer(
    private val modules: List<KtorModule>,
) {

    @BEventListener
    fun onJDA(event: InjectedJDAEvent, serverConfig: Config.Server) {
        val jda = event.jda

        embeddedServer(Netty, serverConfig.port) {
            install(Resources)

            install(ContentNegotiation) {
                json()
            }

            install(RoutingRoot)

            modules.forEach { with (it) { defineModule(jda) } }
        }.start(wait = false)
    }
}