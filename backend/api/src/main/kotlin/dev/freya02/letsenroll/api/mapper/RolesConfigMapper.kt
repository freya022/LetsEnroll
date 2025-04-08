package dev.freya02.letsenroll.api.mapper

import dev.freya02.letsenroll.api.entity.*
import dev.freya02.letsenroll.data.RolesConfigDTO
import org.mapstruct.*

@Mapper(
    // JPA entities are always non-final, so mapping them to DTOs 1:1 cannot be guaranteed by MapStruct
    subclassExhaustiveStrategy = SubclassExhaustiveStrategy.RUNTIME_EXCEPTION
)
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

    // Entity ==> DTO

    abstract fun toRolesConfigDTO(entity: RolesConfig): RolesConfigDTO

    @SubclassMapping(source = RoleMessageRow::class, target = RolesConfigDTO.Message.Row::class)
    @SubclassMapping(source = RoleMessageButton::class, target = RolesConfigDTO.Message.Button::class)
    @SubclassMapping(source = RoleMessageSelectMenu::class, target = RolesConfigDTO.Message.SelectMenu::class)
    abstract fun toComponentDTO(entity: RoleMessageComponent): RolesConfigDTO.Message.Component

    @SubclassMapping(source = UnicodeEmoji::class, target = RolesConfigDTO.Message.UnicodeEmoji::class)
    @SubclassMapping(source = CustomEmoji::class, target = RolesConfigDTO.Message.CustomEmoji::class)
    abstract fun toEmojiDTO(entity: Emoji): RolesConfigDTO.Message.Emoji
}