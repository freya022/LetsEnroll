package dev.freya02.commandinator.bot.utils

import dev.minn.jda.ktx.coroutines.await
import dev.minn.jda.ktx.messages.MentionConfig
import dev.minn.jda.ktx.messages.Mentions
import net.dv8tion.jda.api.entities.Guild
import net.dv8tion.jda.api.entities.Role

private val noMentions = Mentions(
    MentionConfig.users(emptyList()),
    MentionConfig.roles(emptyList()),
    everyone = false,
    here = false,
)

fun Mentions.Companion.none(): Mentions = noMentions

suspend fun Guild.getOrCreateRole(name: String): Role {
    val existingRole = getRolesByName(name, false).singleOrNull()
    if (existingRole == null) {
        return createRole()
            .setPermissions(emptySet())
            .setName(name)
            .await()
    } else if (!selfMember.canInteract(existingRole)) {
        return createRole()
            .setPermissions(emptySet())
            .setName(name)
            .reason("Existing role (${existingRole.id}) cannot be interacted with")
            .await()
    }

    return existingRole
}