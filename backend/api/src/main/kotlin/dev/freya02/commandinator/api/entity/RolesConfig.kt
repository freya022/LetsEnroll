package dev.freya02.commandinator.api.entity

import jakarta.persistence.*

@Entity
data class RolesConfig(
    val guildId: Long,
    @OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
    @JoinColumn(name = "config_id")
    val messages: MutableList<RoleMessage>,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
)