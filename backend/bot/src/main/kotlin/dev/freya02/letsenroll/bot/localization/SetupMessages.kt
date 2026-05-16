package dev.freya02.letsenroll.bot.localization

import dev.freya02.botcommands.typesafe.messages.api.IMessageSource
import dev.freya02.botcommands.typesafe.messages.api.annotations.ExperimentalTypesafeMessagesApi
import dev.freya02.botcommands.typesafe.messages.api.annotations.LocalizedContent

@OptIn(ExperimentalTypesafeMessagesApi::class)
interface SetupMessages : IMessageSource {
    @LocalizedContent("setup.added_role")
    fun getRoleAddedResponse(roleId: String): String

    @LocalizedContent("setup.removed_role")
    fun getRoleRemovedResponse(roleId: String): String

    @LocalizedContent("setup.applied_roles")
    fun getAppliedRolesResponse(roleId: String): String
}
