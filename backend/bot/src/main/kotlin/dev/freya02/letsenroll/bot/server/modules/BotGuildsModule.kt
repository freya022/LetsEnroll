package dev.freya02.letsenroll.bot.server.modules

import dev.freya02.letsenroll.bot.server.resources.Guilds
import dev.freya02.letsenroll.data.GuildDTO
import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.ktor.server.application.*
import io.ktor.server.resources.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import net.dv8tion.jda.api.JDA
import net.dv8tion.jda.api.entities.Guild

@BService
object BotGuildsModule : KtorModule {

    override fun Application.defineModule(jda: JDA) {
        routing {
            getBotGuilds(jda)
        }
    }

    private fun Route.getBotGuilds(jda: JDA) = get<Guilds> { _ ->
        call.respond(jda.guilds.map { it.toDTO() })
    }

    private fun Guild.toDTO(): GuildDTO = GuildDTO(
        idLong,
    )
}