package dev.freya02.letsenroll.api.entity

import dev.freya02.letsenroll.data.MapStructConstructor
import jakarta.persistence.*

@Entity
data class RoleMessage @MapStructConstructor constructor(
    val content: String,
    @OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
    @JoinTable(
        name = "role_message_role_message_component",
        joinColumns = [JoinColumn(name = "message_id", nullable = false)],
        inverseJoinColumns = [JoinColumn(name = "component_id", nullable = false)],
    )
    val components: MutableList<RoleMessageComponent>,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
)