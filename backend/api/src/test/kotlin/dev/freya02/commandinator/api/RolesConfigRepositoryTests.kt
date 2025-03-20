package dev.freya02.commandinator.api

import dev.freya02.commandinator.api.entity.*
import dev.freya02.commandinator.api.repository.RolesConfigRepository
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class RolesConfigRepositoryTests @Autowired constructor(
    private val rolesConfigRepository: RolesConfigRepository,
) {

    // No need to delete or make sure exceptions don't prevent cleanup, as transactions are rolled back
    @Test
    fun `Insert and retrieve RolesConfig`() {
        rolesConfigRepository.save(
            RolesConfig(
                guildId = EXAMPLE_GUILD_ID,
                messages = arrayListOf(
                    RoleMessage(
                        content = "content",
                        components = arrayListOf(
                            RoleMessageRow(
                                components = arrayListOf(
                                    RoleMessageButton(
                                        roleName = "BC Updates",
                                        style = ButtonStyle.SUCCESS,
                                        label = "Toggle BC update pings",
                                        emoji = UnicodeEmoji("\uD83D\uDD14")
                                    )
                                )
                            ),
                            RoleMessageRow(
                                components = arrayListOf(
                                    RoleMessageSelectMenu(
                                        placeholder = null,
                                        choices = arrayListOf(
                                            RoleMessageSelectMenuChoice(
                                                roleName = "V3",
                                                label = "V3",
                                                emoji = UnicodeEmoji("\uD83D\uDD25")
                                            ),
                                            RoleMessageSelectMenuChoice(
                                                roleName = "V2",
                                                label = "V2",
                                                emoji = UnicodeEmoji("\uD83D\uDE15")
                                            ),
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )

        assertDoesNotThrow { rolesConfigRepository.findByGuildId(EXAMPLE_GUILD_ID)!! }
    }
}