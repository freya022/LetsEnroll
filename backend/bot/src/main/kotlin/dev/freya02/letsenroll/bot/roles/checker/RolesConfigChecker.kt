package dev.freya02.letsenroll.bot.roles.checker

import dev.freya02.letsenroll.bot.roles.selectors.exceptions.GuildNotFoundException
import dev.freya02.letsenroll.data.RolesConfigDTO
import dev.minn.jda.ktx.coroutines.await
import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.github.freya022.botcommands.api.utils.EmojiUtils
import net.dv8tion.jda.api.JDA
import net.dv8tion.jda.api.entities.Message
import net.dv8tion.jda.api.entities.emoji.RichCustomEmoji
import net.dv8tion.jda.api.interactions.components.buttons.Button
import net.dv8tion.jda.api.interactions.components.selections.SelectMenu
import net.dv8tion.jda.api.interactions.components.selections.SelectOption
import java.util.*
import kotlin.reflect.KProperty0

@BService
class RolesConfigChecker {

    suspend fun check(jda: JDA, guildId: Long, data: RolesConfigDTO): List<RolesConfigError> {
        val guild = jda.getGuildById(guildId) ?: throw GuildNotFoundException("Guild with ID $guildId not found")

        return CheckerSession(guild.retrieveEmojis().await()).apply {
            verify(data)
        }.errors
    }
}

private class CheckerSession(private val customEmojis: List<RichCustomEmoji>) {

    private val _errors: MutableList<RolesConfigError> = mutableListOf()
    val errors: List<RolesConfigError> get() = _errors

    private val pathKeys: Stack<String> = Stack()

    fun verify(data: RolesConfigDTO) {
        data::messages.withContext { messages ->
            checkInline({ messages.isNotEmpty() }) { "Must contain at least 1 message" }
            checkInline({ messages.size <= RolesConfigDTO.MAX_MESSAGES }) { "Must contain at most ${RolesConfigDTO.MAX_MESSAGES} message" }
        }

        data::messages.forEachContext { message ->
            message::content.check({ isNotBlank() }) {
                "Must be less than ${Message.MAX_CONTENT_LENGTH} characters"
            }
            message::content.check({ length <= Message.MAX_CONTENT_LENGTH }) {
                "Must be less than ${Message.MAX_CONTENT_LENGTH} characters"
            }

            message::components.withContext { components ->
                checkInline({ components.isNotEmpty() }) { "Must contain at least 1 top-level component"  }
                checkInline({ components.size <= Message.MAX_COMPONENT_COUNT }) { "Must contain at most ${Message.MAX_COMPONENT_COUNT} top-level components"  }
            }

            message::components.forEachContext { component ->
                component.verify(parent = null)
            }
        }
    }

    private fun RolesConfigDTO.Message.Component.verify(parent: RolesConfigDTO.Message.Component?) {
        when (this) {
            is RolesConfigDTO.Message.Row -> {
                checkInline({ parent == null }) { "Row must have no parent" }

                checkInline({ components.isNotEmpty() }) { "Row must not be empty" }
                checkInline({ components.size <= Message.MAX_COMPONENT_COUNT }) {
                    "Row needs less than ${Message.MAX_COMPONENT_COUNT} components"
                }

                ::components.forEachContext { component ->
                    component.verify(parent = this)
                }
            }

            is RolesConfigDTO.Message.Button -> {
                checkInline({ parent is RolesConfigDTO.Message.Row }) { "Button must be in a row" }

                ::roleName.check({ isNotBlank() }) { "Must not be blank" }
                ::roleName.check({ length <= 100 }) { "Must be under 100 characters" }

                // This is an inline check as an "either" requirement must be shown on the object and not the property
                checkInline({ !label.isNullOrBlank() || emoji != null }) { "Label or emoji is required" }
                ::label.check({ this == null || this.length <= Button.LABEL_MAX_LENGTH }) {
                    "Must be under ${Button.LABEL_MAX_LENGTH} characters"
                }

                ::emoji.withContext {
                    emoji?.verify()
                }
            }

            is RolesConfigDTO.Message.SelectMenu -> {
                checkInline({ parent is RolesConfigDTO.Message.Row }) { "Select menu must be in a row" }

                ::placeholder.check({ this == null || length <= SelectMenu.PLACEHOLDER_MAX_LENGTH }) {
                    "Must be less than ${SelectMenu.PLACEHOLDER_MAX_LENGTH} characters"
                }

                checkInline({ choices.isNotEmpty() }) { "Must have at least one choice" }
                checkInline({ choices.size <= SelectMenu.OPTIONS_MAX_AMOUNT }) {
                    "Select menu must have at most ${SelectMenu.OPTIONS_MAX_AMOUNT} choices"
                }
                ::choices.forEachContext { choice -> choice.verify() }
            }
        }
    }

    private fun RolesConfigDTO.Message.SelectMenu.Choice.verify() {
        ::roleName.check({ isNotBlank() }) { "Must be not be blank" }
        ::roleName.check({ length <= 100 }) { "Must be under 100 characters" }

        ::label.check({ isNotBlank() }) { "Must not be blank" }
        ::label.check({ length <= SelectOption.LABEL_MAX_LENGTH }) { "Must be under ${SelectOption.LABEL_MAX_LENGTH} characters" }

        ::description.check({ this == null || length <= SelectOption.DESCRIPTION_MAX_LENGTH }) { "Must be under ${SelectOption.DESCRIPTION_MAX_LENGTH} characters" }

        ::emoji.withContext {
            emoji?.verify()
        }
    }

    private fun RolesConfigDTO.Message.Emoji.verify() {
        when (this) {
            is RolesConfigDTO.Message.CustomEmoji -> {
                ::discordId.check({ customEmojis.any { this == it.idLong } }) {
                    "Does not exist / is not from this guild"
                }
            }

            is RolesConfigDTO.Message.UnicodeEmoji -> {
                ::unicode.check({ EmojiUtils.resolveEmojiOrNull(this) != null }) {
                    "Must be a valid unicode or Discord alias (like :joy:) emoji"
                }
            }
        }
    }

    private fun checkInline(check: () -> Boolean, message: () -> String) {
        if (!check()) {
            appendError(lastKey = null, message())
        }
    }

    private fun <T> KProperty0<T>.check(check: T.() -> Boolean, message: () -> String) {
        if (!check(get())) {
            appendError(name, message())
        }
    }

    private inline fun <T> KProperty0<Iterable<T>>.forEachContext(block: (T) -> Unit) {
        get().forEachIndexed { index, t ->
            withContext("$name.$index") {
                block(t)
            }
        }
    }

    private inline fun <T> KProperty0<T>.withContext(block: (T) -> Unit) {
        withContext(name) {
            block(get())
        }
    }

    private inline fun withContext(name: String, block: () -> Unit) {
        pathKeys.push(name)
        try {
            block()
        } finally {
            pathKeys.pop()
        }
    }

    private fun appendError(lastKey: String?, message: String) {
        _errors += RolesConfigError(pathKeys.joinToString(".") + if (lastKey != null) ".$lastKey" else "", message)
    }
}