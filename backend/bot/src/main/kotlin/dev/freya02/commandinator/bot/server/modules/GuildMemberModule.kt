package dev.freya02.commandinator.bot.server.modules

import dev.freya02.commandinator.api.dto.MemberDTO
import dev.freya02.commandinator.bot.server.resources.Guilds
import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.github.freya022.botcommands.api.core.utils.retrieveMemberByIdOrNull
import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.resources.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import net.dv8tion.jda.api.JDA

private val logger = KotlinLogging.logger { }

@BService
object GuildMemberModule : KtorModule {

    override fun Application.defineModule(jda: JDA) {
        routing {
            getGuildMember(jda)
        }
    }

    private fun Route.getGuildMember(jda: JDA) = get<Guilds.Id.Members.Id> { memberResource ->
        val guildId = memberResource.members.guild.guildId
        val userId = memberResource.userId
        val guild = jda.getGuildById(guildId) ?: run {
            logger.debug { "No guild found for $guildId" }
            return@get call.respondText("Guild not found", status = HttpStatusCode.NotFound)
        }

        val member = guild.retrieveMemberByIdOrNull(userId) ?: run {
            logger.debug { "No member found for $userId in guild $guildId" }
            return@get call.respondText("Member not found", status = HttpStatusCode.NotFound)
        }

        call.respond(MemberDTO(member.permissions.mapTo(hashSetOf()) { it.name }))
    }
}