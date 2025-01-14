package dev.freya02.commandinator.bot.localization

import dev.freya02.commandinator.bot.localization.annotations.LocalizedContent

interface SetupMessages {
    //TODO make those accept a (discord)locale as they're mostly used with the guild locale
    // maybe the annotation itself can contain a user/guild locale switch
    @LocalizedContent("setup.version.message.content")
    fun getVersionMessageContent(): String

    @LocalizedContent("setup.version.components.select_menu.options.v3.description")
    fun getV3SelectOptionDescription(): String

    @LocalizedContent("setup.version.components.select_menu.options.v2.description")
    fun getV2SelectOptionDescription(): String


    @LocalizedContent("setup.language.message.content")
    fun getLanguageMessageContent(): String

    @LocalizedContent("setup.language.components.select_menu.options.kotlin.description")
    fun getKotlinSelectOptionDescription(): String

    @LocalizedContent("setup.language.components.select_menu.options.java.description")
    fun getJavaSelectOptionDescription(): String


    @LocalizedContent("setup.build_tool.message.content")
    fun getBuildToolMessageContent(): String

    @LocalizedContent("setup.build_tool.components.select_menu.options.maven.description")
    fun getMavenSelectOptionDescription(): String

    @LocalizedContent("setup.build_tool.components.select_menu.options.gradle.description")
    fun getGradleSelectOptionDescription(): String


    @LocalizedContent("setup.di.message.content")
    fun getDiMessageContent(): String

    @LocalizedContent("setup.di.components.select_menu.options.builtin.description")
    fun getBuiltinSelectOptionDescription(): String

    @LocalizedContent("setup.di.components.select_menu.options.spring.description")
    fun getSpringSelectOptionDescription(): String


    @LocalizedContent("setup.bc_updates.message.content")
    fun getBcUpdatesMessageContent(roleId: String): String

    @LocalizedContent("setup.bc_updates.components.toggle.label")
    fun getBcUpdatesToggleLabel(): String

    @LocalizedContent("setup.bc_updates.components.toggle.responses.added")
    fun getBcUpdatesAddedResponse(roleId: String): String

    @LocalizedContent("setup.bc_updates.components.toggle.responses.removed")
    fun getBcUpdatesRemovedResponse(roleId: String): String


    @LocalizedContent("setup.applied_role")
    fun getAppliedRolesMessageContent(roleId: String): String
}