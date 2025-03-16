package dev.freya02.commandinator.api.mapper

import dev.freya02.commandinator.api.dto.RolesConfigDTO
import dev.freya02.commandinator.api.entity.*
import dev.freya02.commandinator.api.service.RoleConfigService
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.SubclassMapping

// TODO toRolesConfigDTO
@Mapper(imports = [RoleConfigService::class])
abstract class RolesConfigMapper {

    @Mapping(target = "guildId", expression = "java(RoleConfigService.getGuildId())")
    abstract fun toRolesConfig(dto: RolesConfigDTO): RolesConfig

    @SubclassMapping(source = RolesConfigDTO.Message.Row::class, target = RoleMessageRow::class)
    @SubclassMapping(source = RolesConfigDTO.Message.Button::class, target = RoleMessageButton::class)
    @SubclassMapping(source = RolesConfigDTO.Message.SelectMenu::class, target = RoleMessageSelectMenu::class)
    abstract fun toComponent(dto: RolesConfigDTO.Message.Component): RoleMessageComponent

    @SubclassMapping(source = RolesConfigDTO.Message.UnicodeEmoji::class, target = UnicodeEmoji::class)
    @SubclassMapping(source = RolesConfigDTO.Message.CustomEmoji::class, target = CustomEmoji::class)
    abstract fun toEmoji(dto: RolesConfigDTO.Message.Emoji): Emoji
}