package dev.freya02.commandinator.bot.localization

import dev.freya02.commandinator.bot.localization.annotations.LocalizedContent
import io.github.freya022.botcommands.api.core.BContext
import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.github.freya022.botcommands.api.core.service.annotations.InterfacedService
import io.github.freya022.botcommands.api.localization.Localization
import io.github.freya022.botcommands.api.localization.context.LocalizationContext
import io.github.freya022.botcommands.api.localization.interaction.GuildLocaleProvider
import io.github.freya022.botcommands.api.localization.interaction.UserLocaleProvider
import net.dv8tion.jda.api.interactions.Interaction
import java.lang.reflect.InvocationHandler
import java.lang.reflect.Method
import java.lang.reflect.Proxy
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.valueParameters
import kotlin.reflect.jvm.kotlinFunction

@InterfacedService(acceptMultiple = false)
interface SetupMessagesFactory {
    fun create(event: Interaction): SetupMessages
}

@BService
class ProxyBasedSetupMessagesFactory(
    private val context: BContext,
    private val guildLocaleProvider: GuildLocaleProvider,
    private val userLocaleProvider: UserLocaleProvider,
) : SetupMessagesFactory {

    override fun create(event: Interaction): SetupMessages {
        val localizationContext = LocalizationContext.create(
            context,
            "responses",
            guildLocale = guildLocaleProvider.getDiscordLocale(event),
            userLocale = userLocaleProvider.getDiscordLocale(event)
        )

        return Proxy.newProxyInstance(SetupMessages::class.java.classLoader, arrayOf(SetupMessages::class.java)) { proxy, method: Method, methodArgs: Array<Any?>? ->
            if (method.isDefault) {
                return@newProxyInstance InvocationHandler.invokeDefault(proxy, method, methodArgs)
            }

            val function = method.kotlinFunction ?: error("No Kotlin function for $method")
            val annotation = function.findAnnotation<LocalizedContent>()!!

            fun parameterName(index: Int): String = function.valueParameters[index].name!!

            val actualArgs = methodArgs ?: emptyArray()
            val localizationArgs = actualArgs.mapIndexed { index, value -> Localization.Entry(parameterName(index), value!!) }
            //Implicit return
            localizationContext.localize(annotation.templateKey, *localizationArgs.toTypedArray())
        } as SetupMessages
    }
}
