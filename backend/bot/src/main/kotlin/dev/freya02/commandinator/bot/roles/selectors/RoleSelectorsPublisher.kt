package dev.freya02.commandinator.bot.roles.selectors

import dev.freya02.commandinator.api.dto.PublishSelectorsDTO
import dev.freya02.commandinator.api.dto.RolesConfigDTO
import dev.freya02.commandinator.bot.roles.selectors.exceptions.ChannelNotFoundException
import dev.freya02.commandinator.bot.roles.selectors.exceptions.GuildNotFoundException
import dev.freya02.commandinator.bot.utils.getOrCreateRole
import dev.freya02.commandinator.bot.utils.none
import dev.minn.jda.ktx.coroutines.await
import dev.minn.jda.ktx.generics.getChannel
import dev.minn.jda.ktx.interactions.components.SelectOption
import dev.minn.jda.ktx.interactions.components.row
import dev.minn.jda.ktx.messages.InlineMessage
import dev.minn.jda.ktx.messages.Mentions
import dev.minn.jda.ktx.messages.MessageCreate
import io.github.freya022.botcommands.api.components.Button
import io.github.freya022.botcommands.api.components.Buttons
import io.github.freya022.botcommands.api.components.SelectMenus
import io.github.freya022.botcommands.api.components.StringSelectMenu
import io.github.freya022.botcommands.api.components.builder.bindWith
import io.github.freya022.botcommands.api.components.utils.ButtonContent
import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.github.freya022.botcommands.api.utils.EmojiUtils
import net.dv8tion.jda.api.JDA
import net.dv8tion.jda.api.entities.Guild
import net.dv8tion.jda.api.entities.Role
import net.dv8tion.jda.api.entities.channel.middleman.GuildMessageChannel
import net.dv8tion.jda.api.entities.emoji.Emoji
import net.dv8tion.jda.api.interactions.components.ActionRow
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle
import net.dv8tion.jda.api.interactions.components.selections.SelectOption

@BService
class RoleSelectorsPublisher(
    private val buttons: Buttons,
    private val selectMenus: SelectMenus,
) {

    suspend fun publish(jda: JDA, guildId: Long, data: PublishSelectorsDTO) {
        val guild = jda.getGuildById(guildId)
            ?: throw GuildNotFoundException("Guild with ID $guildId not found")
        val channel = guild.getChannel<GuildMessageChannel>(data.channelId)
            ?: throw ChannelNotFoundException("Channel with ID ${data.channelId} not found")

        data.config.messages
            .map { message -> message.toJDA(guild) }
            .forEach { channel.sendMessage(it).await() }
    }

    private suspend fun RolesConfigDTO.Message.toJDA(guild: Guild) = MessageCreate(mentions = Mentions.none()) {
        content = this@toJDA.content

        components += this@toJDA.components.map { component ->
            when (component) {
                is RolesConfigDTO.Message.Row -> component.toJDA(guild, this)
                is RolesConfigDTO.Message.Button -> error("Button is not top level")
                is RolesConfigDTO.Message.SelectMenu -> error("Select menu is not top level")
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

        return buttons.of(ButtonContent(style.name.let(ButtonStyle::valueOf), label, emoji?.toJDA(), false))
            .persistent {
                bindWith(RoleSelectorsHandler::onToggleClicked, role.name)
            }
    }

    private suspend fun RolesConfigDTO.Message.SelectMenu.toJDA(
        guild: Guild,
        builder: InlineMessage<*>
    ): StringSelectMenu {
        return selectMenus.stringSelectMenu().persistent {
            placeholder = this@toJDA.placeholder
            options += this@toJDA.choices.map { choice -> choice.toJDA(guild, builder) }

            bindWith(RoleSelectorsHandler::onRoleSelect, this@toJDA.choices.map { it.roleName })
        }
    }

    private suspend fun RolesConfigDTO.Message.SelectMenu.Choice.toJDA(
        guild: Guild,
        builder: InlineMessage<*>
    ): SelectOption {
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
}