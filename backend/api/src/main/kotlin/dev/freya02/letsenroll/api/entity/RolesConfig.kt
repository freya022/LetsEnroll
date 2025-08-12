package dev.freya02.letsenroll.api.entity

import dev.freya02.letsenroll.data.MapStructConstructor
import jakarta.persistence.*

@Entity
data class RolesConfig(
    val guildId: Long,
    @OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
    @JoinColumn(name = "config_id", nullable = false)
    val messages: MutableList<RoleMessage>,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,
) {

    @MapStructConstructor
    constructor(
        guildId: Long,
        messages: MutableList<RoleMessage>,
    ) : this(guildId, messages, id = 0)
}
