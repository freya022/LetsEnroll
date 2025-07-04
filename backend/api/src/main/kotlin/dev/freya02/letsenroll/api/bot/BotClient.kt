package dev.freya02.letsenroll.api.bot

import dev.freya02.letsenroll.data.GuildDTO
import dev.freya02.letsenroll.data.MemberDTO
import dev.freya02.letsenroll.data.PublishSelectorsDTO
import dev.freya02.letsenroll.data.RolesConfigDTO
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.client.RestClient
import org.springframework.web.client.support.RestClientAdapter
import org.springframework.web.service.annotation.GetExchange
import org.springframework.web.service.annotation.HttpExchange
import org.springframework.web.service.annotation.PostExchange
import org.springframework.web.service.invoker.HttpServiceProxyFactory
import org.springframework.web.service.invoker.createClient

private val logger = KotlinLogging.logger { }

@HttpExchange
interface BotClient {
    @GetExchange("/guilds/{guildId}/members/{userId}")
    fun getMember(@PathVariable guildId: Long, @PathVariable userId: Long): ResponseEntity<MemberDTO>

    @GetExchange("/guilds")
    fun getBotGuilds(): List<GuildDTO>

    @GetExchange("/guilds/{guildId}/channels")
    fun getGuildChannels(@PathVariable guildId: Long): String

    @GetExchange("/emojis")
    fun getUnicodeEmojis(): String

    @GetExchange("/guilds/{guildId}/emojis")
    fun getGuildEmojis(@PathVariable guildId: Long): String

    @PostExchange("/guilds/{guildId}/roles/check")
    fun checkRolesConfig(@PathVariable guildId: Long, @RequestBody data: RolesConfigDTO): String

    @PostExchange("/guilds/{guildId}/roles/publish")
    fun publishRoleSelectors(@PathVariable guildId: Long, @RequestBody data: PublishSelectorsDTO)
}

/**
 * Only the API uses this; the frontend does the same checks using Discord's data
 */
fun BotClient.canInteract(guildId: Long, userId: Long): Boolean {
    val responseEntity = getMember(guildId, userId)
    if (responseEntity.statusCode != HttpStatus.OK) return false
    val body = responseEntity.body ?: run {
        logger.warn { "Expected a response body on OK HTTP status" }
        return false
    }

    if ("MANAGE_ROLES" !in body.permissions) return false
    if ("MANAGE_SERVER" !in body.permissions) return false

    return true
}

@Configuration
class BotClientProvider {

    @Bean
    fun botClient(@Value($$"${api.bot.server.host}") host: String, @Value($$"${api.bot.server.port}") port: Int): BotClient {
        return RestClient.builder()
            .baseUrl("http://$host:$port")
            .build()
            .let(RestClientAdapter::create)
            .let { HttpServiceProxyFactory.builderFor(it).build() }
            .createClient<BotClient>()
    }
}
