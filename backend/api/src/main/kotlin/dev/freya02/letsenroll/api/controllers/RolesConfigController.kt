package dev.freya02.letsenroll.api.controllers

import dev.freya02.letsenroll.api.bot.BotClient
import dev.freya02.letsenroll.api.bot.canInteract
import dev.freya02.letsenroll.api.dto.PublishRoleSelectorsDTO
import dev.freya02.letsenroll.api.exceptions.NoSuchRolesConfigException
import dev.freya02.letsenroll.api.exceptions.RolesConfigEmptyException
import dev.freya02.letsenroll.api.exceptions.exceptionResponse
import dev.freya02.letsenroll.api.service.RolesConfigService
import dev.freya02.letsenroll.api.utils.DashboardUser
import dev.freya02.letsenroll.api.utils.discordId
import dev.freya02.letsenroll.data.RolesConfigDTO
import org.springframework.http.HttpStatus
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
class RolesConfigController(
    private val rolesConfigService: RolesConfigService,
    private val botClient: BotClient
) {

    @PutMapping("/api/guilds/{guildId}/roles")
    fun upsertRoleConfig(@PathVariable guildId: Long, @RequestBody config: RolesConfigDTO, @DashboardUser user: OAuth2User) {
        if (!botClient.canInteract(guildId, user.discordId))
            throw ResponseStatusException(HttpStatus.FORBIDDEN)

        rolesConfigService.upsertConfig(guildId, config)
    }

    @GetMapping("/api/guilds/{guildId}/roles")
    fun getRoleConfig(@PathVariable guildId: Long, @DashboardUser user: OAuth2User): RolesConfigDTO? {
        if (!botClient.canInteract(guildId, user.discordId))
            throw ResponseStatusException(HttpStatus.FORBIDDEN)

        return rolesConfigService.retrieveConfig(guildId)
    }

    @PostMapping("/api/guilds/{guildId}/roles/check")
    fun checkRolesConfig(@PathVariable("guildId") guildId: Long, @RequestBody data: RolesConfigDTO, @DashboardUser user: OAuth2User): String {
        if (!botClient.canInteract(guildId, user.discordId))
            throw ResponseStatusException(HttpStatus.FORBIDDEN)

        return rolesConfigService.checkRolesConfig(guildId, data)
    }

    @PostMapping("/api/guilds/{guildId}/roles/publish")
    fun publishRoleSelectors(@PathVariable("guildId") guildId: Long, @RequestBody data: PublishRoleSelectorsDTO, @DashboardUser user: OAuth2User) {
        if (!botClient.canInteract(guildId, user.discordId))
            throw ResponseStatusException(HttpStatus.FORBIDDEN)

        rolesConfigService.publishSelectors(guildId, data.channelId)
    }

    @ExceptionHandler
    fun handleException(exception: RolesConfigEmptyException) =
        exceptionResponse(HttpStatus.BAD_REQUEST, "The config contains no messages.")

    @ExceptionHandler
    fun handleException(exception: NoSuchRolesConfigException) =
        exceptionResponse(HttpStatus.NOT_FOUND, "No config exists for this guild.")
}