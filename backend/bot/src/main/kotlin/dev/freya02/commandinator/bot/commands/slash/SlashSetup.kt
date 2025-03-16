package dev.freya02.commandinator.bot.commands.slash

import dev.freya02.commandinator.api.dto.RolesConfigDTO
import dev.freya02.commandinator.bot.api.roles.RolesConfigAPI
import dev.freya02.commandinator.bot.localization.SetupMessagesFactory
import dev.freya02.commandinator.bot.utils.none
import dev.minn.jda.ktx.coroutines.await
import dev.minn.jda.ktx.interactions.components.SelectOption
import dev.minn.jda.ktx.interactions.components.row
import dev.minn.jda.ktx.messages.InlineMessage
import dev.minn.jda.ktx.messages.Mentions
import dev.minn.jda.ktx.messages.MessageCreate
import dev.minn.jda.ktx.messages.reply_
import io.github.freya022.botcommands.api.commands.annotations.BotPermissions
import io.github.freya022.botcommands.api.commands.annotations.Command
import io.github.freya022.botcommands.api.commands.application.ApplicationCommand
import io.github.freya022.botcommands.api.commands.application.slash.GuildSlashEvent
import io.github.freya022.botcommands.api.commands.application.slash.annotations.JDASlashCommand
import io.github.freya022.botcommands.api.commands.application.slash.annotations.SlashOption
import io.github.freya022.botcommands.api.commands.application.slash.annotations.TopLevelSlashCommandData
import io.github.freya022.botcommands.api.components.Button
import io.github.freya022.botcommands.api.components.Buttons
import io.github.freya022.botcommands.api.components.SelectMenus
import io.github.freya022.botcommands.api.components.StringSelectMenu
import io.github.freya022.botcommands.api.components.annotations.ComponentData
import io.github.freya022.botcommands.api.components.annotations.JDAButtonListener
import io.github.freya022.botcommands.api.components.annotations.JDASelectMenuListener
import io.github.freya022.botcommands.api.components.builder.bindWith
import io.github.freya022.botcommands.api.components.event.ButtonEvent
import io.github.freya022.botcommands.api.components.event.StringSelectEvent
import io.github.freya022.botcommands.api.components.serialization.annotations.SerializableComponentData
import io.github.freya022.botcommands.api.components.utils.ButtonContent
import io.github.freya022.botcommands.api.core.utils.awaitUnit
import io.github.freya022.botcommands.api.core.utils.enumSetOf
import io.github.freya022.botcommands.api.localization.DefaultMessagesFactory
import io.github.freya022.botcommands.api.utils.EmojiUtils
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.entities.Guild
import net.dv8tion.jda.api.entities.Role
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel
import net.dv8tion.jda.api.entities.emoji.Emoji
import net.dv8tion.jda.api.interactions.components.ActionRow
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle
import net.dv8tion.jda.api.interactions.components.selections.SelectOption

private typealias RoleName = String

@Command
class SlashSetup(
    private val rolesConfigAPI: RolesConfigAPI,
    private val buttons: Buttons,
    private val selectMenus: SelectMenus,
    private val defaultMessagesFactory: DefaultMessagesFactory,
    private val setupMessagesFactory: SetupMessagesFactory,
) : ApplicationCommand() {

    // Descriptions are in [[commands.yaml]]
    @JDASlashCommand(name = "setup")
    @BotPermissions(Permission.MANAGE_ROLES)
    @TopLevelSlashCommandData(defaultLocked = true)
    suspend fun onSlashSetup(
        event: GuildSlashEvent,
        @SlashOption channel: TextChannel
    ) {
        event.deferReply(true).queue()

        //TODO should this still exist?
        // Maybe website-only
        val guild = event.guild
        rolesConfigAPI.test()
            .messages
            .map { message -> message.toJDA(guild) }
            //TODO find a good way to delete all messages if one fails
            .forEach { channel.sendMessage(it).await() }

        event.hook.sendUser("setup.done")
            .setEphemeral(true)
            .await()
    }

    private suspend fun RolesConfigDTO.Message.toJDA(guild: Guild) = MessageCreate(mentions = Mentions.none()) {
        content = this@toJDA.content

        components += this@toJDA.components.map { component ->
            when (component) {
                is RolesConfigDTO.Message.Row -> component.toJDA(guild, this)
                is RolesConfigDTO.Message.Button -> error("Button is not top level")
                is RolesConfigDTO.Message.SelectMenu -> error("Button is not top level")
            }
        }
    }

    private suspend fun RolesConfigDTO.Message.Row.toJDA(guild: Guild, builder: InlineMessage<*>): ActionRow {
        return components.map { component ->
            when (component) {
                is RolesConfigDTO.Message.Row -> error("Can't new rows")
                is RolesConfigDTO.Message.Button -> component.toJDA(guild, builder)
                is RolesConfigDTO.Message.SelectMenu -> component.toJDA(guild, builder)
            }
        }.row()
    }

    private suspend fun RolesConfigDTO.Message.Button.toJDA(guild: Guild, builder: InlineMessage<*>): Button {
        val role = guild.getOrCreateRole(roleName)
        builder.replaceRoleTemplates(role)

        return buttons.of(ButtonContent(style.name.let(ButtonStyle::valueOf), label, emoji?.toJDA(), false)).persistent {
            bindWith(SlashSetup::onToggleClicked, role.name)
        }
    }

    private suspend fun RolesConfigDTO.Message.SelectMenu.toJDA(guild: Guild, builder: InlineMessage<*>): StringSelectMenu {
        return selectMenus.stringSelectMenu().persistent {
            placeholder = this@toJDA.placeholder
            options += this@toJDA.choices.map { choice -> choice.toJDA(guild, builder) }

            bindWith(SlashSetup::onRoleSelect, this@toJDA.choices.map { it.roleName })
        }
    }

    private suspend fun RolesConfigDTO.Message.SelectMenu.Choice.toJDA(guild: Guild, builder: InlineMessage<*>): SelectOption {
        val role = guild.getOrCreateRole(roleName)
        builder.replaceRoleTemplates(role)

        return SelectOption(label, role.name, description, emoji?.toJDA())
    }

    private fun RolesConfigDTO.Message.Emoji.toJDA(): Emoji {
        return when (this) {
            is RolesConfigDTO.Message.CustomEmoji -> Emoji.fromCustom(name, discordId, animated)
            is RolesConfigDTO.Message.UnicodeEmoji -> EmojiUtils.resolveJDAEmoji(unicode)
        }
    }

    private fun InlineMessage<*>.replaceRoleTemplates(role: Role) {
        content = content?.replace("{roleId[${role.name}]}", role.id)
    }

    private suspend fun Guild.getOrCreateRole(name: String): Role {
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
            event.reply(messages.getBcUpdatesRemovedResponse(role.id))
                .setEphemeral(true)
                .setAllowedMentions(emptyList())
                .await()
        } else {
            guild.addRoleToMember(member, role).await()
            event.reply(messages.getBcUpdatesAddedResponse(role.id))
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
        event.reply(messages.getAppliedRolesMessageContent(role.id))
            .setEphemeral(true)
            .setAllowedMentions(emptyList())
            .await()
    }
}
