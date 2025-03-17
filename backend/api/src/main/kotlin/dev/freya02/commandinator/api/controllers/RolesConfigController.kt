package dev.freya02.commandinator.api.controllers

import dev.freya02.commandinator.api.dto.RolesConfigDTO
import dev.freya02.commandinator.api.exceptions.RolesConfigAlreadyExistsException
import dev.freya02.commandinator.api.exceptions.RolesConfigEmptyException
import dev.freya02.commandinator.api.exceptions.exceptionResponse
import dev.freya02.commandinator.api.service.RolesConfigService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
class RolesConfigController(
    private val rolesConfigService: RolesConfigService,
) {

    @PostMapping("/api/guilds/{guildId}/roles")
    fun createRoleConfig(@PathVariable guildId: Long, @RequestBody config: RolesConfigDTO) {
        rolesConfigService.createConfig(guildId, config)
    }

    @GetMapping("/api/guilds/{guildId}/roles")
    fun getRoleConfig(@PathVariable guildId: Long): RolesConfigDTO? {
        return rolesConfigService.retrieveConfig(guildId)
    }

    @GetMapping("/api/roles")
    fun retrieveConfiguredRoles(): RolesConfigDTO {
        return RolesConfigDTO(
            listOf(
                RolesConfigDTO.Message(
                    "Choose the version of the framework you're using",
                    listOf(
                        RolesConfigDTO.Message.Row(
                            RolesConfigDTO.Message.SelectMenu(
                                placeholder = null,
                                listOf(
                                    RolesConfigDTO.Message.SelectMenu.Choice(
                                        roleName = "V3",
                                        label = "V3",
                                        emoji = RolesConfigDTO.Message.UnicodeEmoji("fire"),
                                        description = "Based AF",
                                    ),
                                    RolesConfigDTO.Message.SelectMenu.Choice(
                                        roleName = "V2",
                                        label = "V2",
                                        emoji = RolesConfigDTO.Message.UnicodeEmoji("confused"),
                                        description = "Why?",
                                    )
                                )
                            )
                        )
                    )
                ),
                RolesConfigDTO.Message(
                    "Choose the language you're using",
                    listOf(
                        RolesConfigDTO.Message.Row(
                            RolesConfigDTO.Message.SelectMenu(
                                placeholder = null,
                                listOf(
                                    RolesConfigDTO.Message.SelectMenu.Choice(
                                        roleName = "Kotlin",
                                        label = "Kotlin",
                                        emoji = RolesConfigDTO.Message.CustomEmoji(false, "kotlin", 1327959227381055539),
                                        description = "Kotlin supremacy",
                                    ),
                                    RolesConfigDTO.Message.SelectMenu.Choice(
                                        roleName = "Java",
                                        label = "Java",
                                        emoji = RolesConfigDTO.Message.CustomEmoji(false, "java", 1327959228421242983),
                                        description = "Verbose but does the job well around",
                                    )
                                )
                            )
                        )
                    )
                ),
                RolesConfigDTO.Message(
                    "Choose the build tool you're using",
                    listOf(
                        RolesConfigDTO.Message.Row(
                            RolesConfigDTO.Message.SelectMenu(
                                placeholder = null,
                                listOf(
                                    RolesConfigDTO.Message.SelectMenu.Choice(
                                        roleName = "Maven",
                                        label = "Maven",
                                        emoji = RolesConfigDTO.Message.CustomEmoji(false, "maven", 1327959229209907263),
                                        description = "Can't go wrong with it for simple projects",
                                    ),
                                    RolesConfigDTO.Message.SelectMenu.Choice(
                                        roleName = "Gradle",
                                        label = "Gradle",
                                        emoji = RolesConfigDTO.Message.CustomEmoji(false, "gradle", 1327959230681976854),
                                        description = "Fast, at the cost of your sanity",
                                    )
                                )
                            )
                        )
                    )
                ),
                RolesConfigDTO.Message(
                    "Choose the dependency injection framework you're using",
                    listOf(
                        RolesConfigDTO.Message.Row(
                            RolesConfigDTO.Message.SelectMenu(
                                placeholder = null,
                                listOf(
                                    RolesConfigDTO.Message.SelectMenu.Choice(
                                        roleName = "Built-in DI",
                                        label = "Built-in DI",
                                        emoji = RolesConfigDTO.Message.CustomEmoji(false, "bc", 1327959231940395031),
                                        description = "Less headaches and often better error messages",
                                    ),
                                    RolesConfigDTO.Message.SelectMenu.Choice(
                                        roleName = "Spring",
                                        label = "Spring",
                                        emoji = RolesConfigDTO.Message.CustomEmoji(false, "spring", 1327959233047691338),
                                        description = "Like bringing a gun to a fist fight",
                                    )
                                )
                            )
                        )
                    )
                ),
                RolesConfigDTO.Message(
                    "Use this button to toggle <@&{roleId[BC Updates]}>",
                    listOf(
                        RolesConfigDTO.Message.Row(
                            RolesConfigDTO.Message.Button(
                                roleName = "BC Updates",
                                RolesConfigDTO.Message.Button.Style.SUCCESS,
                                label = "Toggle BC update pings",
                                emoji = RolesConfigDTO.Message.UnicodeEmoji("bell"),
                            )
                        )
                    )
                )
            )
        )
    }

    @ExceptionHandler
    fun handleException(exception: RolesConfigAlreadyExistsException) =
        exceptionResponse(HttpStatus.CONFLICT, "A config already exists.")

    @ExceptionHandler
    fun handleException(exception: RolesConfigEmptyException) =
        exceptionResponse(HttpStatus.BAD_REQUEST, "The config contains no messages.")
}