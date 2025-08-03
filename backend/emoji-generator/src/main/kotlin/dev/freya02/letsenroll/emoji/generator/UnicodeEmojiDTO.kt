package dev.freya02.letsenroll.emoji.generator

import kotlinx.serialization.Serializable

@Serializable
data class UnicodeEmojiDTO(
    val names: List<String>,
    val unicode: String,
    val variants: List<String>,
    /**
     * The index in the spritesheet.
     *
     * The spritesheet to use varies:
     * - No variants: Take the sheet with all non-diversity sprites
     * - Has variants: Take the sheet based on the currently selected diversity (default = empty string, other = hex string of the diversity's codepoints)
     */
    val spriteIndex: Int,
)
