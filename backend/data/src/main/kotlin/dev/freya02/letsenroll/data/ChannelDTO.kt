package dev.freya02.letsenroll.data

import kotlinx.serialization.Serializable

@Serializable
data class ChannelDTO(
    val id: Snowflake,
    val name: String,
    val canBotTalk: Boolean,
)