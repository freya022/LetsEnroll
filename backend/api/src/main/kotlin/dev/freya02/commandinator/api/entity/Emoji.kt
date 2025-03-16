package dev.freya02.commandinator.api.entity

import dev.freya02.commandinator.api.mapper.MapStructConstructor
import jakarta.persistence.*

// TODO test if this being abstract doesn't cause issues when you remove one of the subclass's @Entity
//  (try printing freshly retrieved entity, must not be retrieved from cache)
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
abstract class Emoji(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0
)

@Entity
@DiscriminatorValue("UNICODE")
data class UnicodeEmoji @MapStructConstructor constructor(
    val unicode: String,
) : Emoji()

@Entity
@DiscriminatorValue("CUSTOM")
data class CustomEmoji @MapStructConstructor constructor(
    val discordId: Long,
    val name: String,
    val animated: Boolean
) : Emoji()