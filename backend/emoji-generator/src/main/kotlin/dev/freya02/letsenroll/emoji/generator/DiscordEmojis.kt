package dev.freya02.letsenroll.emoji.generator

import kotlinx.serialization.Serializable

@Serializable
data class DiscordEmojis(
    val emojis: List<Emoji>,
    // Also emojisByCategory, nameToEmoji, surrogateToEmoji, but we don't care about those
) {

    @Serializable
    data class Emoji(
        val surrogates: String,
        val names: List<String>,
        val diversity: List<String> = emptyList(),
        val spriteIndex: Int = -1,
//        val hasMultiDiversityParent: Boolean = false,
//        val hasMultiDiversity: Boolean = false,
        val diversityChildren: List<Int> = emptyList(),
//        val unicodeVersion: Double,
    ) {

//        val hasDiversity: Boolean get() = diversity.isNotEmpty()
    }
}
