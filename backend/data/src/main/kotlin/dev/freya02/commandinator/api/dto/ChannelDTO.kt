package dev.freya02.commandinator.api.dto

import kotlinx.serialization.Serializable

@Serializable
data class ChannelDTO(
    val id: Snowflake,
    val name: String,
)