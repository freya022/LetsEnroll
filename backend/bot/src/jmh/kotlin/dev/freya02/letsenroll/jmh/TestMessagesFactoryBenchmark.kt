package dev.freya02.letsenroll.jmh

import dev.freya02.letsenroll.jmh.bot.localization.ClassFileBasedTestMessagesFactory
import dev.freya02.letsenroll.jmh.bot.localization.ManualBasedTestMessagesFactory
import dev.freya02.letsenroll.jmh.bot.localization.ProxyBasedTestMessagesFactory
import dev.freya02.letsenroll.jmh.bot.localization.TestMessages
import io.github.freya022.botcommands.api.core.BotCommands
import io.github.freya022.botcommands.api.core.service.getService
import io.mockk.every
import io.mockk.mockk
import net.dv8tion.jda.api.interactions.DiscordLocale
import net.dv8tion.jda.api.interactions.Interaction
import org.openjdk.jmh.annotations.*
import java.util.concurrent.TimeUnit

@OutputTimeUnit(TimeUnit.MICROSECONDS)
@Warmup(iterations = 2, time = 1, timeUnit = TimeUnit.SECONDS)
@Measurement(iterations = 2, time = 1, timeUnit = TimeUnit.SECONDS)
@BenchmarkMode(Mode.AverageTime)
open class TestMessagesFactoryBenchmark {

    @State(Scope.Benchmark)
    open class Lib {

        val interaction = mockk<Interaction> {
            every { userLocale } returns DiscordLocale.FRENCH
            every { guildLocale } returns DiscordLocale.ENGLISH_US
        }
        lateinit var manual: ManualBasedTestMessagesFactory
        lateinit var proxy: ProxyBasedTestMessagesFactory
        lateinit var classfile: ClassFileBasedTestMessagesFactory

        @Setup
        fun setup() {
            val context = BotCommands.create {
                addSearchPath("dev.freya02.letsenroll.bot.localization")
                addSearchPath("dev.freya02.letsenroll.jmh.bot")

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

            manual = context.getService()
            proxy = context.getService()
            classfile = context.getService()
        }
    }

    @Benchmark
    fun proxyBased(lib: Lib): TestMessages {
        return lib.proxy.create(lib.interaction)
    }

    @Benchmark
    fun classFileBased(lib: Lib): TestMessages {
        return lib.classfile.create(lib.interaction)
    }

    @Benchmark
    fun manual(lib: Lib): TestMessages {
        return lib.manual.create(lib.interaction)
    }
}