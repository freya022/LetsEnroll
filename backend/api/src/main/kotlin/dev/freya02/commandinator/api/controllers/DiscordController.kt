package dev.freya02.commandinator.api.controllers

import com.fasterxml.jackson.databind.ObjectMapper
import dev.freya02.commandinator.api.bot.BotClient
import dev.freya02.commandinator.api.discord.DiscordClient
import dev.freya02.commandinator.api.utils.getDiscordAuthorizationHeader
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

@RestController
class DiscordController(
    private val authorizedClientRepository: OAuth2AuthorizedClientRepository,
    private val objectMapper: ObjectMapper,
    private val discordClient: DiscordClient,
    private val botClient: BotClient,
) {

    @GetMapping("/api/guilds")
    fun getSharedGuilds(): String {
        val guilds = discordClient.getGuilds(getDiscordAuthorizationHeader(authorizedClientRepository))
        val botGuildIds = botClient.getBotGuilds().map { it.id }
        // Filter the tree without full deserialization to preserve what Discord sends
        val sharedGuilds = objectMapper.readTree(guilds)
            .filter { it["id"].asLong() in botGuildIds }
            .let { objectMapper.writeValueAsString(it) }

        return sharedGuilds
    }

    @GetMapping("/api/guilds/{guildId}/channels")
    fun getGuildChannels(@PathVariable guildId: Long): String {
        return botClient.getGuildChannels(guildId)
    }
}