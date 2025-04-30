package dev.freya02.letsenroll.api

import dev.freya02.letsenroll.api.bot.BotClient
import dev.freya02.letsenroll.api.bot.canInteract
import io.mockk.every
import io.mockk.mockkStatic
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oauth2Login
import org.springframework.test.web.servlet.MockHttpServletRequestDsl

// https://docs.spring.io/spring-security/reference/servlet/test/mockmvc/csrf.html
// https://docs.spring.io/spring-security/reference/servlet/test/mockmvc/oauth2.html#testing-oauth2-login

fun MockHttpServletRequestDsl.withLoggedInUser() {
    with(csrf().asHeader())
    with(oauth2Login().attributes {
        it["id"] = EXAMPLE_USER_ID.toString()
    })
}

fun MockHttpServletRequestDsl.withLoggedInInvalidUser() {
    with(csrf().asHeader())
    with(oauth2Login().attributes {
        it["id"] = "1234"
    })
}

fun BotClient.mockAuthorizedMember() {
    mockkStatic(BotClient::canInteract)
    every { canInteract(any(), any()) } returns true
}

fun BotClient.mockUnauthorizedMember() {
    mockkStatic(BotClient::canInteract)
    every { canInteract(any(), any()) } returns false
}