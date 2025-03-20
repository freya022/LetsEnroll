package dev.freya02.commandinator.api

import dev.freya02.commandinator.api.dto.RolesConfigDTO
import dev.freya02.commandinator.api.entity.*
import dev.freya02.commandinator.api.mapper.RolesConfigMapper
import dev.freya02.commandinator.api.mapper.mapper
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import kotlin.test.assertEquals
import kotlin.test.assertSame

class RolesConfigMapperTest {

    private val mapper: RolesConfigMapper = mapper()

    @Test
    fun `Map DTO to entity`() {
        val dto = RolesConfigDTO(
            listOf(
                RolesConfigDTO.Message(
                    "Use this button to toggle <@&{roleId[BC Updates]}>",
                    listOf(
                        RolesConfigDTO.Message.Row(
                            RolesConfigDTO.Message.Button(
                                roleName = "BC Updates",
                                RolesConfigDTO.Message.Button.Style.SUCCESS,
                                label = "Toggle BC update pings",
                                emoji = RolesConfigDTO.Message.UnicodeEmoji("\uD83D\uDD14"),
                            )
                        )
                    )
                )
            )
        )

        val actualEntity = mapper.toRolesConfig(dto, EXAMPLE_GUILD_ID)
        val expectedEntity = RolesConfig(
            guildId = EXAMPLE_GUILD_ID,
            messages = arrayListOf(
                RoleMessage(
                    content = "Use this button to toggle <@&{roleId[BC Updates]}>",
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
                        )
                    )
                )
            )
        )

        assertEquals(expectedEntity, actualEntity)
    }

    @Test
    fun `Update entity with DTO`() {
        val entity = RolesConfig(
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
                                    label = "label",
                                    emoji = UnicodeEmoji("\uD83D\uDD14")
                                )
                            )
                        )
                    )
                )
            )
        )

        val newContent = "Use this button to toggle <@&{roleId[BC Updates]}>"
        val newLabel = "Toggle BC update pings"
        val dto = RolesConfigDTO(
            messages = listOf(
                RolesConfigDTO.Message(
                    content = newContent,
                    components = listOf(
                        RolesConfigDTO.Message.Row(
                            RolesConfigDTO.Message.Button(
                                roleName = "BC Updates",
                                style = RolesConfigDTO.Message.Button.Style.SUCCESS,
                                label = newLabel,
                                emoji = RolesConfigDTO.Message.UnicodeEmoji("\uD83D\uDD14"),
                            )
                        )
                    )
                )
            )
        )

        val updatedEntity = assertDoesNotThrow { mapper.updateRolesConfig(dto, entity) }
        assertSame(updatedEntity, entity)
        assertEquals(newContent, entity.messages[0].content)
        assertEquals(newLabel, ((entity.messages[0].components[0] as RoleMessageRow).components[0] as RoleMessageButton).label)
    }

    @Test
    fun `Map entity to DTO`() {

    }
}