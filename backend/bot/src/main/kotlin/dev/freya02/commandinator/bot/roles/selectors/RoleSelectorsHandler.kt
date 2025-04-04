package dev.freya02.commandinator.bot.roles.selectors

import dev.freya02.commandinator.bot.localization.SetupMessagesFactory
import dev.freya02.commandinator.bot.utils.getOrCreateRole
import dev.minn.jda.ktx.coroutines.await
import dev.minn.jda.ktx.messages.reply_
import io.github.freya022.botcommands.api.components.annotations.ComponentData
import io.github.freya022.botcommands.api.components.annotations.JDAButtonListener
import io.github.freya022.botcommands.api.components.annotations.JDASelectMenuListener
import io.github.freya022.botcommands.api.components.event.ButtonEvent
import io.github.freya022.botcommands.api.components.event.StringSelectEvent
import io.github.freya022.botcommands.api.components.serialization.annotations.SerializableComponentData
import io.github.freya022.botcommands.api.core.annotations.Handler
import io.github.freya022.botcommands.api.core.utils.awaitUnit
import io.github.freya022.botcommands.api.core.utils.enumSetOf
import io.github.freya022.botcommands.api.localization.DefaultMessagesFactory
import net.dv8tion.jda.api.Permission

private typealias RoleName = String

@Handler
class RoleSelectorsHandler(
    private val defaultMessagesFactory: DefaultMessagesFactory,
    private val setupMessagesFactory: SetupMessagesFactory,
) {

    //TODO if we want to support predefined roles, then we should give the row ID instead,
    // then read DB to either get/create role by name, or get by id
    @JDAButtonListener
    suspend fun onToggleClicked(event: ButtonEvent, @ComponentData roleName: String) {
        val member = event.member!!
        val guild = member.guild
        if (!guild.selfMember.hasPermission(Permission.MANAGE_ROLES)) {
            val botPermErrorMsg = defaultMessagesFactory.get(event).getBotPermErrorMsg(enumSetOf(Permission.MANAGE_ROLES))
            return event.reply_(botPermErrorMsg, ephemeral = true).awaitUnit()
        }

        val messages = setupMessagesFactory.create(event)
        val role = guild.getOrCreateRole(roleName)
        if (role in member.roles) {
            guild.removeRoleFromMember(member, role).await()
            event.reply(messages.getRoleRemovedResponse(role.id))
                .setEphemeral(true)
                .setAllowedMentions(emptyList())
                .await()
        } else {
            guild.addRoleToMember(member, role).await()
            event.reply(messages.getRoleAddedResponse(role.id))
                .setEphemeral(true)
                .setAllowedMentions(emptyList())
                .await()
        }
    }

    @JDASelectMenuListener
    suspend fun onRoleSelect(event: StringSelectEvent, @SerializableComponentData roleGroupNames: List<RoleName>) =
        applyRole(event, event.values[0], roleGroupNames)

    private suspend fun applyRole(event: StringSelectEvent, roleName: RoleName, roleGroupNames: List<RoleName>) {
        require(roleName in roleGroupNames) {
            "Role '$roleName' is not in role group: $roleGroupNames"
        }

        val member = event.member!!
        val guild = member.guild
        if (!guild.selfMember.hasPermission(Permission.MANAGE_ROLES)) {
            val botPermErrorMsg =
                defaultMessagesFactory.get(event).getBotPermErrorMsg(enumSetOf(Permission.MANAGE_ROLES))
            return event.reply_(botPermErrorMsg, ephemeral = true).awaitUnit()
        }

        val messages = setupMessagesFactory.create(event)
        val role = guild.getOrCreateRole(roleName)
        val roleGroup = roleGroupNames.map { guild.getOrCreateRole(it) }

        // Remove existing roles
        (roleGroup - role).filter { it in member.roles }.forEach { removableRole ->
            guild.removeRoleFromMember(member, removableRole).await()
        }

        // Add the role
        guild.addRoleToMember(member, role).await()
        event.reply(messages.getAppliedRolesResponse(role.id))
            .setEphemeral(true)
            .setAllowedMentions(emptyList())
            .await()
    }
}