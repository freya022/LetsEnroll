package dev.freya02.commandinator.bot.server

import dev.freya02.commandinator.api.dto.MemberDTO
import dev.freya02.commandinator.bot.config.Config
import io.github.freya022.botcommands.api.core.annotations.BEventListener
import io.github.freya022.botcommands.api.core.events.InjectedJDAEvent
import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.github.freya022.botcommands.api.core.utils.retrieveMemberByIdOrNull
import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.http.*
import io.ktor.resources.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.resources.*
import io.ktor.server.resources.Resources
import io.ktor.server.response.*
import io.ktor.server.routing.*
import net.dv8tion.jda.api.JDA

@Resource("/guilds")
private class Guilds {

    @Resource("{guildId}")
    class Id(val guilds: Guilds, val guildId: Long) {

        @Resource("members")
        class Members(val guild: Guilds.Id) {

            @Resource("{userId}")
            class Id(val members: Members, val userId: Long)
        }
    }
}

private val logger = KotlinLogging.logger { }

@BService
class BotServer {

    @BEventListener
    fun onJDA(event: InjectedJDAEvent, serverConfig: Config.Server) {
        val jda = event.jda

        embeddedServer(Netty, serverConfig.port) {
            install(Resources)

            install(ContentNegotiation) {
                json()
            }

            install(RoutingRoot) {
                routing {
                    getGuildMember(jda)
                }
            }
        }.start(wait = false)
    }

    // If this gets larger, then consider using "modules" https://ktor.io/docs/server-modules.html

    private fun Route.getGuildMember(jda: JDA) = get<Guilds.Id.Members.Id> { memberResource ->
        val guildId = memberResource.members.guild.guildId
        val userId = memberResource.userId
        val guild = jda.getGuildById(guildId)
        if (guild == null) {
            logger.debug { "No guild found for $guildId" }
            return@get call.respond(HttpStatusCode.NotFound)
        }

        val member = guild.retrieveMemberByIdOrNull(userId)
        if (member == null) {
            logger.debug { "No member found for $userId in guild $guildId" }
            return@get call.respond(HttpStatusCode.NotFound)
        }

        call.respond(MemberDTO(member.permissions.mapTo(hashSetOf()) { it.name }))
    }
}