package dev.freya02.commandinator.api.bot

import dev.freya02.commandinator.api.dto.GuildDTO
import dev.freya02.commandinator.api.dto.MemberDTO
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.client.RestClient
import org.springframework.web.client.support.RestClientAdapter
import org.springframework.web.service.annotation.GetExchange
import org.springframework.web.service.annotation.HttpExchange
import org.springframework.web.service.invoker.HttpServiceProxyFactory
import org.springframework.web.service.invoker.createClient

@HttpExchange
interface BotClient {
    @GetExchange("/guilds/{guildId}/members/{userId}")
    fun getMember(@PathVariable guildId: Long, @PathVariable userId: Long): ResponseEntity<MemberDTO>

    @GetExchange("/guilds")
    fun getBotGuilds(): List<GuildDTO>

    @GetExchange("/guilds/{guildId}/channels")
    fun getGuildChannels(@PathVariable guildId: Long): String
}

fun BotClient.isInGuild(guildId: Long, userId: Long): Boolean {
    val responseEntity = getMember(guildId, userId)
    return responseEntity.statusCode == HttpStatus.OK && responseEntity.body != null
}

@Configuration
class BotClientProvider {

    @Bean
    fun botClient(@Value("\${api.bot.server.host}") host: String, @Value("\${api.bot.server.port}") port: Int): BotClient {
        return RestClient.builder()
            .baseUrl("http://$host:$port")
            .build()
            .let(RestClientAdapter::create)
            .let { HttpServiceProxyFactory.builderFor(it).build() }
            .createClient<BotClient>()
    }
}