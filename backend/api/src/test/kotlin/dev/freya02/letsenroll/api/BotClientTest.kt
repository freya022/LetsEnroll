package dev.freya02.letsenroll.api

import dev.freya02.letsenroll.api.bot.BotClient
import dev.freya02.letsenroll.api.bot.canInteract
import dev.freya02.letsenroll.data.MemberDTO
import io.mockk.every
import io.mockk.mockk
import org.springframework.http.ResponseEntity
import kotlin.test.Test
import kotlin.test.assertFalse
import kotlin.test.assertTrue

private const val FAKE_GUILD_ID = 12361931861
private const val FAKE_USER_ID = 643196166123

class BotClientTest {

    @Test
    fun `Test canInteract`() {
        val botClient = mockk<BotClient>()

        // User is not in the guild
        every { botClient.getMember(FAKE_GUILD_ID, FAKE_USER_ID) } returns ResponseEntity.notFound().build()
        assertFalse(botClient.canInteract(FAKE_GUILD_ID, FAKE_USER_ID))

        // Member has no permissions
        every { botClient.getMember(EXAMPLE_GUILD_ID, EXAMPLE_USER_ID) } answers {
            ResponseEntity.ok(MemberDTO(emptySet()))
        }
        assertFalse(botClient.canInteract(EXAMPLE_GUILD_ID, EXAMPLE_USER_ID))

        // Member has not enough permissions (permutation #1)
        every { botClient.getMember(EXAMPLE_GUILD_ID, EXAMPLE_USER_ID) } answers {
            ResponseEntity.ok(MemberDTO(setOf("MANAGE_SERVER")))
        }
        assertFalse(botClient.canInteract(EXAMPLE_GUILD_ID, EXAMPLE_USER_ID))

        // Member has not enough permissions (permutation #2)
        every { botClient.getMember(EXAMPLE_GUILD_ID, EXAMPLE_USER_ID) } answers {
            ResponseEntity.ok(MemberDTO(setOf("MANAGE_ROLES")))
        }
        assertFalse(botClient.canInteract(EXAMPLE_GUILD_ID, EXAMPLE_USER_ID))

        // Member has enough permissions (permutation #3)
        every { botClient.getMember(EXAMPLE_GUILD_ID, EXAMPLE_USER_ID) } answers {
            ResponseEntity.ok(MemberDTO(setOf("MANAGE_SERVER", "MANAGE_ROLES")))
        }
        assertTrue(botClient.canInteract(EXAMPLE_GUILD_ID, EXAMPLE_USER_ID))

        // Member has more than enough permissions
        every { botClient.getMember(EXAMPLE_GUILD_ID, EXAMPLE_USER_ID) } answers {
            ResponseEntity.ok(MemberDTO(setOf("MANAGE_SERVER", "MANAGE_ROLES", "BAN_MEMBERS")))
        }
        assertTrue(botClient.canInteract(EXAMPLE_GUILD_ID, EXAMPLE_USER_ID))
    }
}