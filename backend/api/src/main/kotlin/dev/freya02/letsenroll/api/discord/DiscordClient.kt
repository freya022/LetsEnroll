package dev.freya02.letsenroll.api.discord

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.client.RestClient
import org.springframework.web.client.support.RestClientAdapter
import org.springframework.web.service.annotation.GetExchange
import org.springframework.web.service.annotation.HttpExchange
import org.springframework.web.service.invoker.HttpServiceProxyFactory
import org.springframework.web.service.invoker.createClient

@HttpExchange("https://discord.com/api/v10")
interface DiscordClient {

    @GetExchange("users/@me/guilds")
    fun getGuilds(@RequestHeader("Authorization") authorizationHeaderValue: String): String //Pass-through to requester
}

@Configuration
class DiscordClientProvider {

    @Bean
    fun discordClient(): DiscordClient {
        return RestClient.builder().build()
            .let(RestClientAdapter::create)
            .let { HttpServiceProxyFactory.builderFor(it).build() }
            .createClient<DiscordClient>()
    }
}