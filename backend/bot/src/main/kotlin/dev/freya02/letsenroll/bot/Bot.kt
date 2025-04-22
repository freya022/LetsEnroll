package dev.freya02.letsenroll.bot

import dev.freya02.letsenroll.bot.config.Config
import io.github.freya022.botcommands.api.core.JDAService
import io.github.freya022.botcommands.api.core.events.BReadyEvent
import io.github.freya022.botcommands.api.core.light
import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.github.freya022.botcommands.api.core.utils.enumSetOf
import net.dv8tion.jda.api.entities.Activity
import net.dv8tion.jda.api.hooks.IEventManager
import net.dv8tion.jda.api.requests.GatewayIntent
import net.dv8tion.jda.api.utils.cache.CacheFlag

@BService
class Bot(
    private val config: Config,
    private val memberCachePolicy: BotMemberCachePolicy,
) : JDAService() {

    override val cacheFlags: Set<CacheFlag> = enumSetOf(CacheFlag.EMOJI)
    override val intents: Set<GatewayIntent> = enumSetOf(GatewayIntent.GUILD_EXPRESSIONS)

    override fun createJDA(event: BReadyEvent, eventManager: IEventManager) {
        light(config.token, activity = Activity.customStatus("Overengineering stuff"), memberCachePolicy = memberCachePolicy) {

        }
    }
}