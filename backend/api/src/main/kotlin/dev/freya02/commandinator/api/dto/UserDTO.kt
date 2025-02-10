package dev.freya02.commandinator.api.dto

data class UserDTO(
    val id: String,
    val effectiveName: String,
    val avatarHash: String?,
)