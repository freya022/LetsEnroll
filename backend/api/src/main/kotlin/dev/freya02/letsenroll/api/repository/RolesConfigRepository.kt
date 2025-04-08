package dev.freya02.letsenroll.api.repository

import dev.freya02.letsenroll.api.entity.RolesConfig
import org.springframework.data.jpa.repository.JpaRepository

interface RolesConfigRepository : JpaRepository<RolesConfig, Int> {
    fun existsByGuildId(guildId: Long): Boolean

    fun findByGuildId(guildId: Long): RolesConfig?
}