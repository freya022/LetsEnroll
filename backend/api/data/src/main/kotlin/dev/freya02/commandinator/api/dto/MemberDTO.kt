package dev.freya02.commandinator.api.dto

import kotlinx.serialization.Serializable

// TODO move data module outside api
@Serializable
data class MemberDTO(
    val permissions: Set<String>,
)