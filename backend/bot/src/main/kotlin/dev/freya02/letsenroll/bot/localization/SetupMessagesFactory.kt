package dev.freya02.letsenroll.bot.localization

import dev.freya02.botcommands.typesafe.messages.api.IMessageSourceFactory
import dev.freya02.botcommands.typesafe.messages.api.annotations.ExperimentalTypesafeMessagesApi
import dev.freya02.botcommands.typesafe.messages.api.annotations.MessageSourceFactory

@OptIn(ExperimentalTypesafeMessagesApi::class)
@MessageSourceFactory("responses", ignoreEmptyLocales = true)
interface SetupMessagesFactory : IMessageSourceFactory<SetupMessages>
