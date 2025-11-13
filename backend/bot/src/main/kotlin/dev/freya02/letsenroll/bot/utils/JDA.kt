package dev.freya02.letsenroll.bot.utils

import dev.freya02.botcommands.jda.ktx.coroutines.await
import net.dv8tion.jda.api.entities.Guild
import net.dv8tion.jda.api.entities.Role

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
