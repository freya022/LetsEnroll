@file:Suppress("JpaDataSourceORMInspection") // IJ is dumb

package dev.freya02.letsenroll.api.entity

import dev.freya02.letsenroll.data.MapStructConstructor
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
    override val id: Int,
) : RoleMessageComponent(ComponentType.ROW, id) {

    @MapStructConstructor
    constructor(components: MutableList<RoleMessageComponent>): this(components, id = 0)
}

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
    val label: String?,
    @ManyToOne(cascade = [CascadeType.ALL])
    val emoji: Emoji?,
    override val id: Int,
) : RoleMessageComponent(ComponentType.BUTTON) {

    @MapStructConstructor
    constructor(roleName: String, style: ButtonStyle, label: String? = null, emoji: Emoji? = null) : this(roleName, style, label, emoji, 0)
}

@Entity
@PrimaryKeyJoinColumn(name = "component_id")
data class RoleMessageSelectMenu(
    val placeholder: String?,
    @OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
    @JoinColumn(name = "menu_id", nullable = false)
    val choices: MutableList<RoleMessageSelectMenuChoice>,
    override val id: Int,
) : RoleMessageComponent(ComponentType.SELECT_MENU) {

    @MapStructConstructor
    constructor(
        placeholder: String?,
        choices: MutableList<RoleMessageSelectMenuChoice> = arrayListOf(),
    ) : this(placeholder, choices, id = 0)
}

@Entity
data class RoleMessageSelectMenuChoice(
    val roleName: String,
    val label: String,
    val description: String?,
    @ManyToOne(cascade = [CascadeType.ALL])
    val emoji: Emoji?,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,
) {

    @MapStructConstructor
    constructor(
        roleName: String,
        label: String,
        description: String? = null,
        emoji: Emoji? = null,
    ) : this(roleName, label, description, emoji, id = 0)
}
