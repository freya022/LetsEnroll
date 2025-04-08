package dev.freya02.letsenroll.data

import kotlinx.serialization.Serializable

@Serializable
data class MemberDTO(
    val permissions: Set<String>,
)