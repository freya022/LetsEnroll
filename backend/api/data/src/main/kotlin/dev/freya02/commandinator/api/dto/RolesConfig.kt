package dev.freya02.commandinator.api.dto

import kotlinx.serialization.Serializable

@Serializable
data class RolesConfig(
    val messages: List<Message>,
) {

    @Serializable
    data class Message(
        val content: String,
        val components: List<List<Component>>,
    ) {

        @Serializable
        sealed interface Emoji
        @Serializable
        data class UnicodeEmoji(val unicode: String) : Emoji
        @Serializable
        data class CustomEmoji(val animated: Boolean, val name: String, val id: Long) : Emoji

        @Serializable
        sealed interface Component
        @Serializable
        data class Button(
            val roleName: String,
            val style: Style,
            val label: String? = null,
            val emoji: Emoji? = null,
        ) : Component {

            enum class Style {
                PRIMARY,
                SECONDARY,
                SUCCESS,
                DANGER
            }
        }
        @Serializable
        data class SelectMenu(
            val placeholder: String? = null,
            val choices: List<Choice>,
        ) : Component {

            @Serializable
            data class Choice(
                val roleName: String,
                val label: String,
                val description: String? = null,
                val emoji: Emoji? = null,
            )
        }
    }
}