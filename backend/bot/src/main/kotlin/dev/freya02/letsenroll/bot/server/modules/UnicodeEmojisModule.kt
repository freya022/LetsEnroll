package dev.freya02.letsenroll.bot.server.modules

import dev.freya02.letsenroll.bot.server.resources.Emojis
import dev.freya02.letsenroll.data.UnicodeEmojiDTO
import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.ktor.server.application.*
import io.ktor.server.resources.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import net.dv8tion.jda.api.JDA
import net.fellbaum.jemoji.Fitzpatrick
import net.fellbaum.jemoji.Emojis as JEmojis

@BService
object UnicodeEmojisModule : KtorModule {

    private val emojiData: List<UnicodeEmojiDTO> = run {
        fun String.fixEmojiUnicode(): String {
            return when (codePointAt(0)) {
                // Relaxed, hash, zero..nine
                0x23, 0x2a, in 0x30..0x39 -> replace("\uFE0F", "")
                // Use "unqualified" variants of simple emojis
                else -> if (codePoints().count() == 2L) {
                    trimEnd('\uFE0F')
                } else {
                    this
                }
            }
        }

        val baseEmojis = JEmojis.EMOJI_LIST
            .filter { it.discordAliases.isNotEmpty() }
            // Don't take emojis that have more than one fitzpatrick, such as handshakes, as Discord doesn't support that
            .filter { emoji -> Fitzpatrick.entries.count { emoji.emoji.contains(it.unicode) } <= 1 }
            // Emojis with skin tones exist twice, one without fitzpatrick and one with
            // additionally remove all \uFE0F just for grouping purposes
            // as some emojis have it right in the middle, and they're just for joining purposes
            .groupBy { it.emoji.let(Fitzpatrick::removeFitzpatrick).replace("\uFE0F", "") }
            .map { (_, variants) ->
                val neutralVariant = variants.firstOrNull { !it.hasFitzpatrickComponent() }
                    ?: error("No neutral for $variants")

                UnicodeEmojiDTO(
                    neutralVariant.discordAliases,
                    neutralVariant.emoji.fixEmojiUnicode(),
                    variants.filter { it.hasFitzpatrickComponent() }.map { it.emoji.fixEmojiUnicode() }
                )
            }

        // JEmojis doesn't include regional indicators https://github.com/felldo/JEmoji/issues/44
        val regionalIndicators = ('a'..'z').map { char ->
            UnicodeEmojiDTO(
                aliases = listOf(":regional_indicator_$char:"),
                unicode = "\uD83C${'\uDDE6' + (char - 'a')}",
                variants = emptyList(),
            )
        }

        baseEmojis + regionalIndicators
    }

    override fun Application.defineModule(jda: JDA) {
        routing {
            getGuildEmojis()
        }
    }

    private fun Route.getGuildEmojis() = get<Emojis> { _ ->
        call.respond(emojiData)
    }
}