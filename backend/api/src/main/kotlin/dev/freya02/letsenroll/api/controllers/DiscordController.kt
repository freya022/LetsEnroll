package dev.freya02.letsenroll.api.controllers

import com.fasterxml.jackson.databind.ObjectMapper
import dev.freya02.letsenroll.api.bot.BotClient
import dev.freya02.letsenroll.api.bot.isInGuild
import dev.freya02.letsenroll.api.discord.DiscordClient
import dev.freya02.letsenroll.api.utils.DashboardUser
import dev.freya02.letsenroll.api.utils.discordId
import dev.freya02.letsenroll.api.utils.getDiscordAuthorizationHeader
import org.springframework.http.HttpStatus
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

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
    fun getGuildChannels(@PathVariable guildId: Long, @DashboardUser user: OAuth2User): String {
        if (!botClient.isInGuild(guildId, user.discordId))
            throw ResponseStatusException(HttpStatus.FORBIDDEN)

        return botClient.getGuildChannels(guildId)
    }

    @GetMapping("/api/emojis")
    fun getUnicodeEmojis(): String {
        return botClient.getUnicodeEmojis()
    }

    @GetMapping("/api/guilds/{guildId}/emojis")
    fun getGuildEmojis(@PathVariable guildId: Long, @DashboardUser user: OAuth2User): String {
        if (!botClient.isInGuild(guildId, user.discordId))
            throw ResponseStatusException(HttpStatus.FORBIDDEN)

        return botClient.getGuildEmojis(guildId)
    }
}