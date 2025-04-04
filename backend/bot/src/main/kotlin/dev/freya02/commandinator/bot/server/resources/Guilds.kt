package dev.freya02.commandinator.bot.server.resources

import io.ktor.resources.*

@Resource("/guilds")
class Guilds {

    @Resource("{guildId}")
    class Id(val guilds: Guilds, val guildId: Long) {

        @Resource("members")
        class Members(val guild: Guilds.Id) {

            @Resource("{userId}")
            class Id(val members: Members, val userId: Long)
        }

        @Resource("channels")
        class Channels(val guild: Id)
    }
}