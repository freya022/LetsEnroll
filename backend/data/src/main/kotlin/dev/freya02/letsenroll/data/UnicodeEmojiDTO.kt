package dev.freya02.letsenroll.data

import kotlinx.serialization.Serializable

@Serializable
data class UnicodeEmojiDTO(
    val aliases: List<String>,
    val unicode: String,
    val variants: List<String>,
)