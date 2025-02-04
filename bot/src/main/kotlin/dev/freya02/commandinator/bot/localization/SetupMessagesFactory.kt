package dev.freya02.commandinator.bot.localization

import dev.freya02.commandinator.bot.localization.annotations.MessageSourceFactory
import dev.freya02.commandinator.bot.localization.messages.IMessageSourceFactory

@MessageSourceFactory("responses")
interface SetupMessagesFactory : IMessageSourceFactory<SetupMessages>