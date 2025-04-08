package dev.freya02.commandinator.api.service

import dev.freya02.commandinator.api.bot.BotClient
import dev.freya02.commandinator.api.exceptions.NoSuchRolesConfigException
import dev.freya02.commandinator.api.exceptions.RolesConfigEmptyException
import dev.freya02.commandinator.api.mapper.RolesConfigMapper
import dev.freya02.commandinator.api.mapper.mapper
import dev.freya02.commandinator.api.repository.RolesConfigRepository
import dev.freya02.letsenroll.data.PublishSelectorsDTO
import dev.freya02.letsenroll.data.RolesConfigDTO
import org.springframework.stereotype.Service

private val mapper: RolesConfigMapper = mapper()

@Service
class RolesConfigService(
    private val rolesConfigRepository: RolesConfigRepository,
    private val botClient: BotClient,
) {

    fun upsertConfig(guildId: Long, config: RolesConfigDTO) {
        if (config.messages.isEmpty())
            throw RolesConfigEmptyException("The configuration contains no messages.")

        val entity = rolesConfigRepository.findByGuildId(guildId)
        if (entity != null) {
            rolesConfigRepository.save(mapper.updateRolesConfig(config, entity))
        } else {
            rolesConfigRepository.save(mapper.toRolesConfig(config, guildId))
        }
    }

    fun retrieveConfig(guildId: Long): RolesConfigDTO {
        val rolesConfig = rolesConfigRepository.findByGuildId(guildId)
            ?: throw NoSuchRolesConfigException("No roles config found for guild $guildId")

        return mapper.toRolesConfigDTO(rolesConfig)
    }

    fun publishSelectors(guildId: Long, channelId: Long) {
        val config = retrieveConfig(guildId)
        botClient.publishRoleSelectors(guildId, PublishSelectorsDTO(channelId, config))
    }
}