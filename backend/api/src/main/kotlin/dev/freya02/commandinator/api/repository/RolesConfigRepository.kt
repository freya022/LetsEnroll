package dev.freya02.commandinator.api.repository

import dev.freya02.commandinator.api.entity.RolesConfig
import org.springframework.data.jpa.repository.JpaRepository

interface RolesConfigRepository : JpaRepository<RolesConfig, Int> {
    fun existsByGuildId(guildId: Long): Boolean

    fun findByGuildId(guildId: Long): RolesConfig
}