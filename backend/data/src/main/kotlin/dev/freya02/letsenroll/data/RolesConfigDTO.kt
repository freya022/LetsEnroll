package dev.freya02.letsenroll.data

import dev.freya02.letsenroll.data.serializer.EmojiSerializer
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class RolesConfigDTO @MapStructConstructor constructor(
    val messages: List<Message>,
) {

    constructor(vararg messages: Message) : this(messages.toList())

    @Serializable
    data class Message @MapStructConstructor constructor(
        val content: String,
        val components: List<Component>,
        val id: Int = 0,
    ) {

        constructor(content: String, vararg components: Component) : this(content, components.toList())

        // Subclasses are intentionally not serializable as they are represented as a single string
        @Serializable(with = EmojiSerializer::class)
        sealed interface Emoji
        data class UnicodeEmoji(val unicode: String) : Emoji
        data class CustomEmoji(val animated: Boolean, val name: String, val discordId: Snowflake) : Emoji

        @Serializable
        sealed interface Component {
            val id: Int
        }
        @Serializable
        @SerialName("row")
        data class Row @MapStructConstructor constructor(
            val components: List<Component>,
            override val id: Int = 0,
        ) : Component {
            constructor(vararg components: Component) : this(components.toList())
        }
        @Serializable
        @SerialName("button")
        data class Button(
            val roleName: String,
            val style: Style,
            val label: NullableString = null,
            val emoji: Emoji? = null,
            override val id: Int = 0,
        ) : Component {

            enum class Style {
                PRIMARY,
                SECONDARY,
                SUCCESS,
                DANGER
            }
        }
        @Serializable
        @SerialName("string_select_menu")
        data class SelectMenu @MapStructConstructor constructor(
            val placeholder: NullableString = null,
            val choices: List<Choice>,
            override val id: Int = 0,
        ) : Component {

            constructor(placeholder: NullableString = null, vararg choices: Choice) : this(placeholder, choices.toList())

            @Serializable
            data class Choice(
                val roleName: String,
                val label: String,
                val description: NullableString = null,
                val emoji: Emoji? = null,
                val id: Int = 0,
            )
        }
    }

    companion object {

        const val MAX_MESSAGES = 10
    }
}
