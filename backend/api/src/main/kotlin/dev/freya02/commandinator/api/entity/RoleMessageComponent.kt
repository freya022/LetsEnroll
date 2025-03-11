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
class RoleMessageRow(

) : RoleMessageComponent() {
    @OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
    @JoinColumn(name = "parent_id")
    val components: MutableList<RoleMessageComponent> = arrayListOf()
}

@Entity
@PrimaryKeyJoinColumn(name = "component_id")
data class RoleMessageButton(
    val label: String,
) : RoleMessageComponent()

@Entity
@PrimaryKeyJoinColumn(name = "component_id")
data class RoleMessageSelectMenu(
    val placeholder: String?,
) : RoleMessageComponent()