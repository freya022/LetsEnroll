package dev.freya02.letsenroll.bot.localization

import dev.freya02.letsenroll.bot.localization.annotations.MessageSourceFactory
import dev.freya02.letsenroll.bot.localization.messages.IMessageSourceFactory

@MessageSourceFactory("responses")
interface SetupMessagesFactory : IMessageSourceFactory<SetupMessages>