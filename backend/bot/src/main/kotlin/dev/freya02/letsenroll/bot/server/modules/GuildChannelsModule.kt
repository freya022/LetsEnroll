package dev.freya02.letsenroll.bot.server.modules

import dev.freya02.letsenroll.bot.server.resources.Guilds
import dev.freya02.letsenroll.data.ChannelDTO
import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.resources.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import net.dv8tion.jda.api.JDA
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel

private val logger = KotlinLogging.logger { }

@BService
object GuildChannelsModule : KtorModule {

    override fun Application.defineModule(jda: JDA) {
        routing {
            getGuildChannels(jda)
        }
    }

    private fun Route.getGuildChannels(jda: JDA) = get<Guilds.Id.Channels> { channelsResource ->
        val guildId = channelsResource.guild.guildId
        val guild = jda.getGuildById(guildId) ?: run {
            logger.debug { "No guild found for $guildId" }
            return@get call.respondText("Guild not found", status = HttpStatusCode.NotFound)
        }

        call.respond(guild.channels.filterIsInstance<TextChannel>().map { it.toDTO() })
    }

    private fun TextChannel.toDTO(): ChannelDTO = ChannelDTO(
        idLong,
        name
    )
}