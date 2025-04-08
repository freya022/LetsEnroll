package dev.freya02.commandinator.bot

import dev.minn.jda.ktx.events.CoroutineEventManager
import io.github.freya022.botcommands.api.core.ICoroutineEventManagerSupplier
import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.github.freya022.botcommands.api.core.utils.namedDefaultScope

@BService
class CoroutineEventManagerSupplier : ICoroutineEventManagerSupplier {

    override fun get(): CoroutineEventManager {
        return namedDefaultScope("Let's Enroll Coroutine", 4).let(::CoroutineEventManager)
    }
}