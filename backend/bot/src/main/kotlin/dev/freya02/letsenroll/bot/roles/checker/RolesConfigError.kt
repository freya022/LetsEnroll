package dev.freya02.letsenroll.bot.roles.checker

import kotlinx.serialization.Serializable

@Serializable
data class RolesConfigError(
    val path: String,
    val message: String,
)