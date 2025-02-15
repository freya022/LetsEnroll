package dev.freya02.commandinator.bot.localization

import dev.freya02.commandinator.bot.localization.annotations.LocalizedContent
import dev.freya02.commandinator.bot.localization.messages.IMessageSource

interface SetupMessages : IMessageSource {
    //TODO make those accept a (discord)locale as they're mostly used with the guild locale
    // maybe the annotation itself can contain a user/guild locale switch
    @LocalizedContent("setup.added_role")
    fun getBcUpdatesAddedResponse(roleId: String): String

    @LocalizedContent("setup.removed_role")
    fun getBcUpdatesRemovedResponse(roleId: String): String

    @LocalizedContent("setup.applied_roles")
    fun getAppliedRolesMessageContent(roleId: String): String
}