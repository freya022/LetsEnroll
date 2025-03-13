package dev.freya02.commandinator.api.controllers

import dev.freya02.commandinator.api.dto.RolesConfigDTO
import dev.freya02.commandinator.api.repository.RolesConfigRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class RolesConfigController(
    private val rolesConfigRepository: RolesConfigRepository,
) {

    // This is only to test that the JWTs are recognized, with [[JWT.http]]
    @GetMapping("/api/roles")
    fun retrieveConfiguredRoles(): RolesConfigDTO {
        val rolesConfigs = rolesConfigRepository.findAll()
        println("rolesConfigs = $rolesConfigs")

        return RolesConfigDTO(
            listOf(
                RolesConfigDTO.Message(
                    "Choose the version of the framework you're using",
                    listOf(
                        listOf(
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
                        listOf(
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
                        listOf(
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
                        listOf(
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
                        listOf(
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
}