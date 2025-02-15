package dev.freya02.commandinator.jmh.bot

import io.github.freya022.botcommands.api.core.JDAService
import io.github.freya022.botcommands.api.core.events.BReadyEvent
import io.github.freya022.botcommands.api.core.service.annotations.BService
import net.dv8tion.jda.api.hooks.IEventManager
import net.dv8tion.jda.api.requests.GatewayIntent
import net.dv8tion.jda.api.utils.cache.CacheFlag

@BService
class Bot : JDAService() {

    override val cacheFlags: Set<CacheFlag> = emptySet()
    override val intents: Set<GatewayIntent> = emptySet()

    override fun createJDA(event: BReadyEvent, eventManager: IEventManager) {}
}