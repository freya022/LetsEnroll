package dev.freya02.commandinator.api.mapper

import dev.freya02.commandinator.api.dto.RolesConfigDTO
import dev.freya02.commandinator.api.entity.*
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.MappingTarget
import org.mapstruct.SubclassMapping

// TODO toRolesConfigDTO
@Mapper
abstract class RolesConfigMapper {

    @Mapping(target = "guildId", expression = "java(guildId)")
    abstract fun toRolesConfig(dto: RolesConfigDTO, guildId: Long): RolesConfig

    abstract fun updateRolesConfig(dto: RolesConfigDTO, @MappingTarget entity: RolesConfig): RolesConfig

    @SubclassMapping(source = RolesConfigDTO.Message.Row::class, target = RoleMessageRow::class)
    @SubclassMapping(source = RolesConfigDTO.Message.Button::class, target = RoleMessageButton::class)
    @SubclassMapping(source = RolesConfigDTO.Message.SelectMenu::class, target = RoleMessageSelectMenu::class)
    abstract fun toComponent(dto: RolesConfigDTO.Message.Component): RoleMessageComponent

    @SubclassMapping(source = RolesConfigDTO.Message.UnicodeEmoji::class, target = UnicodeEmoji::class)
    @SubclassMapping(source = RolesConfigDTO.Message.CustomEmoji::class, target = CustomEmoji::class)
    abstract fun toEmoji(dto: RolesConfigDTO.Message.Emoji): Emoji
}