package dev.freya02.letsenroll.jmh.bot.localization

import dev.freya02.letsenroll.bot.localization.annotations.LocalizedContent

interface TestMessages {
    @LocalizedContent("test.args0")
    fun args0(): String

    @LocalizedContent("test.args3")
    fun args3(string: String, int: Int, any: Any): String
}