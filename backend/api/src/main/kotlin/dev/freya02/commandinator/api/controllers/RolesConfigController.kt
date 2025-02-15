package dev.freya02.commandinator.api.controllers

import dev.freya02.commandinator.api.dto.RolesConfig
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class RolesConfigController {

    // This is only to test that the JWTs are recognized, with [[JWT.http]]
    @GetMapping("/api/roles")
    fun retrieveConfiguredRoles(): RolesConfig {
        return RolesConfig(
            listOf(
                RolesConfig.Message(
                    "Choose the version of the framework you're using",
                    listOf(
                        listOf(
                            RolesConfig.Message.SelectMenu(
                                placeholder = null,
                                listOf(
                                    RolesConfig.Message.SelectMenu.Choice(
                                        roleName = "V3",
                                        label = "V3",
                                        emoji = RolesConfig.Message.UnicodeEmoji("fire"),
                                        description = "Based AF",
                                    ),
                                    RolesConfig.Message.SelectMenu.Choice(
                                        roleName = "V2",
                                        label = "V2",
                                        emoji = RolesConfig.Message.UnicodeEmoji("confused"),
                                        description = "Why?",
                                    )
                                )
                            )
                        )
                    )
                ),
                RolesConfig.Message(
                    "Choose the language you're using",
                    listOf(
                        listOf(
                            RolesConfig.Message.SelectMenu(
                                placeholder = null,
                                listOf(
                                    RolesConfig.Message.SelectMenu.Choice(
                                        roleName = "Kotlin",
                                        label = "Kotlin",
                                        emoji = RolesConfig.Message.CustomEmoji(false, "kotlin", 1327959227381055539),
                                        description = "Kotlin supremacy",
                                    ),
                                    RolesConfig.Message.SelectMenu.Choice(
                                        roleName = "Java",
                                        label = "Java",
                                        emoji = RolesConfig.Message.CustomEmoji(false, "java", 1327959228421242983),
                                        description = "Verbose but does the job well around",
                                    )
                                )
                            )
                        )
                    )
                ),
                RolesConfig.Message(
                    "Choose the build tool you're using",
                    listOf(
                        listOf(
                            RolesConfig.Message.SelectMenu(
                                placeholder = null,
                                listOf(
                                    RolesConfig.Message.SelectMenu.Choice(
                                        roleName = "Maven",
                                        label = "Maven",
                                        emoji = RolesConfig.Message.CustomEmoji(false, "maven", 1327959229209907263),
                                        description = "Can't go wrong with it for simple projects",
                                    ),
                                    RolesConfig.Message.SelectMenu.Choice(
                                        roleName = "Gradle",
                                        label = "Gradle",
                                        emoji = RolesConfig.Message.CustomEmoji(false, "gradle", 1327959230681976854),
                                        description = "Fast, at the cost of your sanity",
                                    )
                                )
                            )
                        )
                    )
                ),
                RolesConfig.Message(
                    "Choose the dependency injection framework you're using",
                    listOf(
                        listOf(
                            RolesConfig.Message.SelectMenu(
                                placeholder = null,
                                listOf(
                                    RolesConfig.Message.SelectMenu.Choice(
                                        roleName = "Built-in DI",
                                        label = "Built-in DI",
                                        emoji = RolesConfig.Message.CustomEmoji(false, "bc", 1327959231940395031),
                                        description = "Less headaches and often better error messages",
                                    ),
                                    RolesConfig.Message.SelectMenu.Choice(
                                        roleName = "Spring",
                                        label = "Spring",
                                        emoji = RolesConfig.Message.CustomEmoji(false, "spring", 1327959233047691338),
                                        description = "Like bringing a gun to a fist fight",
                                    )
                                )
                            )
                        )
                    )
                ),
                RolesConfig.Message(
                    "Use this button to toggle <@&{roleId[BC Updates]}>",
                    listOf(
                        listOf(
                            RolesConfig.Message.Button(
                                roleName = "BC Updates",
                                RolesConfig.Message.Button.Style.SUCCESS,
                                label = "Toggle BC update pings",
                                emoji = RolesConfig.Message.UnicodeEmoji("bell"),
                            )
                        )
                    )
                )
            )
        )
    }
}