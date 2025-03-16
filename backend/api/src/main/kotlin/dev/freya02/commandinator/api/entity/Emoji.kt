package dev.freya02.commandinator.api.entity

import jakarta.persistence.*

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
class Emoji(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0
)

@Entity
@DiscriminatorValue("UNICODE")
data class UnicodeEmoji(
    val unicode: String,
) : Emoji()

@Entity
@DiscriminatorValue("CUSTOM")
data class CustomEmoji(
    val discordId: Long,
    val name: String,
    val animated: Boolean
) : Emoji()