package dev.freya02.commandinator.api.controllers

import dev.freya02.commandinator.api.bot.BotClient
import dev.freya02.commandinator.api.bot.isInGuild
import dev.freya02.commandinator.api.dto.PublishRoleSelectorsDTO
import dev.freya02.commandinator.api.exceptions.NoSuchRolesConfigException
import dev.freya02.commandinator.api.exceptions.RolesConfigEmptyException
import dev.freya02.commandinator.api.exceptions.exceptionResponse
import dev.freya02.commandinator.api.service.RolesConfigService
import dev.freya02.commandinator.api.utils.DashboardUser
import dev.freya02.commandinator.api.utils.get
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
        if (!botClient.isInGuild(guildId, user.get<String>("id")!!.toLong()))
            throw ResponseStatusException(HttpStatus.FORBIDDEN)

        rolesConfigService.upsertConfig(guildId, config)
    }

    @GetMapping("/api/guilds/{guildId}/roles")
    fun getRoleConfig(@PathVariable guildId: Long, @DashboardUser user: OAuth2User): RolesConfigDTO? {
        if (!botClient.isInGuild(guildId, user.get<String>("id")!!.toLong()))
            throw ResponseStatusException(HttpStatus.FORBIDDEN)

        return rolesConfigService.retrieveConfig(guildId)
    }

    @PostMapping("/api/guilds/{guildId}/roles/publish")
    fun publishRoleSelectors(@PathVariable("guildId") guildId: Long, @RequestBody data: PublishRoleSelectorsDTO, @DashboardUser user: OAuth2User) {
        if (!botClient.isInGuild(guildId, user.get<String>("id")!!.toLong()))
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