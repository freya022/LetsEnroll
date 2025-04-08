package dev.freya02.letsenroll.bot.localization

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory
import io.github.freya022.botcommands.api.core.BContext
import io.github.freya022.botcommands.api.core.service.annotations.BConfiguration
import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.github.freya022.botcommands.api.localization.readers.JacksonLocalizationMapReader
import io.github.freya022.botcommands.api.localization.readers.LocalizationMapReader

@BConfiguration
object BotLocalizationMapReaderProvider {

    @BService
    fun botLocalizationMapReader(context: BContext): LocalizationMapReader {
        return JacksonLocalizationMapReader.createWithDefaultTemplate(
            context,
            ObjectMapper(YAMLFactory()),
            "bot_localization",
            listOf("yaml")
        )
    }
}