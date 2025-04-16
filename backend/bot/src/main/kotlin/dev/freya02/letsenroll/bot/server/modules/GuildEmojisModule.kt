package dev.freya02.letsenroll.bot.server.modules

import dev.freya02.letsenroll.bot.server.resources.Guilds
import dev.freya02.letsenroll.data.CustomEmojiDTO
import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.resources.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import net.dv8tion.jda.api.JDA
import net.dv8tion.jda.api.entities.emoji.RichCustomEmoji

private val logger = KotlinLogging.logger { }

@BService
object GuildEmojisModule : KtorModule {

    override fun Application.defineModule(jda: JDA) {
        routing {
            getGuildEmojis(jda)
        }
    }

    private fun Route.getGuildEmojis(jda: JDA) = get<Guilds.Id.Emojis> { emojisResource ->
        val guildId = emojisResource.guild.guildId
        val guild = jda.getGuildById(guildId) ?: run {
            logger.debug { "No guild found for $guildId" }
            return@get call.respondText("Guild not found", status = HttpStatusCode.NotFound)
        }

        call.respond(guild.emojiCache.applyStream { it.map { it.toDTO() }.toList() })
    }

    private fun RichCustomEmoji.toDTO(): CustomEmojiDTO = CustomEmojiDTO(
        idLong,
        name,
        isAnimated,
    )
}