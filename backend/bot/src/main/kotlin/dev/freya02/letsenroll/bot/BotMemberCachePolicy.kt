package dev.freya02.letsenroll.bot

import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.github.freya022.botcommands.api.core.utils.namedDefaultScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import net.dv8tion.jda.api.JDA
import net.dv8tion.jda.api.entities.Member
import net.dv8tion.jda.api.utils.MemberCachePolicy
import java.util.*
import kotlin.time.Duration.Companion.hours

private const val maxMembers = 100
private val timeout = 6.hours

@BService
class BotMemberCachePolicy : MemberCachePolicy {

    private val timeoutScheduler = namedDefaultScope("Member cache", 1)
    private val cache: MutableList<Long> = LinkedList()
    private val timeouts: MutableMap<Long, Job> = HashMap()

    override fun cacheMember(member: Member): Boolean {
        handleLeastRecentlyUsed(member.jda, member.idLong)
        scheduleRemoval(member.idLong)
        return true
    }

    private fun handleLeastRecentlyUsed(jda: JDA, id: Long) {
        val index = cache.indexOf(id)

        // Member is already most recent, avoid further operations
        if (index == 0) return

        if (index > 0) {
            cache.removeAt(index)
        } else if (cache.size > maxMembers) {
            val leastRecentMemberId = cache.removeFirst()
            jda.unloadUser(leastRecentMemberId)
        }

        cache += id
    }

    private fun scheduleRemoval(id: Long) {
        timeouts[id]?.cancel()
        timeouts[id] = timeoutScheduler.launch {
            delay(timeout)
            cache -= id
        }
    }
}