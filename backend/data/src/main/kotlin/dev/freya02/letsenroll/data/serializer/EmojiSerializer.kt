package dev.freya02.letsenroll.data.serializer

import dev.freya02.letsenroll.data.RolesConfigDTO
import kotlinx.serialization.KSerializer
import kotlinx.serialization.builtins.serializer
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder

internal object EmojiSerializer : KSerializer<RolesConfigDTO.Message.Emoji> {

    private val customEmojiRegex = Regex("""<(a)?:(\w+):(\d+)>""")

    override val descriptor =
        SerialDescriptor(RolesConfigDTO.Message.Emoji::class.java.name, String.serializer().descriptor)

    override fun serialize(
        encoder: Encoder,
        value: RolesConfigDTO.Message.Emoji
    ) {
        when (value) {
            is RolesConfigDTO.Message.CustomEmoji -> {
                val (animated, name, discordId) = value
                encoder.encodeString("<${if (animated) "a" else ""}:$name:$discordId>")
            }

            is RolesConfigDTO.Message.UnicodeEmoji -> encoder.encodeString(value.unicode)
        }
    }

    override fun deserialize(decoder: Decoder): RolesConfigDTO.Message.Emoji {
        val string = decoder.decodeString()
        val customEmojiMatch = customEmojiRegex.matchEntire(string)
        if (customEmojiMatch != null) {
            val (_, animated, name, id) = customEmojiMatch.groupValues
            return RolesConfigDTO.Message.CustomEmoji(
                animated = animated.toBoolean(),
                name = name,
                discordId = id.toLong()
            )
        } else {
            return RolesConfigDTO.Message.UnicodeEmoji(string)
        }
    }
}