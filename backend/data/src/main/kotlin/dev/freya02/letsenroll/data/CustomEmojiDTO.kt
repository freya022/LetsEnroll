package dev.freya02.letsenroll.data

import kotlinx.serialization.Serializable

@Serializable
data class CustomEmojiDTO(
    val id: Snowflake,
    val name: String,
    // This is only useful for the frontend so it can add the 'animated' query param
    val animated: Boolean,
)