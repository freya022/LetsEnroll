@file:Suppress("JpaDataSourceORMInspection") // IJ is dumb

package dev.freya02.commandinator.api.entity

import jakarta.persistence.*

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
class RoleMessageComponent(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
)

@Entity
@PrimaryKeyJoinColumn(name = "component_id")
data class RoleMessageRow(
    @OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
    @JoinColumn(name = "parent_id", nullable = false)
    val components: MutableList<RoleMessageComponent> = arrayListOf(),
) : RoleMessageComponent()

enum class ButtonStyle {
    PRIMARY,
    SECONDARY,
    SUCCESS,
    DANGER
}

@Entity
@PrimaryKeyJoinColumn(name = "component_id")
data class RoleMessageButton(
    val roleName: String,
    @Enumerated(EnumType.STRING)
    val style: ButtonStyle,
    val label: String? = null,
    @ManyToOne(cascade = [CascadeType.ALL])
    val emoji: Emoji? = null,
) : RoleMessageComponent()

@Entity
@PrimaryKeyJoinColumn(name = "component_id")
data class RoleMessageSelectMenu(
    val placeholder: String?,
) : RoleMessageComponent()