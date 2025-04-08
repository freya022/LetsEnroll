package dev.freya02.letsenroll.bot.server.modules

import io.github.freya022.botcommands.api.core.service.annotations.InterfacedService
import io.ktor.server.application.*
import net.dv8tion.jda.api.JDA

@InterfacedService(acceptMultiple = true)
interface KtorModule {
    fun Application.defineModule(jda: JDA)
}