package dev.freya02.letsenroll.api

import com.ninjasquad.springmockk.MockkBean
import dev.freya02.letsenroll.api.bot.BotClient
import dev.freya02.letsenroll.api.bot.canInteract
import dev.freya02.letsenroll.api.controllers.RolesConfigController
import dev.freya02.letsenroll.api.exceptions.NoSuchRolesConfigException
import dev.freya02.letsenroll.api.service.RolesConfigService
import io.mockk.every
import io.mockk.just
import io.mockk.runs
import io.mockk.verify
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.put

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
        botClient.mockUnauthorizedMember()

        mockMvc.put("/api/guilds/$EXAMPLE_GUILD_ID/roles") {
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

        verify(exactly = 1) { botClient.canInteract(any(), any()) }
        verify(exactly = 0) { rolesConfigService.upsertConfig(any(), any()) }
    }

    @Test
    fun `Insert roles config with polymorphic components and emojis`() {
        botClient.mockAuthorizedMember()
        every { rolesConfigService.upsertConfig(any(), any()) } just runs

        mockMvc.put("/api/guilds/$EXAMPLE_GUILD_ID/roles") {
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
                          "emoji": "🔔"
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
        botClient.mockUnauthorizedMember()

        mockMvc.get("/api/guilds/$EXAMPLE_GUILD_ID/roles") {
            withLoggedInInvalidUser()
        }.andExpect {
            status { isForbidden() }
        }

        verify(exactly = 1) { botClient.canInteract(any(), any()) }
        verify(exactly = 0) { rolesConfigService.retrieveConfig(any()) }
    }

    @Test
    fun `No config returns 404`() {
        botClient.mockAuthorizedMember()
        every { rolesConfigService.retrieveConfig(EXAMPLE_GUILD_ID) } throws(NoSuchRolesConfigException("No roles config found for guild"))

        mockMvc.get("/api/guilds/$EXAMPLE_GUILD_ID/roles") {
            withLoggedInInvalidUser()
        }.andExpect {
            status { isNotFound() }
        }

        verify(exactly = 1) { rolesConfigService.retrieveConfig(any()) }
    }

    @Test
    fun `Must be in guild to check roles config`() {
        botClient.mockUnauthorizedMember()

        mockMvc.post("/api/guilds/$EXAMPLE_GUILD_ID/roles/check") {
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

        verify(exactly = 1) { botClient.canInteract(any(), any()) }
        verify(exactly = 0) { rolesConfigService.checkRolesConfig(any(), any()) }
    }

    @Test
    fun `Must be in guild to publish selectors`() {
        botClient.mockUnauthorizedMember()

        mockMvc.post("/api/guilds/$EXAMPLE_GUILD_ID/roles/publish") {
            withLoggedInInvalidUser()

            contentType = MediaType.APPLICATION_JSON
            content = """
                {
                    "channelId": "1234"
                }
            """.trimIndent()
        }.andExpect {
            status { isForbidden() }
        }

        verify(exactly = 1) { botClient.canInteract(any(), any()) }
        verify(exactly = 0) { rolesConfigService.publishSelectors(any(), any()) }
    }
}