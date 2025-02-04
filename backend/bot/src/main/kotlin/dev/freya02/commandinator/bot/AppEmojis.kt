package dev.freya02.commandinator.bot

import io.github.freya022.botcommands.api.emojis.AppEmojisRegistry
import io.github.freya022.botcommands.api.emojis.annotations.AppEmojiContainer
import net.dv8tion.jda.api.entities.emoji.ApplicationEmoji

@AppEmojiContainer
object AppEmojis {
    val kotlin: ApplicationEmoji by AppEmojisRegistry.lazy(::kotlin)
    val java: ApplicationEmoji by AppEmojisRegistry.lazy(::java)

    val maven: ApplicationEmoji by AppEmojisRegistry.lazy(::maven)
    val gradle: ApplicationEmoji by AppEmojisRegistry.lazy(::gradle)

    val bc: ApplicationEmoji by AppEmojisRegistry.lazy(::bc)
    val spring: ApplicationEmoji by AppEmojisRegistry.lazy(::spring)
}