package dev.freya02.commandinator.api.dto

import kotlinx.serialization.Serializable

@Serializable
data class MemberDTO(
    val permissions: Set<String>,
)