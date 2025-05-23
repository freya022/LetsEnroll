package dev.freya02.letsenroll.api

import com.ninjasquad.springmockk.MockkBean
import dev.freya02.letsenroll.api.bot.BotClient
import dev.freya02.letsenroll.api.bot.canInteract
import dev.freya02.letsenroll.api.controllers.DiscordController
import dev.freya02.letsenroll.api.discord.DiscordClient
import io.mockk.every
import io.mockk.verify
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get

@WebMvcTest(controllers = [DiscordController::class])
class DiscordControllerTests @Autowired constructor(
    private val mockMvc: MockMvc,
) {

    @MockkBean
    lateinit var botClient: BotClient

    @MockkBean
    lateinit var discordClient: DiscordClient

    @Test
    fun `Must be in guild to get channels`() {
        botClient.mockUnauthorizedMember()
        every { botClient.getGuildChannels(any()) } returns ""

        mockMvc.get("/api/guilds/$EXAMPLE_GUILD_ID/channels") {
            withLoggedInInvalidUser()
        }.andExpect {
            status { isForbidden() }
        }

        verify(exactly = 1) { botClient.canInteract(any(), any()) }
        verify(exactly = 0) { botClient.getGuildChannels(any()) }
    }

    @Test
    fun `Must be in guild to get emojis`() {
        botClient.mockUnauthorizedMember()
        every { botClient.getGuildEmojis(any()) } returns ""

        mockMvc.get("/api/guilds/$EXAMPLE_GUILD_ID/emojis") {
            withLoggedInInvalidUser()
        }.andExpect {
            status { isForbidden() }
        }

        verify(exactly = 1) { botClient.canInteract(any(), any()) }
        verify(exactly = 0) { botClient.getGuildEmojis(any()) }
    }
}