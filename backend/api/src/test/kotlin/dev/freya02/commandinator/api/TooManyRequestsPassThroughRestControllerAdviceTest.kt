package dev.freya02.commandinator.api

import com.ninjasquad.springmockk.MockkBean
import dev.freya02.commandinator.api.controllers.DiscordController
import io.mockk.every
import jakarta.servlet.ServletException
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.http.HttpStatus
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.web.client.HttpClientErrorException
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertIs

@WebMvcTest(DiscordController::class)
class TooManyRequestsPassThroughRestControllerAdviceTest @Autowired constructor(
    private val mockMvc: MockMvc,
) {

    @MockkBean
    private lateinit var discordController: DiscordController

    @Test
    fun `Client 429s are passed through controllers`() {
        // Check 429 is passed back
        every { discordController.getSharedGuilds() } throws HttpClientErrorException(HttpStatus.TOO_MANY_REQUESTS)

        mockMvc.get("/api/guilds") {
            withLoggedInUser()
        }.andExpect {
            status { isTooManyRequests() }
        }

        // Check others are returned as server errors
        every { discordController.getSharedGuilds() } throws HttpClientErrorException(HttpStatus.I_AM_A_TEAPOT)

        assertThrows<ServletException> {
            mockMvc.get("/api/guilds") {
                withLoggedInUser()
            }.andExpect {
                status { isInternalServerError() }
            }
        }.also {
            val cause = it.rootCause
            assertIs<HttpClientErrorException>(cause)
            assertEquals(HttpStatus.I_AM_A_TEAPOT, cause.statusCode)
        }
    }
}