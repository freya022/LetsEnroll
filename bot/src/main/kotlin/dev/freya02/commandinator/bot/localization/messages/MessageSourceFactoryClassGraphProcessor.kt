package dev.freya02.commandinator.bot.localization.messages

import dev.freya02.commandinator.bot.localization.annotations.LocalizedContent
import dev.freya02.commandinator.bot.localization.annotations.MessageSourceFactory
import dev.freya02.commandinator.bot.utils.createProxy
import dev.freya02.commandinator.bot.utils.superErasureAt
import io.github.classgraph.ClassInfo
import io.github.freya022.botcommands.api.core.BContext
import io.github.freya022.botcommands.api.core.service.*
import io.github.freya022.botcommands.api.core.utils.shortQualifiedName
import io.github.freya022.botcommands.api.localization.Localization
import io.github.freya022.botcommands.api.localization.context.LocalizationContext
import io.github.freya022.botcommands.api.localization.interaction.GuildLocaleProvider
import io.github.freya022.botcommands.api.localization.interaction.UserLocaleProvider
import net.dv8tion.jda.api.interactions.Interaction
import java.lang.reflect.InvocationHandler
import kotlin.reflect.KClass
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.valueParameters
import kotlin.reflect.jvm.javaMethod
import kotlin.reflect.jvm.jvmErasure
import kotlin.reflect.jvm.kotlinFunction

private val targetFactoryMethod = IMessageSourceFactory<*>::create.javaMethod!!

object MessageSourceFactoryClassGraphProcessor : ClassGraphProcessor {

    @Suppress("UNCHECKED_CAST")
    override fun processClass(serviceContainer: ServiceContainer, classInfo: ClassInfo, kClass: KClass<*>, isService: Boolean) {
        val annotation = classInfo.getAnnotationInfo(MessageSourceFactory::class.java)?.loadClassAndInstantiate() as MessageSourceFactory? ?: return

        require(classInfo.isInterface) {
            "${classInfo.shortQualifiedName} must be an interface"
        }
        require(classInfo.implementsInterface(IMessageSourceFactory::class.java)) {
            "${classInfo.shortQualifiedName} must implement ${IMessageSourceFactory::class.simpleName}"
        }
        serviceContainer as DefaultServiceContainer

        val messageSourceFactoryType = kClass as KClass<IMessageSourceFactory<*>>
        val messageSourceType = kClass.superErasureAt<IMessageSourceFactory<*>>(0).jvmErasure as KClass<out IMessageSource>

        serviceContainer.putSuppliedService(ServiceSupplier(messageSourceFactoryType) { context ->
            createSourceFactory(context, annotation, messageSourceFactoryType, messageSourceType)
        })
    }

    private fun createSourceFactory(
        context: BContext,
        annotation: MessageSourceFactory,
        messageSourceFactoryType: KClass<IMessageSourceFactory<*>>,
        messageSourceType: KClass<out IMessageSource>
    ): IMessageSourceFactory<*> {
        val userLocaleProvider: UserLocaleProvider = context.getService()
        val guildLocaleProvider: GuildLocaleProvider = context.getService()

        val bundle = annotation.bundleName
        return messageSourceFactoryType.createProxy { proxy, method, methodArgs ->
            if (method.isDefault) {
                return@createProxy InvocationHandler.invokeDefault(proxy, method, methodArgs)
            }

            require(method == targetFactoryMethod) {
                "Method ${method.name} is not supported"
            }

            val interaction = methodArgs!![0] as Interaction
            val localizationContext = LocalizationContext.create(
                context,
                bundle,
                guildLocale = guildLocaleProvider.getDiscordLocale(interaction),
                userLocale = userLocaleProvider.getDiscordLocale(interaction)
            )

            return@createProxy createSource(messageSourceType, localizationContext)
        }
    }

    private fun <T : IMessageSource> createSource(type: KClass<T>, localizationContext: LocalizationContext): T {
        return type.createProxy { proxy, method, methodArgs ->
            if (method.isDefault) {
                return@createProxy InvocationHandler.invokeDefault(proxy, method, methodArgs)
            }

            val function = method.kotlinFunction ?: error("No Kotlin function for $method")
            val annotation = function.findAnnotation<LocalizedContent>()!!

            fun parameterName(index: Int): String = function.valueParameters[index].name!!

            val actualArgs = methodArgs ?: emptyArray()
            val localizationArgs = actualArgs.mapIndexed { index, value -> Localization.Entry(parameterName(index), value!!) }
            //Implicit return
            localizationContext.localize(annotation.templateKey, *localizationArgs.toTypedArray())
        }
    }
}