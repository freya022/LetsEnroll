package dev.freya02.commandinator.api.utils

import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal

@Suppress("UNCHECKED_CAST")
operator fun <T> OAuth2AuthenticatedPrincipal.get(name: String): T? = attributes[name] as T?