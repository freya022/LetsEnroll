package dev.freya02.commandinator.api.entity

import dev.freya02.commandinator.api.dto.MapStructConstructor
import jakarta.persistence.*

@Entity
data class RolesConfig @MapStructConstructor constructor(
    val guildId: Long,
    @OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
    @JoinColumn(name = "config_id", nullable = false)
    val messages: MutableList<RoleMessage>,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
)