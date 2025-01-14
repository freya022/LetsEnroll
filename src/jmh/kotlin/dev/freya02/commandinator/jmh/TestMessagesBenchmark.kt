package dev.freya02.commandinator.jmh

import dev.freya02.commandinator.jmh.bot.localization.ClassFileBasedTestMessagesFactory
import dev.freya02.commandinator.jmh.bot.localization.ManualBasedTestMessagesFactory
import dev.freya02.commandinator.jmh.bot.localization.ProxyBasedTestMessagesFactory
import dev.freya02.commandinator.jmh.bot.localization.TestMessages
import io.github.freya022.botcommands.api.core.BotCommands
import io.github.freya022.botcommands.api.core.service.getService
import io.mockk.every
import io.mockk.mockk
import net.dv8tion.jda.api.interactions.DiscordLocale
import net.dv8tion.jda.api.interactions.Interaction
import org.openjdk.jmh.annotations.*
import java.util.concurrent.TimeUnit
import kotlin.random.Random

@OutputTimeUnit(TimeUnit.MICROSECONDS)
@Warmup(iterations = 2, time = 1, timeUnit = TimeUnit.SECONDS)
@Measurement(iterations = 2, time = 1, timeUnit = TimeUnit.SECONDS)
@BenchmarkMode(Mode.AverageTime)
open class TestMessagesBenchmark {

    @State(Scope.Benchmark)
    open class Lib {

        val interaction = mockk<Interaction> {
            every { userLocale } returns DiscordLocale.FRENCH
            every { guildLocale } returns DiscordLocale.ENGLISH_US
        }
        lateinit var manual: TestMessages
        lateinit var proxy: TestMessages
        lateinit var classfile: TestMessages

        @Setup
        fun setup() {
            val context = BotCommands.create {
                addSearchPath("dev.freya02.commandinator.bot.localization")
                addSearchPath("dev.freya02.commandinator.jmh.bot")

                applicationCommands {
                    enable = false
                }

                components {
                    enable = false
                }

                appEmojis {
                    enable = false
                }

                textCommands {
                    enable = false
                }

                modals {
                    enable = false
                }
            }

            manual = context.getService<ManualBasedTestMessagesFactory>().create(interaction)
            proxy = context.getService<ProxyBasedTestMessagesFactory>().create(interaction)
            classfile = context.getService<ClassFileBasedTestMessagesFactory>().create(interaction)
        }
    }

    @Benchmark
    fun proxyBasedWithNoArguments(lib: Lib): String {
        return lib.proxy.args0()
    }

    @Benchmark
    fun proxyBasedWith3Arguments(lib: Lib): String {
        return lib.proxy.args3(Random.nextBytes(16).decodeToString(), Random.nextInt(), Any())
    }

    @Benchmark
    fun classFileBasedWithNoArguments(lib: Lib): String {
        return lib.proxy.args0()
    }

    @Benchmark
    fun classFileBasedWith3Arguments(lib: Lib): String {
        return lib.proxy.args3(Random.nextBytes(16).decodeToString(), Random.nextInt(), Any())
    }

    @Benchmark
    fun manualWithNoArguments(lib: Lib): String {
        return lib.proxy.args0()
    }

    @Benchmark
    fun manualWith3Arguments(lib: Lib): String {
        return lib.proxy.args3(Random.nextBytes(16).decodeToString(), Random.nextInt(), Any())
    }
}