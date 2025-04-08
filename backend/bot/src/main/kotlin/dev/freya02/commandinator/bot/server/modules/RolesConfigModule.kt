package dev.freya02.commandinator.bot.server.modules

import dev.freya02.commandinator.bot.roles.selectors.RoleSelectorsPublisher
import dev.freya02.commandinator.bot.roles.selectors.exceptions.ChannelNotFoundException
import dev.freya02.commandinator.bot.roles.selectors.exceptions.GuildNotFoundException
import dev.freya02.commandinator.bot.server.resources.Guilds
import dev.freya02.letsenroll.data.PublishSelectorsDTO
import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.resources.*
import io.ktor.server.response.*
import io.ktor.server.routing.Route
import io.ktor.server.routing.routing
import net.dv8tion.jda.api.JDA

private val logger = KotlinLogging.logger { }

@BService
class RolesConfigModule(
    private val rolesSelectorsPublisher: RoleSelectorsPublisher,
) : KtorModule {

    override fun Application.defineModule(jda: JDA) {
        routing {
            publishRoleSelectors(jda)
        }
    }

    private fun Route.publishRoleSelectors(jda: JDA) = post<Guilds.Id.Roles.Publish> { publishResource ->
        val guildId = publishResource.roles.guild.guildId
        val data = call.receive<PublishSelectorsDTO>()

        try {
            rolesSelectorsPublisher.publish(jda, guildId, data)
            logger.trace { "Published role selectors in channel ${data.channelId}" }
            call.respond(HttpStatusCode.OK, null)
        } catch (_: GuildNotFoundException) {
            logger.debug { "Guild with ID $guildId not found" }
            call.respondText("Guild not found", status = HttpStatusCode.NotFound)
        } catch (_: ChannelNotFoundException) {
            logger.debug { "Channel with ID $guildId not found" }
            call.respondText("Channel not found", status = HttpStatusCode.NotFound)
        }
    }
}