package dev.freya02.commandinator.api.service

import dev.freya02.commandinator.api.dto.RolesConfigDTO
import dev.freya02.commandinator.api.exceptions.NoSuchRolesConfigException
import dev.freya02.commandinator.api.exceptions.RolesConfigEmptyException
import dev.freya02.commandinator.api.mapper.RolesConfigMapper
import dev.freya02.commandinator.api.mapper.mapper
import dev.freya02.commandinator.api.repository.RolesConfigRepository
import org.springframework.stereotype.Service

private val mapper: RolesConfigMapper = mapper()

@Service
class RolesConfigService(
    private val rolesConfigRepository: RolesConfigRepository,
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
}