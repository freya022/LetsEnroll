package dev.freya02.commandinator.api

import com.ninjasquad.springmockk.MockkBean
import dev.freya02.commandinator.api.bot.BotClient
import dev.freya02.commandinator.api.bot.isInGuild
import dev.freya02.commandinator.api.controllers.RolesConfigController
import dev.freya02.commandinator.api.exceptions.NoSuchRolesConfigException
import dev.freya02.commandinator.api.service.RolesConfigService
import io.mockk.every
import io.mockk.just
import io.mockk.mockkStatic
import io.mockk.runs
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post

@WebMvcTest(controllers = [RolesConfigController::class])
class RolesConfigControllerTests @Autowired constructor(
    private val mockMvc: MockMvc,
) {

    @MockkBean
    lateinit var rolesConfigService: RolesConfigService

    @MockkBean
    lateinit var botClient: BotClient

    @Test
    fun `Must be in guild to create config`() {
        mockkStatic(BotClient::isInGuild) // Top-level extensions are static
        every { botClient.isInGuild(any(), any()) } returns false

        mockMvc.post("/api/guilds/$EXAMPLE_GUILD_ID/roles") {
            withLoggedInInvalidUser()

            contentType = MediaType.APPLICATION_JSON
            //language=json
            content = """
                {
                    "messages": []
                }
            """.trimIndent()
        }.andExpect {
            status { isForbidden() }
        }
    }

    @Test
    fun `Insert roles config with polymorphic components and emojis`() {
        mockkStatic(BotClient::isInGuild) // Top-level extensions are static
        every { rolesConfigService.createConfig(any(), any()) } just runs
        every { botClient.isInGuild(EXAMPLE_GUILD_ID, EXAMPLE_USER_ID) } returns true

        mockMvc.post("/api/guilds/$EXAMPLE_GUILD_ID/roles") {
            withLoggedInUser()

            contentType = MediaType.APPLICATION_JSON
            //language=json
            content = """
            {
              "messages": [
                {
                  "content": "content",
                  "components": [
                    {
                      "type": "row",
                      "components": [
                        {
                          "type": "button",
                          "roleName": "role name",
                          "style": "PRIMARY",
                          "label": "label",
                          "emoji": {
                            "type": "unicode",
                            "unicode": "bell"
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
            """.trimIndent()
        }.andExpect {
            status { isOk() }
        }
    }

    @Test
    fun `Must be in guild to receive config`() {
        mockkStatic(BotClient::isInGuild) // Top-level extensions are static
        every { botClient.isInGuild(any(), any()) } returns false

        mockMvc.get("/api/guilds/$EXAMPLE_GUILD_ID/roles") {
            withLoggedInInvalidUser()
        }.andExpect {
            status { isForbidden() }
        }
    }

    @Test
    fun `No config returns 404`() {
        mockkStatic(BotClient::isInGuild) // Top-level extensions are static
        every { botClient.isInGuild(any(), any()) } returns true
        every { rolesConfigService.retrieveConfig(EXAMPLE_GUILD_ID) } throws(NoSuchRolesConfigException("No roles config found for guild"))

        mockMvc.get("/api/guilds/$EXAMPLE_GUILD_ID/roles") {
            withLoggedInInvalidUser()
        }.andExpect {
            status { isNotFound() }
        }
    }
}