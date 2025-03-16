package dev.freya02.commandinator.api.entity

import jakarta.persistence.*

@Entity
data class RoleMessage(
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