package dev.freya02.commandinator.jmh.bot.localization

import dev.freya02.commandinator.bot.localization.annotations.LocalizedContent
import io.github.freya022.botcommands.api.core.BContext
import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.github.freya022.botcommands.api.core.utils.findAnnotationRecursive
import io.github.freya022.botcommands.api.localization.Localization
import io.github.freya022.botcommands.api.localization.context.LocalizationContext
import io.github.freya022.botcommands.api.localization.context.localize
import io.github.freya022.botcommands.api.localization.interaction.GuildLocaleProvider
import io.github.freya022.botcommands.api.localization.interaction.UserLocaleProvider
import net.dv8tion.jda.api.interactions.Interaction
import java.lang.classfile.ClassBuilder
import java.lang.classfile.ClassFile
import java.lang.classfile.TypeKind
import java.lang.constant.ClassDesc
import java.lang.constant.ConstantDescs
import java.lang.constant.MethodTypeDesc
import java.lang.invoke.MethodHandles
import java.lang.reflect.InvocationHandler
import java.lang.reflect.Method
import java.lang.reflect.Proxy
import kotlin.Int
import kotlin.String
import kotlin.reflect.KFunction
import kotlin.reflect.full.declaredFunctions
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.valueParameters
import kotlin.reflect.jvm.jvmErasure
import kotlin.reflect.jvm.kotlinFunction
import java.lang.String as JavaString

interface TestMessagesFactory {
    fun create(event: Interaction): TestMessages
}

@BService
class ProxyBasedTestMessagesFactory(
    private val context: BContext,
    private val guildLocaleProvider: GuildLocaleProvider,
    private val userLocaleProvider: UserLocaleProvider,
) : TestMessagesFactory {

    override fun create(event: Interaction): TestMessages {
        val localizationContext = LocalizationContext.create(
            context,
            "test-responses",
            guildLocale = guildLocaleProvider.getDiscordLocale(event),
            userLocale = userLocaleProvider.getDiscordLocale(event)
        )

        return Proxy.newProxyInstance(TestMessages::class.java.classLoader, arrayOf(TestMessages::class.java)) { proxy, method: Method, methodArgs: Array<Any?>? ->
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
        } as TestMessages
    }
}

@Suppress("PLATFORM_CLASS_MAPPED_TO_KOTLIN")
@BService
class ClassFileBasedTestMessagesFactory(
    private val context: BContext,
    private val guildLocaleProvider: GuildLocaleProvider,
    private val userLocaleProvider: UserLocaleProvider,
) : TestMessagesFactory {

    private val clazz = run {
        val classFile = ClassFile.of()
        val newClassDesc = ClassDesc.of("dev.freya02.commandinator.bot.localization", "TestMessagesImplGenerated")
        val newClassBytes = classFile.build(newClassDesc) { classBuilder ->
            classBuilder.withFlags(ClassFile.ACC_PUBLIC or ClassFile.ACC_FINAL)
            classBuilder.withInterfaceSymbols(classDesc<TestMessages>())

            classBuilder.withField("localizationContext", classDesc<LocalizationContext>(), ClassFile.ACC_PRIVATE or ClassFile.ACC_FINAL)

            classBuilder.withMethodBody(
                ConstantDescs.INIT_NAME,
                MethodTypeDesc.of(ConstantDescs.CD_void, classDesc<LocalizationContext>()),
                ClassFile.ACC_PUBLIC
            ) { codeBuilder ->
                val thisSlot = codeBuilder.receiverSlot()
                val localizationContextSlot = codeBuilder.parameterSlot(0) //Parameter, not field

                // this.super()
                codeBuilder.aload(thisSlot)
                codeBuilder.invokespecial(ConstantDescs.CD_Object, ConstantDescs.INIT_NAME, MethodTypeDesc.of(ConstantDescs.CD_void))

                // this.localizationContext = localizationContext
                codeBuilder.aload(thisSlot)
                codeBuilder.aload(localizationContextSlot)
                codeBuilder.putfield(newClassDesc, "localizationContext", classDesc<LocalizationContext>())

                // Required
                codeBuilder.return_()
            }

            TestMessages::class.declaredFunctions.forEach {
                classBuilder.withLocalizedContentFunction(it, newClassDesc)
            }
        }

        MethodHandles.lookup().defineClass(newClassBytes)
    }
    private val constructor = MethodHandles.lookup().unreflectConstructor(clazz.constructors[0])

    private fun ClassBuilder.withLocalizedContentFunction(
        function: KFunction<*>,
        newClassDesc: ClassDesc
    ): ClassBuilder {
        val templateKey = function.findAnnotationRecursive<LocalizedContent>()!!.templateKey

        val valueParameters = function.valueParameters
        val parameterDescList = valueParameters.map { it.type.jvmErasure.java.describeConstable().get() }

        return withMethodBody(
            function.name,
            MethodTypeDesc.of(ConstantDescs.CD_String, parameterDescList),
            ClassFile.ACC_PUBLIC or ClassFile.ACC_FINAL
        ) { codeBuilder ->
            with(codeBuilder) {
                val thisSlot = receiverSlot()
                val argsSlot = allocateLocal(TypeKind.REFERENCE)
                val parameterSlots = List(valueParameters.size) { paramNo -> parameterSlot(paramNo) }

                // val args = arrayOfNulls<Localization.Entry>(valueParameters.size)
                loadConstant(valueParameters.size)
                anewarray(classDesc<Localization.Entry>())
                astore(argsSlot)

                // args[n] = Localization.Entry(parameterNames[n], parameterValues[n])
                val entrySlot = allocateLocal(TypeKind.REFERENCE) // Reuse the same slot for each entry
                parameterSlots.forEachIndexed { index, parameterSlot ->
                    // entry = Localization.Entry(parameterName, parameterValue)
                    new_(classDesc<Localization.Entry>())
                    dup() // Duplicate for <init> and astore
                    loadConstant(valueParameters[index].name!! as JavaString)
                    run { // Box parameter and load
                        val parameterClazz = valueParameters[index].type.jvmErasure.java
                        if (parameterClazz.isPrimitive) {
                            when (parameterClazz) {
                                Int::class.java -> {
                                    iload(parameterSlot)
                                    invokestatic(ConstantDescs.CD_Integer, "valueOf", MethodTypeDesc.of(ConstantDescs.CD_Integer, ConstantDescs.CD_int))
                                }
                                else -> TODO(parameterClazz.name)
                            }
                        } else {
                            aload(parameterSlot)
                        }
                    }
                    invokespecial(classDesc<Localization.Entry>(), ConstantDescs.INIT_NAME, MethodTypeDesc.of(ConstantDescs.CD_void, ConstantDescs.CD_String, ConstantDescs.CD_Object))
                    astore(entrySlot)

                    // args[n] = entry
                    aload(argsSlot)
                    loadConstant(index)
                    aload(entrySlot)
                    aastore()
                }

                // return this.localizationContext.localize(templateKey, args)
                aload(thisSlot)
                getfield(newClassDesc, "localizationContext", classDesc<LocalizationContext>())
                loadConstant(templateKey as JavaString)
                aload(argsSlot)
                invokeinterface(classDesc<LocalizationContext>(), "localize", MethodTypeDesc.of(ConstantDescs.CD_String, ConstantDescs.CD_String, classDesc<Localization.Entry>().arrayType()))
                areturn()
            }
        }
    }

    override fun create(event: Interaction): TestMessages {
        val localizationContext = LocalizationContext.create(
            context,
            "test-responses",
            guildLocale = guildLocaleProvider.getDiscordLocale(event),
            userLocale = userLocaleProvider.getDiscordLocale(event)
        )
        return constructor.invoke(localizationContext) as TestMessages
    }

    private inline fun <reified T : Any> classDesc(): ClassDesc = ClassDesc.of(T::class.java.name)
}

@BService
class ManualBasedTestMessagesFactory(
    private val context: BContext,
    private val guildLocaleProvider: GuildLocaleProvider,
    private val userLocaleProvider: UserLocaleProvider,
) : TestMessagesFactory {

    override fun create(event: Interaction): TestMessages {
        val localizationContext = LocalizationContext.create(
            context,
            "test-responses",
            guildLocale = guildLocaleProvider.getDiscordLocale(event),
            userLocale = userLocaleProvider.getDiscordLocale(event)
        )

        return object : TestMessages {
            override fun args0(): String {
                return localizationContext.localize("setup.version.message.content")
            }

            override fun args3(string: String, int: Int, any: Any): String {
                return localizationContext.localize("setup.test4", "string" to string, "int" to int, "any" to any)
            }
        }
    }
}