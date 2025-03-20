package dev.freya02.commandinator.api

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