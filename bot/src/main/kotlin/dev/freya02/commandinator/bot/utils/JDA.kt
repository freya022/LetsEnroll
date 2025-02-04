package dev.freya02.commandinator.bot.utils

import dev.minn.jda.ktx.messages.MentionConfig
import dev.minn.jda.ktx.messages.Mentions

private val noMentions = Mentions(
    MentionConfig.users(emptyList()),
    MentionConfig.roles(emptyList()),
    everyone = false,
    here = false,
)

fun Mentions.Companion.none(): Mentions = noMentions