@file:Suppress("JpaDataSourceORMInspection") // IJ is dumb

package dev.freya02.commandinator.api.entity

import jakarta.persistence.*

enum class ComponentType {
    ROW,
    BUTTON,
    SELECT_MENU
}

// TODO test if this being abstract doesn't cause issues when you remove one of the subclass's @Entity
//  (try printing freshly retrieved entity, must not be retrieved from cache)
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
abstract class RoleMessageComponent(
    @Enumerated(EnumType.STRING)
    val type: ComponentType,
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
) : RoleMessageComponent(ComponentType.ROW)

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
) : RoleMessageComponent(ComponentType.BUTTON)

@Entity
@PrimaryKeyJoinColumn(name = "component_id")
data class RoleMessageSelectMenu(
    val placeholder: String?,
    @OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
    @JoinColumn(name = "menu_id", nullable = false)
    val choices: MutableList<RoleMessageSelectMenuChoice> = arrayListOf(),
) : RoleMessageComponent(ComponentType.SELECT_MENU)

@Entity
data class RoleMessageSelectMenuChoice(
    val roleName: String,
    val label: String,
    val description: String? = null,
    @ManyToOne(cascade = [CascadeType.ALL])
    val emoji: Emoji? = null,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
)