package dev.freya02.commandinator.api.entity

import jakarta.persistence.*

@Entity
data class RoleMessage(
    val content: String,
    // TODO should use a 3rd table to join message <-> top-level components
    //  so we don't have message_id on every component
    @OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
    @JoinColumn(name = "message_id")
    val messageComponents: MutableList<RoleMessageComponent>,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
)