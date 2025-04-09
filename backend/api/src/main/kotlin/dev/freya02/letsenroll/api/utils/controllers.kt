package dev.freya02.letsenroll.api.utils

import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes

@Target(AnnotationTarget.VALUE_PARAMETER, AnnotationTarget.ANNOTATION_CLASS)
@AuthenticationPrincipal
annotation class DashboardUser

@Suppress("UNCHECKED_CAST")
operator fun <T> OAuth2AuthenticatedPrincipal.get(name: String): T? = attributes[name] as T?

@Suppress("UNCHECKED_CAST")
operator fun <T> OAuth2User.get(name: String): T? = attributes[name] as T?

@Suppress("UNCHECKED_CAST")
val OAuth2User.discordId: Long get() = get<String>("id")!!.toLong()

fun getDiscordAuthorizationHeader(authorizedClientRepository: OAuth2AuthorizedClientRepository): String {
    val token = SecurityContextHolder.getContext().authentication as OAuth2AuthenticationToken
    val request = (RequestContextHolder.getRequestAttributes() as ServletRequestAttributes).request
    val client: OAuth2AuthorizedClient =
        authorizedClientRepository.loadAuthorizedClient(token.authorizedClientRegistrationId, token, request)
    return "Bearer ${client.accessToken.tokenValue}"
}