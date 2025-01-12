package dev.freya02.commandinator.bot.commands.slash

import dev.freya02.commandinator.bot.AppEmojis
import dev.minn.jda.ktx.coroutines.await
import dev.minn.jda.ktx.interactions.components.SelectOption
import dev.minn.jda.ktx.interactions.components.row
import dev.minn.jda.ktx.messages.Mentions
import dev.minn.jda.ktx.messages.MessageCreate
import dev.minn.jda.ktx.messages.reply_
import io.github.freya022.botcommands.api.commands.annotations.Command
import io.github.freya022.botcommands.api.commands.application.ApplicationCommand
import io.github.freya022.botcommands.api.commands.application.slash.GuildSlashEvent
import io.github.freya022.botcommands.api.commands.application.slash.annotations.JDASlashCommand
import io.github.freya022.botcommands.api.commands.application.slash.annotations.SlashOption
import io.github.freya022.botcommands.api.components.Buttons
import io.github.freya022.botcommands.api.components.SelectMenus
import io.github.freya022.botcommands.api.components.annotations.JDAButtonListener
import io.github.freya022.botcommands.api.components.annotations.JDASelectMenuListener
import io.github.freya022.botcommands.api.components.builder.bindWith
import io.github.freya022.botcommands.api.components.event.ButtonEvent
import io.github.freya022.botcommands.api.components.event.StringSelectEvent
import io.github.freya022.botcommands.api.core.utils.awaitUnit
import io.github.freya022.botcommands.api.core.utils.enumSetOf
import io.github.freya022.botcommands.api.core.utils.lazyUnicodeEmoji
import io.github.freya022.botcommands.api.localization.DefaultMessagesFactory
import io.github.freya022.botcommands.api.localization.LocalizableAction
import io.github.freya022.botcommands.api.localization.interaction.getGuildMessage
import io.github.freya022.botcommands.api.localization.interaction.replyUser
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.entities.Guild
import net.dv8tion.jda.api.entities.Role
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel
import net.dv8tion.jda.api.entities.emoji.Emoji
import net.dv8tion.jda.api.interactions.components.selections.SelectOption
import net.fellbaum.jemoji.Emojis

private typealias RoleName = String

private val bell by lazyUnicodeEmoji { Emojis.BELL }
private val fire by lazyUnicodeEmoji { Emojis.FIRE }
private val confused by lazyUnicodeEmoji { Emojis.CONFUSED_FACE }

@Command
class SlashSetup(
    private val buttons: Buttons,
    private val selectMenus: SelectMenus,
    private val defaultMessagesFactory: DefaultMessagesFactory,
) : ApplicationCommand() {

    // Descriptions are in [[commands.yaml]]
    @JDASlashCommand(name = "setup")
    suspend fun onSlashSetup(
        event: GuildSlashEvent,
        @SlashOption channel: TextChannel
    ) {
        event.deferReply(true).queue()

        val guild = event.guild
        val versionMessage = MessageCreate {
            event.withPrefix("setup.version") {
                content = event.getGuildMessage("message.content")

                components += row(selectMenus.stringSelectMenu().persistent {
                    event.withAppendedPrefix("components.select_menu") {
                        options += guild.getOrCreateRole("V3").toOption(event.getGuildMessage("options.v3.description"), emoji = fire)
                        options += guild.getOrCreateRole("V2").toOption(event.getGuildMessage("options.v2.description"), emoji = confused)
                    }

                    bindWith(::onVersionRoleSelect)
                })
            }
        }

        val languageMessage = MessageCreate {
            event.withPrefix("setup.language") {
                content = event.getGuildMessage("message.content")

                components += row(selectMenus.stringSelectMenu().persistent {
                    event.withAppendedPrefix("components.select_menu") {
                        options += guild.getOrCreateRole("Kotlin").toOption(event.getGuildMessage("options.kotlin.description"), AppEmojis.kotlin)
                        options += guild.getOrCreateRole("Java").toOption(event.getGuildMessage("options.java.description"), AppEmojis.java)
                    }

                    bindWith(::onLanguageRoleSelect)
                })
            }
        }

        val buildToolMessage = MessageCreate {
            event.withPrefix("setup.build_tool") {
                content = event.getGuildMessage("message.content")

                components += row(selectMenus.stringSelectMenu().persistent {
                    event.withAppendedPrefix("components.select_menu") {
                        options += guild.getOrCreateRole("Maven").toOption(event.getGuildMessage("options.maven.description"), AppEmojis.maven)
                        options += guild.getOrCreateRole("Gradle").toOption(event.getGuildMessage("options.gradle.description"), AppEmojis.gradle)
                    }

                    bindWith(::onBuildToolRoleSelect)
                })
            }
        }

        val diMessage = MessageCreate {
            event.withPrefix("setup.di") {
                content = event.getGuildMessage("message.content")

                components += row(selectMenus.stringSelectMenu().persistent {
                    event.withAppendedPrefix("components.select_menu") {
                        options += guild.getOrCreateRole("Built-in DI").toOption(event.getGuildMessage("options.builtin.description"), AppEmojis.bc)
                        options += guild.getOrCreateRole("Spring").toOption(event.getGuildMessage("options.spring.description"), AppEmojis.spring)
                    }

                    bindWith(::onDiRoleSelect)
                })
            }
        }

        val bcUpdatesMessage = MessageCreate(mentions = Mentions.of()) {
            event.withPrefix("setup.bc_updates") {
                content = event.getGuildMessage("message.content", "roleId" to guild.getOrCreateRole("BC Updates").id)

                event.withAppendedPrefix("components.toggle") {
                    components += row(buttons.success(event.getGuildMessage("label"), emoji = bell).persistent {
                        bindWith(::onToggleBcUpdatePingsClicked)
                    })
                }
            }
        }

        //TODO find a good way to delete all messages if one fails
        channel.sendMessage(versionMessage).await()
        channel.sendMessage(languageMessage).await()
        channel.sendMessage(buildToolMessage).await()
        channel.sendMessage(diMessage).await()
        channel.sendMessage(bcUpdatesMessage).await()

        event.hook.sendUser("setup.done")
            .setEphemeral(true)
            .await()
    }

    private suspend fun Guild.getOrCreateRole(name: String): Role {
        val existingRole = getRolesByName(name, false).singleOrNull()
        if (existingRole == null) {
            return createRole()
                .setPermissions(enumSetOf()) // No permissions
                .setName(name)
                .await()
        } else if (!selfMember.canInteract(existingRole)) {
            return createRole()
                .setPermissions(enumSetOf()) // No permissions
                .setName(name)
                .reason("Existing role (${existingRole.id}) cannot be interacted with")
                .await()
        }

        return existingRole
    }

    private fun Role.toOption(description: String, emoji: Emoji?): SelectOption =
        SelectOption(name, name, description, emoji)

    @JDAButtonListener
    suspend fun onToggleBcUpdatePingsClicked(event: ButtonEvent) {
        val member = event.member!!
        val guild = member.guild
        if (!guild.selfMember.hasPermission(Permission.MANAGE_ROLES)) {
            val botPermErrorMsg = defaultMessagesFactory.get(event).getBotPermErrorMsg(enumSetOf(Permission.MANAGE_ROLES))
            return event.reply_(botPermErrorMsg, ephemeral = true).awaitUnit()
        }

        val role = guild.getOrCreateRole("BC Updates")
        event.withPrefix("setup.bc_updates.components.toggle") {
            if (role in member.roles) {
                guild.removeRoleFromMember(member, role).await()
                event.replyUser("responses.removed", "roleId" to role.id)
                    .setEphemeral(true)
                    .setAllowedMentions(emptyList())
                    .await()
            } else {
                guild.addRoleToMember(member, role).await()
                event.replyUser("responses.added", "roleId" to role.id)
                    .setEphemeral(true)
                    .setAllowedMentions(emptyList())
                    .await()
            }
        }
    }

    @JDASelectMenuListener
    suspend fun onVersionRoleSelect(event: StringSelectEvent) = applyRole(event, event.values[0], listOf("V3", "V2"))

    @JDASelectMenuListener
    suspend fun onLanguageRoleSelect(event: StringSelectEvent) = applyRole(event, event.values[0], listOf("Kotlin", "Java"))

    @JDASelectMenuListener
    suspend fun onBuildToolRoleSelect(event: StringSelectEvent) = applyRole(event, event.values[0], listOf("Maven", "Gradle"))

    @JDASelectMenuListener
    suspend fun onDiRoleSelect(event: StringSelectEvent) = applyRole(event, event.values[0], listOf("Built-in DI", "Spring"))

    private suspend fun applyRole(event: StringSelectEvent, roleName: RoleName, roleGroupNames: List<RoleName>) {
        require(roleName in roleGroupNames)

        val member = event.member!!
        val guild = member.guild
        if (!guild.selfMember.hasPermission(Permission.MANAGE_ROLES)) {
            val botPermErrorMsg =
                defaultMessagesFactory.get(event).getBotPermErrorMsg(enumSetOf(Permission.MANAGE_ROLES))
            return event.reply_(botPermErrorMsg, ephemeral = true).awaitUnit()
        }

        val role = guild.getOrCreateRole(roleName)
        val roleGroup = roleGroupNames.map { guild.getOrCreateRole(it) }

        // Remove existing roles
        (roleGroup - role).filter { it in member.roles }.forEach { removableRole ->
            guild.removeRoleFromMember(member, removableRole).await()
        }

        // Add the role
        guild.addRoleToMember(member, role).await()
        event.replyUser("setup.applied_roles", "roleId" to role.id)
            .setEphemeral(true)
            .setAllowedMentions(emptyList())
            .await()
    }
}

private inline fun LocalizableAction.withPrefix(prefix: String, block: () -> Unit) {
    val oldPrefix = localizationPrefix
    try {
        localizationPrefix = prefix
        block()
    } finally {
        localizationPrefix = oldPrefix
    }
}

private inline fun LocalizableAction.withAppendedPrefix(prefix: String, block: () -> Unit) {
    val oldPrefix = localizationPrefix
    try {
        localizationPrefix = when {
            oldPrefix != null -> "$oldPrefix.$prefix"
            else -> prefix
        }
        block()
    } finally {
        localizationPrefix = oldPrefix
    }
}