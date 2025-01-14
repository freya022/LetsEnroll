package dev.freya02.commandinator.bot.localization.annotations

@MustBeDocumented
@Target(AnnotationTarget.FUNCTION)
annotation class LocalizedContent(val templateKey: String)